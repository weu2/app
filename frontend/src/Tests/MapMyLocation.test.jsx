import React from "react";
import { render, screen } from "@testing-library/react";
import MapMyLocation from "../Components/MapMyLocation";

it("checks map marker is rendered", () => {
	render(<MapMyLocation
		position={[24.0, 36.0]}
		style={{ width: "128px", height: "128px" }}
	/>);
	expect(screen.getByRole("img")).toBeInTheDocument();
});

it("checks map marker has correct icon", () => {
	render(<MapMyLocation
		position={[24.0, 36.0]}
		style={{ width: "128px", height: "128px" }}
	/>);
	const markerSrc = screen.getByRole("img").src;
	expect(markerSrc.split("/").pop()).toEqual("markerself.png");
});