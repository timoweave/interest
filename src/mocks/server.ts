import { setupServer } from "msw/node";
import { handlers } from "./restful";

export const server = setupServer(...handlers);
