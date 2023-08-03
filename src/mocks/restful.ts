import { rest } from "msw";

import { UserFicoScore, UserSsn } from "../Question2";

export const mockedScores: UserFicoScore[] = [
  { id: 1, score: 363 },
  { id: 2, score: 444 },
  { id: 3, score: 594 },
  { id: 4, score: 187 },
  { id: 5, score: 58 },
  { id: 6, score: 245 },
  { id: 7, score: 140 },
  { id: 8, score: 206 },
  { id: 9, score: 783 },
  { id: 10, score: 265 },
];

export const mockedSsns: UserSsn[] = [
  { id: 1, ssn: "999-99-3660" },
  { id: 2, ssn: "999-99-1747" },
  { id: 3, ssn: "999-99-2057" },
  { id: 4, ssn: "999-99-7430" },
  { id: 5, ssn: "999-99-5897" },
  { id: 6, ssn: "999-99-4484" },
  { id: 7, ssn: "999-99-9169" },
  { id: 8, ssn: "999-99-3736" },
  { id: 9, ssn: "999-99-2518" },
  { id: 10, ssn: "999-99-7413" },
];

export const handlers = [
  rest.get("http://localhost/user_fico_scores.json", (_req, resp, ctx) => {
    return resp(ctx.status(200), ctx.json(mockedScores));
  }),
  rest.get("http://localhost/user_ssns.json", (_req, resp, ctx) => {
    return resp(ctx.status(200), ctx.json(mockedSsns));
  }),
  rest.get("http://localhost/hello", (_req, resp, ctx) => {
    return resp(ctx.status(200), ctx.json({ hello: 1 }));
  }),
  rest.get("http://localhost/hello.json", (_req, resp, ctx) => {
    return resp(ctx.status(200), ctx.json({ hello: 2 }));
  }),

  rest.get("http://localhost/api/data", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        title: `GET ${req.url} `,
        message: "Mocked response from MSW!",
      })
    );
  }),
];
