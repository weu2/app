import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

/* SASS file includes and modifies Bootstrap stylesheet */
import "./index.scss";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import RequestCallout from "./Pages/RequestCallout";
import NearbyProfessionals from "./Pages/NearbyProfessionals";
import CalloutDetails from "./Pages/CalloutDetails";
import FindCallouts from "./Pages/FindCallouts";
import NoPage from "./Pages/404";

import NavigationBar from "./Components/NavigationBar";
import LocationTracker from "./Components/LocationTracker";

// Ensure React Leaflet maps work on all pages
import "leaflet/dist/leaflet.css";

// Replace marker icon and fix icon not loading (see github.com/PaulLeCam/react-leaflet/issues/808)
import L from "leaflet";
import marker from "./Assets/marker.png";
import marker2x from "./Assets/marker_2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: marker,
	iconRetinaUrl: marker2x,
	shadowUrl: null,
	iconSize: [50, 50],
	iconAnchor: [25, 50]
});

render(
	<React.StrictMode>
		<BrowserRouter>
			<NavigationBar />
			<LocationTracker />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="profile" element={<Profile />} />
				<Route path="findcallouts" element={<FindCallouts />} />
				<Route path="requestcallout" element={<RequestCallout />} />
				<Route path="nearbyprofessionals" element={<NearbyProfessionals />} />
				<Route path="callout/:id" element={<CalloutDetails />} />
				<Route path="*" element={<NoPage />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
