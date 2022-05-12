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
import CalloutDetails from "./Pages/CalloutDetails";
import FindCallouts from "./Pages/FindCallouts";
import Membership from "./Pages/Membership";
import ReviewList from "./Pages/ReviewList";
import CalloutPayment from "./Pages/CalloutPayment";
import CalloutReview from "./Pages/CalloutReview";
import NoPage from "./Pages/404";

import NavigationBar from "./Components/NavigationBar";
import LocationTracker from "./Components/LocationTracker";

// Ensure React Leaflet maps work on all pages
import "leaflet/dist/leaflet.css";

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
				<Route path="membership" element={<Membership />} />
				<Route path="reviews" element={<ReviewList />} />
				<Route path="callout/:id" element={<CalloutDetails />} />
				<Route path="callout/:id/pay" element={<CalloutPayment />} />
				<Route path="callout/:id/review" element={<CalloutReview />} />
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
