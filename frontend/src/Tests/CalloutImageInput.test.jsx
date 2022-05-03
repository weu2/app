import React from "react";
import { render } from "@testing-library/react";
import CalloutImageInput from "../Components/CalloutImageInput";

it("checks callout image input names match backend names", () => {
	const { container } = render(<CalloutImageInput callout={{ images: [] }}/>);
	expect(container.querySelector("input[name=\"image\"]")).toBeInTheDocument();
	expect(container.querySelector("input[name=\"calloutid\"]")).toBeInTheDocument();
});

it("checks callout image input types are valid", () => {
	const { container } = render(<CalloutImageInput callout={{ images: [] }}/>);
	expect(container.querySelector("input[name=\"image\"]").type).toBe("file");
	expect(container.querySelector("input[name=\"calloutid\"]").type).toBe("hidden");
});