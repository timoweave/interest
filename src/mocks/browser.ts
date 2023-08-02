import { SetupWorker, setupWorker } from "msw";
import { handlers } from "./restful";

export const worker: SetupWorker = setupWorker(...handlers);
