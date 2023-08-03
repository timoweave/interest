import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { server } from "./src/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
beforeEach(() => server.resetHandlers());
afterEach(() => server.resetHandlers());
