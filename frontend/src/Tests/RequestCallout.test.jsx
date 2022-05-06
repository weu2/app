import React from "react";
import { render, screen } from "@testing-library/react";
import RequestCallout from "../Pages/RequestCallout";

it("checks request callout input names match backend names", () => {
	const { container } = render(<RequestCallout />);
	expect(screen.getByLabelText("Number Plate").name).toBe("numberPlate");
	expect(screen.getByLabelText("Description").name).toBe("description");
	expect(screen.getByLabelText("Latitude").name).toBe("locationLat");
	expect(screen.getByLabelText("Longitude").name).toBe("locationLong");
	expect(container.querySelector("input[name=\"dateTime\"]")).toBeInTheDocument();
});

it("checks request callout input types are valid", () => {
	const { container } = render(<RequestCallout />);
	expect(screen.getByLabelText("Number Plate").type).toBe("text");
	expect(screen.getByLabelText("Description").type).toBe("textarea");
	expect(screen.getByLabelText("Latitude").type).toBe("number");
	expect(screen.getByLabelText("Longitude").type).toBe("number");
	expect(container.querySelector("input[name=\"dateTime\"]").type).toBe("hidden");
});

it("checks request callout inputs are required", () => {
	const { container } = render(<RequestCallout />);
	expect(screen.getByLabelText("Number Plate").required).toBe(true);
	expect(screen.getByLabelText("Description").required).toBe(true);
	expect(screen.getByLabelText("Latitude").required).toBe(true);
	expect(screen.getByLabelText("Longitude").required).toBe(true);
	expect(container.querySelector("input[name=\"dateTime\"]").required).toBe(true);
});