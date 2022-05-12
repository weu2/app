import React from "react";
import { render } from "@testing-library/react";
import CalloutImageInput from "../Components/CalloutImageInput";

it("checks callout image input names match backend names", () => {
	const { container } = render(<CalloutImageInput callout={{ images: [] }} customer />);
	expect(container.querySelector("input[name=\"image\"]")).toBeInTheDocument();
	expect(container.querySelector("input[name=\"calloutId\"]")).toBeInTheDocument();
});

it("checks callout image input types are valid", () => {
	const { container } = render(<CalloutImageInput callout={{ images: [] }} customer />);
	expect(container.querySelector("input[name=\"image\"]").type).toBe("file");
	expect(container.querySelector("input[name=\"calloutId\"]").type).toBe("hidden");
});

it("checks callout image input types are required", () => {
	const { container } = render(<CalloutImageInput callout={{ images: [] }} customer />);
	expect(container.querySelector("input[name=\"image\"]").required).toBe(true);
	expect(container.querySelector("input[name=\"calloutId\"]").required).toBe(true);
});