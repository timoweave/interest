import { describe, test, expect } from "vitest";
import { fetch } from "cross-fetch";

import {
  UserCreditProvider,
  fetchUserSnnAndFicoScore,
  // fetchUserSnnAndFicoScore,
  useUserCredit,
} from "../Question2";
import { /* act,  */ act, renderHook, waitFor } from "@testing-library/react";

import { mockedScores, mockedSsns } from "../mocks/restful";

describe("Question2", async () => {
  const context = { wrapper: UserCreditProvider };

  test("initial", async () => {
    const rendered = renderHook(() => useUserCredit(), context);
    await waitFor(() => {
      const credit = () => rendered.result.current;

      expect(credit().answer).toBeNull();
      expect(credit().ssns).toEqual([]);
      expect(credit().scores).toEqual([]);
      expect(credit().filteredSsns).toEqual([]);
      expect(credit().selectedSsn).toEqual(null);
    });
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

  test.skip("mock fetch data", async () => {
    const rendered = renderHook(() => useUserCredit(), context);
    const credit = () => rendered.result.current;
    await waitFor(() => {
      act(() => {
        fetchUserSnnAndFicoScore({
          url: {
            ssns: "http://localhost/user_ssns.json",
            ficoScores: "http://localhost/user_fico_scores.json",
          },
          state: credit(),
        });
      });

      expect(credit().ssns).toEqual(mockedSsns);
      expect(credit().scores).toEqual(mockedScores);
    });
  });
});
