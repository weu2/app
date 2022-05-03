import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../Pages/Profile";

it("checks profile input names match backend names", () => {
	render(<Profile />);
	expect(screen.getByLabelText("Email").name).toBe("email");
	expect(screen.getByLabelText("First Name").name).toBe("firstName");
	expect(screen.getByLabelText("Last Name").name).toBe("lastName");
	expect(screen.getByLabelText("Address").name).toBe("address");
	expect(screen.getByLabelText("Phone Number").name).toBe("phoneNumber");
	expect(screen.getByLabelText("License Number").name).toBe("license");
});

it("checks profile input types are valid", () => {
	render(<Profile />);
	expect(screen.getByLabelText("Email").type).toBe("email");
	expect(screen.getByLabelText("First Name").type).toBe("text");
	expect(screen.getByLabelText("Last Name").type).toBe("text");
	expect(screen.getByLabelText("Address").type).toBe("text");
	expect(screen.getByLabelText("Phone Number").type).toBe("tel");
	expect(screen.getByLabelText("License Number").type).toBe("number");
});

it("checks profile inputs are required", () => {
	render(<Profile />);
	expect(screen.getByLabelText("Email").required).toBe(true);
	expect(screen.getByLabelText("First Name").required).toBe(true);
	expect(screen.getByLabelText("Last Name").required).toBe(true);
	expect(screen.getByLabelText("Address").required).toBe(true);
	expect(screen.getByLabelText("Phone Number").required).toBe(true);
	expect(screen.getByLabelText("License Number").required).toBe(true);
});