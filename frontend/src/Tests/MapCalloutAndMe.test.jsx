import React from "react";
import { render, screen } from "@testing-library/react";
import MapCalloutAndMe from "../Components/MapCalloutAndMe";

it("checks two map markers are rendered", () => {
	render(<MapCalloutAndMe
		position={[24.0, 36.0]}
		style={{ width: "128px", height: "128px" }}
	/>);
	const markers = screen.getAllByAltText("Marker");
	expect(markers.length).toBe(2);
});

it("checks map markers have correct icons", () => {
	render(<MapCalloutAndMe
		position={[24.0, 36.0]}
		style={{ width: "128px", height: "128px" }}
	/>);
	const markers = screen.getAllByAltText("Marker");
	const markerSrcs = markers.map(marker => marker.src.split("/").pop());
	expect(markerSrcs).toEqual(
		expect.arrayContaining(["markerself.png", "markercallout.png"])
	);
});