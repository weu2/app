import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../Pages/Login";

it("checks login input names match backend names", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").name).toBe("email");
	expect(screen.getByLabelText("Password").name).toBe("password");
});

it("checks login input types are valid", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").type).toBe("email");
	expect(screen.getByLabelText("Password").type).toBe("password");
});

it("checks login inputs are required", () => {
	render(<Login />);
	expect(screen.getByLabelText("Email").required).toBe(true);
	expect(screen.getByLabelText("Password").required).toBe(true);
});