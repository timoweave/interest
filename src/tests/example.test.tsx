import { describe, test, expect } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Example } from "../Example";
import { exampleGetDataTestIDFromRender } from "./utils";
import { fetch } from "cross-fetch";
import {
  mockedApiDataResponse,
  mockedScores,
  mockedSsns,
} from "../mocks/restful";

describe("example component", async () => {
  test("fetch fico credit scores", async () => {
    const resp = await fetch("http://localhost/user_fico_scores.json");
    const data = await resp.json();
    expect(data).toEqual(mockedScores);
  });

  test("fetch user social security number", async () => {
    const resp = await fetch("http://localhost/user_ssns.json");
    const data = await resp.json();
    expect(data).toEqual(mockedSsns);
  });

  test("fetch api/data", async () => {
    const resp = await fetch("http://localhost/api/data");
    const data = await resp.json();
    expect(data).toEqual(mockedApiDataResponse);
  });

  test("on mount", async () => {
    const rendered = render(<Example />);
    const { noData, title, message } = exampleGetDataTestIDFromRender(
      rendered,
      "T5"
    );
    expect(rendered).not.toBeNull();
    expect(noData()).toBeInTheDocument();

    await waitFor(() => {
      expect(title()).toHaveTextContent("GET http://localhost/api/data");
      expect(message()).toHaveTextContent("Mocked response from MSW!");
    });
  });
});
