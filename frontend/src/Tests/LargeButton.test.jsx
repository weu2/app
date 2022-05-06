import React from "react";
import { render, screen } from "@testing-library/react";
import LargeButton from "../Components/LargeButton";

it("checks button arrow icon is rendered", () => {
	render(<LargeButton icon="arrow-right">Hello</LargeButton>);
	const button = screen.getByText("Hello");
	expect(button.innerHTML).toEqual(expect.stringContaining("fa-arrow-right"));
});

it("checks button plus icon is rendered", () => {
	render(<LargeButton icon="plus">Hello</LargeButton>);
	const button = screen.getByText("Hello");
	expect(button.innerHTML).toEqual(expect.stringContaining("fa-plus"));
});

it("checks button width is large", () => {
	render(<LargeButton>Hello</LargeButton>);
	const button = screen.getByText("Hello");
	expect(button.className).toEqual(expect.stringContaining("w-100"));
});