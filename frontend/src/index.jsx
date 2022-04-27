import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";

import NavigationBar from "./Components/NavigationBar";

/* SASS file includes and modifies Bootstrap stylesheet */
import "./index.scss";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Profile from "./Pages/Profile";
import RequestCallout from "./Pages/RequestCallout";
import CalloutView from "./Pages/CalloutView";
import NoPage from "./Pages/404";

render(
	<React.StrictMode>
		<BrowserRouter>
			<NavigationBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="profile" element={<Profile />} />
				<Route path="requestcallout" element={<RequestCallout />} />
				<Route path="callout/:id" element={<CalloutView />} />
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
