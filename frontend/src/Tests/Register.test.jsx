import React from "react";
import { render, screen } from "@testing-library/react";
import Register from "../Pages/Register";

it("checks register account type buttons exist", () => {
	render(<Register />);
	expect(screen.getByText("Customer").type).toBe("button");
	expect(screen.getByText("Service Professional").type).toBe("button");
});

it("checks register input names match backend names", () => {
	const { container } = render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();

	expect(screen.getByLabelText("Email").name).toBe("email");
	expect(screen.getByLabelText("Password").name).toBe("password");
	expect(screen.getByLabelText("First Name").name).toBe("firstName");
	expect(screen.getByLabelText("Last Name").name).toBe("lastName");
	expect(screen.getByLabelText("Address").name).toBe("address");
	expect(screen.getByLabelText("Phone Number").name).toBe("phoneNumber");
	expect(screen.getByLabelText("License Number").name).toBe("license");
	expect(container.querySelector("input[name=\"type\"]")).toBeInTheDocument();
});

it("checks register input types are valid", () => {
	const { container } = render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();
	
	expect(screen.getByLabelText("Email").type).toBe("email");
	expect(screen.getByLabelText("Password").type).toBe("password");
	expect(screen.getByLabelText("First Name").type).toBe("text");
	expect(screen.getByLabelText("Last Name").type).toBe("text");
	expect(screen.getByLabelText("Address").type).toBe("text");
	expect(screen.getByLabelText("Phone Number").type).toBe("tel");
	expect(screen.getByLabelText("License Number").type).toBe("number");
	expect(container.querySelector("input[name=\"type\"]").type).toBe("hidden");
});

it("checks register inputs are required", () => {
	const { container } = render(<Register />);
	// simulate customer button click
	screen.getByText("Customer").click();
	
	expect(screen.getByLabelText("Email").required).toBe(true);
	expect(screen.getByLabelText("Password").required).toBe(true);
	expect(screen.getByLabelText("First Name").required).toBe(true);
	expect(screen.getByLabelText("Last Name").required).toBe(true);
	expect(screen.getByLabelText("Address").required).toBe(true);
	expect(screen.getByLabelText("Phone Number").required).toBe(true);
	expect(screen.getByLabelText("License Number").required).toBe(true);
	expect(container.querySelector("input[name=\"type\"]").required).toBe(true);
});