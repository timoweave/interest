import { describe, test, expect } from "vitest";
import { fetch } from "cross-fetch";
import {
  FicoScoreInterestRate,
  Question2,
  UserCreditProvider,
  fetchUserSnnAndFicoScore,
  getRate,
  useUserCredit,
  useUserCreditContext,
} from "../Question2";
import { question2GetDataTestIDElement } from "./utils";
import { act, render, renderHook, waitFor } from "@testing-library/react";

import { mockedScores, mockedSsns } from "../mocks/restful";
import { server } from "../mocks/server";
import { rest } from "msw";

describe("Question2", async () => {
  const context = { wrapper: UserCreditProvider };

  test("check interest rate", () => {
    const rate: FicoScoreInterestRate[] = [
      { lower: 1, upper: 300, rate: 0.1 },
      { lower: 300, upper: 500, rate: 0.2 },
      { lower: 500, upper: 800, rate: 0.3 },
    ];
    expect(() => getRate(0, rate)).toThrow("INVALID RATE");
    expect(getRate(99, rate)).toEqual(0.1);
    expect(getRate(211, rate)).toEqual(0.1);
    expect(getRate(363, rate)).toEqual(0.2);
    expect(getRate(432, rate)).toEqual(0.2);
    expect(getRate(550, rate)).toEqual(0.3);
    expect(getRate(799, rate)).toEqual(0.3);
  });

  test("renderHook, initial", async () => {
    const rendered = renderHook(() => useUserCreditContext(), context);
    const credit = () => rendered.result.current;

    await waitFor(() => {}, { timeout: 3_000 });

    expect(credit().answer).toBeNull();
    expect(credit().ssns).toEqual([]);
    expect(credit().scores).toEqual([]);
    expect(credit().filteredSsns).toEqual([]);
    expect(credit().selectedSsn).toEqual(null);
  });

  test("fetch /hello", async () => {
    const response = await fetch("http://localhost/hello");
    const data = await response.json();
    expect(data).toEqual({ hello: 1 });
  });

  test("fetch /hello.json", async () => {
    const response = await fetch("http://localhost/hello.json");
    const data = await response.json();
    expect(data).toEqual({ hello: 2 });
  });

  test("fetch user ssn and fico score", async () => {
    const { ssns, scores } = await fetchUserSnnAndFicoScore(
      "http://localhost/user_ssns.json",
      "http://localhost/user_fico_scores.json"
    );
    expect(ssns).toEqual(mockedSsns);
    expect(scores).toEqual(mockedScores);
  });

  test("useUserCreditContext, select ssn and find interest rate", async () => {
    const scores = [{ id: 1, score: 363 }];
    const ssns = [{ id: 1, ssn: "999-99-3660" }];
    const interestRates = [{ lower: 300, upper: 400, rate: 0.363 }];
    const init = { scores, ssns, interestRates };
    const rendered = renderHook(() => useUserCreditContext(init));
    const credit = () => rendered.result.current;
    const creditState = () => {
      const { answer, selectedSsn } = rendered.result.current;
      return { answer, selectedSsn };
    };
    const waitForOpt = { timeout: 3_000, interval: 1 };
    await waitFor(() => {}, waitForOpt);
    expect(creditState()).toEqual({
      answer: null,
      selectedSsn: null,
    });

    act(() => credit().setSelectedSsn("999-99-3660"));
    await waitFor(() => {
      expect(creditState().answer).not.toBeNull();
    }, waitForOpt);
    expect(creditState().answer?.rate).toEqual(0.363);
    expect(creditState()).toEqual({
      answer: {
        ssn: "999-99-3660",
        rate: 0.363,
      },
      selectedSsn: "999-99-3660",
    });
  });

  test("renderHook, mock with data", async () => {
    server.use(
      rest.get("http://localhost/user_ssns.json", (_req, res, ctx) => {
        return res(ctx.json([{ id: 1, ssn: "999-99-9999" }]));
      }),
      rest.get("http://localhost/user_fico_scores.json", (_req, res, ctx) => {
        return res(ctx.json([{ id: 1, score: 555 }]));
      })
    );
    const rendered = renderHook(() => useUserCredit(), context);
    const credit = () => rendered.result.current;
    const waitForOpt = { timeout: 3_000, interval: 1 };
    await waitFor(() => {
      expect(credit().ssns.length).greaterThan(0);
    }, waitForOpt);

    expect(credit().ssns.length).toEqual(1);
    expect(credit().answer).toEqual(null);
    expect(credit().selectedSsn).toEqual(null);
    expect(credit().ssns).toEqual([{ id: 1, ssn: "999-99-9999" }]);
    expect(credit().scores).toEqual([{ id: 1, score: 555 }]);
  });

  test("render, with mock data render", async () => {
    server.use(
      rest.get("http://localhost/user_ssns.json", (_req, res, ctx) => {
        return res(
          ctx.json([
            { id: 1, ssn: "333-22-0001" },
            { id: 2, ssn: "333-22-0002" },
          ])
        );
      }),
      rest.get("http://localhost/user_fico_scores.json", (_req, res, ctx) => {
        return res(
          ctx.json([
            { id: 1, score: 765 },
            { id: 1, score: 465 },
          ])
        );
      })
    );
    const rendered = render(<Question2 dataTestID="T8" />, context);
    const credit = question2GetDataTestIDElement(rendered, "T8");

    const waitForOpt = { interval: 1, timeout: 3_000 };
    await waitFor(() => {
      expect(credit.optionSsnIth(1)).not.toBeNull();
      expect(credit.optionSsnIth(2)).not.toBeNull();
    }, waitForOpt);

    expect(credit.title()).toHaveTextContent("Question 2");
    expect(credit.filterSsn()).toHaveValue("");
    expect(credit.selectSsn()).toHaveValue("");

    expect(credit.rate()).toHaveTextContent("");
    expect(credit.optionSsnIth(0)).toHaveTextContent(
      "Please choose one option"
    );
    expect(credit.optionSsnIth(0)).toHaveValue("");
    expect(credit.optionSsnIth(1)).toHaveValue("333-22-0001");
    expect(credit.optionSsnIth(2)).toHaveValue("333-22-0002");
  });
});
