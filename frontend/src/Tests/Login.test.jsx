import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../Pages/Login";

it("checks login input names match backend names", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").name).toEqual("email");
	expect(screen.getByLabelText("Password").name).toEqual("password");
});

it("checks login input types are valid", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").type).toEqual("email");
	expect(screen.getByLabelText("Password").type).toEqual("password");
});

it("checks login inputs are required", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").required).toEqual(true);
	expect(screen.getByLabelText("Password").required).toEqual(true);
});