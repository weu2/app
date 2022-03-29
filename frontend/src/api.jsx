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

export function backendRegister(email, password, category, firstName, lastName) {
	return fetch("/api/v1/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			pwd: password,
			category: category,
			firstname: firstName,
			lastname: lastName
		})
	}).then(res => res.json());
}

export function backendTest() {
	return fetch("/api/v1/test").then(res => res.json());
}

export function backendGetURL() {
	return fetch("/api/v1/ip").then(res => res.json());
}

// the backend will respond with code "401 - Unauthorized" if the user does not 
// posses a valid claim or if there is no claim, the claim is stored in a 
// cookie set by the server and the frontend never has to worry about passing the claim back and forth
// only ever deal with "you're not valid" state
function wrapAuthorisedEndpoint(endpoint, data = undefined) {
	return new Promise((resolve, reject) => {
		fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: data ? JSON.stringify(data) : "{}"
		}).then(response => {
			if (response.status === 200) {
				resolve(response.json());
			} else {
				reject();
			}
		}).catch(reject);
	});
}

export function backendGetUserInfo() {
	return wrapAuthorisedEndpoint("/api/v1/getinfo");
}