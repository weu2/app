import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../Pages/Register";

it("checks register account type buttons exist", () => {
	render(<Register />);
	expect(screen.getByText("Customer").type).toEqual("button");
	expect(screen.getByText("Service Professional").type).toEqual("button");
});

it("checks register input names match backend names", () => {
	render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();

	expect(screen.getByLabelText("Email").name).toEqual("email");
	expect(screen.getByLabelText("Password").name).toEqual("password");
	expect(screen.getByLabelText("First Name").name).toEqual("firstName");
	expect(screen.getByLabelText("Last Name").name).toEqual("lastName");
	expect(screen.getByLabelText("Address").name).toEqual("address");
	expect(screen.getByLabelText("Phone Number").name).toEqual("phoneNumber");
	expect(screen.getByLabelText("License Number").name).toEqual("license");
});

it("checks register input types are valid", () => {
	render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();
	
	expect(screen.getByLabelText("Email").type).toEqual("email");
	expect(screen.getByLabelText("Password").type).toEqual("password");
	expect(screen.getByLabelText("First Name").type).toEqual("text");
	expect(screen.getByLabelText("Last Name").type).toEqual("text");
	expect(screen.getByLabelText("Address").type).toEqual("text");
	expect(screen.getByLabelText("Phone Number").type).toEqual("tel");
	expect(screen.getByLabelText("License Number").type).toEqual("number");
});

it("checks register inputs are required", () => {
	render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();
	
	expect(screen.getByLabelText("Email").required).toEqual(true);
	expect(screen.getByLabelText("Password").required).toEqual(true);
	expect(screen.getByLabelText("First Name").required).toEqual(true);
	expect(screen.getByLabelText("Last Name").required).toEqual(true);
	expect(screen.getByLabelText("Address").required).toEqual(true);
	expect(screen.getByLabelText("Phone Number").required).toEqual(true);
	expect(screen.getByLabelText("License Number").required).toEqual(true);
});