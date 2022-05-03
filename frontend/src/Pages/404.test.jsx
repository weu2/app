import React from "react";
import { render, screen } from "@testing-library/react";
import NoPage from "./404";

it("renders 404 message", () => {
	render(<NoPage />);
	const header = screen.getByRole("heading", { level: 1 });
	expect(header.textContent).toMatch("404");
});