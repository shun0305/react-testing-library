import React from "react";
import { render, screen } from "@testing-library/react";
import { UseEffectRender } from "./UseEffectRender";

describe("useEffect rendering", () => {
  test("should render only after async function resolved", async () => {
    render(<UseEffectRender />);

    // 非同期関数のテスト
    // axiosが機能する前
    // 文字列の一部なので正規表現を用いる
    expect(screen.queryByText(/I am/)).toBeNull();
    // axiosを待った後の挙動
    expect(await screen.findByText(/I am/)).toBeInTheDocument();
  });
});
