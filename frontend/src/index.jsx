import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import RegisterTest from "./Pages/RegisterTest";
import LocationTest from "./Pages/LocationTest";
import Dashboard from "./Pages/Dashboard";
import NoPage from "./Pages/404";

render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<RegisterTest />} />
				<Route path="location" element={<LocationTest />} />
				<Route path="dashboard" element={<Dashboard />} />
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
