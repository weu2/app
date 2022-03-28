export function backendLogin(email, password) {
	return fetch("/api/v1/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			pwd: password
		})
	}).then(res => res.json());
}

export function backendRegister(email, password, isCustomer, firstName, lastName) {
	return fetch("/api/v1/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			pwd: password,
			iscustomer: isCustomer,
			firstname: firstName,
			lastname: lastName
		})
	}).then(res => res.json());
}

export function backendTest() {
	return fetch("/api/v1/test").then(res => res.json());
}

export function getBackendURL() {
	return fetch("/api/v1/ip").then(res => res.json());
}