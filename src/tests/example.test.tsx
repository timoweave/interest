import { describe, test, expect } from "vitest";
import { render, renderHook, waitFor } from "@testing-library/react";
import { Example, useExample } from "../Example";
import { exampleGetDataTestIDElement } from "./utils";
import { fetch } from "cross-fetch";
import {
  mockedApiDataResponse,
  mockedScores,
  mockedSsns,
} from "../mocks/restful";
import { server } from "../mocks/server";
import { rest } from "msw";

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

  test("render", async () => {
    const rendered = render(<Example />);
    const example = exampleGetDataTestIDElement(rendered, "T5");
    expect(rendered).not.toBeNull();
    expect(example.noData()).toBeInTheDocument();

    await waitFor(() => {}); // wait for next update

    expect(example.title()).toHaveTextContent("GET http://localhost/api/data");
    expect(example.message()).toHaveTextContent("Mocked response from MSW!");
  });

  test("renderHook", async () => {
    const rendered = renderHook(() =>
      useExample({ url: "http://localhost/api/data" })
    );
    const example = () => rendered.result.current;
    const exampleState = () => {
      const { data, title, message } = rendered.result.current;
      return { data, title, message };
    };

    expect(example().title).toEqual(null);
    expect(example().message).toEqual(null);

    await waitFor(() => {});

    expect(exampleState()).toEqual({
      data: {
        message: "Mocked response from MSW!",
        title: "GET http://localhost/api/data",
      },
      message: "Mocked response from MSW!(generated)",
      title: "GET http://localhost/api/data(generated)",
    });
  });

  test.skip("renderHook, with mock data hello", async () => {
    server.use(
      rest.get("http://localhost/api/data", (_req, res, ctx) => {
        res(ctx.json({ title: "greeting", message: "hello" }));
      })
    );
    const rendered = renderHook(() =>
      useExample({ url: "http://localhost/api/data" })
    );
    const example = () => rendered.result.current;
    const exampleState = () => {
      const { data, title, message } = rendered.result.current;
      return { data, title, message };
    };

    expect(example().title).toEqual(null);
    expect(example().message).toEqual(null);
    expect(exampleState()).toEqual({
      data: null,
      title: null,
      message: null,
    });

    await waitFor(() => {});
    expect(exampleState()).toEqual({
      data: {
        title: "greeting", // TBD
        message: "hello",
      },
      title: "greeting(generated)",
      message: "hello(generated)",
    });
  });
});
