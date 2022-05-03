import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { render, screen } from "@testing-library/react";
import CustomMarker from "../Components/CustomMarker";

it("checks default marker icon is rendered", () => {
	render(<MapContainer center={[16, 32]} zoom={16}>
		<CustomMarker position={[16, 32]}/>
	</MapContainer>);
	const markerSrc = screen.getByRole("img").src;
	expect(markerSrc.split("/").pop()).toBe("markerself.png");
});

it("checks self marker icon is rendered", () => {
	render(<MapContainer center={[16, 32]} zoom={16}>
		<CustomMarker icon="self" position={[16, 32]}/>
	</MapContainer>);
	const markerSrc = screen.getByRole("img").src;
	expect(markerSrc.split("/").pop()).toBe("markerself.png");
});

it("checks mechanic marker icon is rendered", () => {
	render(<MapContainer center={[16, 32]} zoom={16}>
		<CustomMarker icon="mechanic" position={[16, 32]}/>
	</MapContainer>);
	const markerSrc = screen.getByRole("img").src;
	expect(markerSrc.split("/").pop()).toBe("markermechanic.png");
});

it("checks callout marker icon is rendered", () => {
	render(<MapContainer center={[16, 32]} zoom={16}>
		<CustomMarker icon="callout" position={[16, 32]}/>
	</MapContainer>);
	const markerSrc = screen.getByRole("img").src;
	expect(markerSrc.split("/").pop()).toBe("markercallout.png");
});