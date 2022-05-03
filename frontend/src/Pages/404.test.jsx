import React from "react";
import { render, screen } from "@testing-library/react";
import NoPage from "./404";

it("renders 404 message", () => {
	render(<NoPage />);
	expect(screen.toContain("404")).toBeInTheDocument();
});