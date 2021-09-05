import React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { rest } from "msw";
import { setupServer } from "msw/node";
import { MockServer } from "./MockServer";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/users/1", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ username: "Bred dummy" }));
  })
);

// 一番最初に一回だけよびだされる
beforeAll(() => server.listen());
// テストケースが変わるごとに呼び出される
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
// 最後に一回呼び出される
afterAll(() => server.close());

describe("Mocking API", () => {
  test("[Fetch success] should display fetched data correctly and button disabled", async () => {
    render(<MockServer />);
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("Bred dummy")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveAttribute("disabled");
  });

  test("[Fetch Error] should display error message, no render heading and button ", async () => {
    server.use(
      rest.get(
        "https://jsonplaceholder.typicode.com/users/1",
        (req, res, ctx) => {
          return res(ctx.status(404));
        }
      )
    );
    render(<MockServer />);
    userEvent.click(screen.getByRole("button"));
    expect(await screen.findByTestId("error")).toHaveTextContent(
      "Fetching Failed !"
    );
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByRole("button")).not.toHaveAttribute("disabled");
  });
});
