import { describe, test, expect } from "vitest";
import { fetch } from "cross-fetch";
import {
  Question2,
  UserCreditProvider,
  fetchUserSnnAndFicoScore,
  ficoScoreSortByID,
  ssnSortBySsn,
  useUserCredit,
} from "../Question2";
import { question2GetDataTestIDFromRender } from "./utils";
import { render, renderHook, waitFor } from "@testing-library/react";

import { mockedScores, mockedSsns } from "../mocks/restful";

describe("Question2", async () => {
  const context = { wrapper: UserCreditProvider };

  test("initial", async () => {
    const rendered = renderHook(() => useUserCredit(), context);
    const credit = () => rendered.result.current;

    await waitFor(() => {
      expect(credit().answer).toBeNull();
      expect(credit().ssns).toEqual([]);
      expect(credit().scores).toEqual([]);
      expect(credit().filteredSsns).toEqual([]);
      expect(credit().selectedSsn).toEqual(null);
    });

    expect(credit().answer).toBeNull();
    expect(credit().ssns).toEqual([]);
    expect(credit().scores).toEqual([]);
    expect(credit().filteredSsns).toEqual([]);
    expect(credit().selectedSsn).toEqual(null);
  });

  test("hello mock fetch data", async () => {
    const response = await fetch("http://localhost/hello");
    const data = await response.json();
    expect(data).toEqual({ hello: 1 });
  });

  test("hello.json mock fetch data", async () => {
    const response = await fetch("http://localhost/hello.json");
    const data = await response.json();
    expect(data).toEqual({ hello: 2 });
  });

  test("mock fetch data", async () => {
    const { ssns, scores } = await fetchUserSnnAndFicoScore(
      "http://localhost/user_ssns.json",
      "http://localhost/user_fico_scores.json"
    );
    expect(ssns).toEqual(mockedSsns);
    expect(scores).toEqual(mockedScores);
  });

  test("mock with renderHook", async () => {
    const rendered = renderHook(() => useUserCredit(), context);

    const credit = () => rendered.result.current;
    await waitFor(() => {});

    expect(credit().answer).toEqual(null);
    expect(credit().selectedSsn).toEqual(null);
    expect(credit().ssns).toEqual(mockedSsns); // TBD
    expect(credit().scores).toEqual(mockedScores); // TBD
  });

  test("mock with render", async () => {
    const rendered = render(<Question2 dataTestID="T8" />, context);
    const credit = question2GetDataTestIDFromRender(rendered, "T8");

    expect(credit.title()).toHaveTextContent("Question 2");
    expect(credit.filterSsn()).toHaveValue("");
    expect(credit.selectSsn()).toHaveValue("");

    expect(credit.rate()).toHaveTextContent("");
    expect(credit.optionSsnIth(0)).toHaveValue("");
    expect(credit.optionSsnIth(0)).toHaveTextContent(
      "Please choose one option"
    );
    expect(credit.optionSsnIth(1)).toHaveValue(mockedSsns[0].ssn); // TBD
    expect(credit.optionSsnIth(2)).toHaveValue(mockedSsns[1].ssn); // TBD
  });
});
