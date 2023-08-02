import { describe, test, expect } from "vitest";
import { render } from "@testing-library/react";
import { Example } from "../Example";
import { getExampleTestID } from "./utils";

describe("example component", async () => {
  test.skip("on mount", () => {
    const rendered = render(<Example />);
    const { noData, title, message } = getExampleTestID(rendered, "T5");

    expect(rendered).not.toBeNull();
    expect(noData).toBeNull();
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });
});
