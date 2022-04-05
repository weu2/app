
// fetchStrict() detours fetch() to reject when the request is not OK
// Use .status(XXX) in the backend to cause a rejection

function fetchStrict(endpoint, options) {
	return new Promise((resolve, reject) => {
		fetch(endpoint, options).then(async(response) => {
			if (response.ok) {
				resolve(response); // Allow handlers to choose json() or text()
			} else {
				reject(await response.text()); // Assume errors are text()
			}
		}).catch(reject);
	});
}

export function backendLogin(email, password) {
	return fetchStrict("/api/v1/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			pwd: password
		})
	}).then(res => res.text());
}

export function backendRegister(email, password, type, firstName, lastName) {
	return fetchStrict("/api/v1/register", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			email: email,
			pwd: password,
			type: type,
			firstname: firstName,
			lastname: lastName
		})
	}).then(res => res.text());
}

export function backendTest() {
	return fetchStrict("/api/v1/test").then(res => res.json());
}

export function backendGetURL() {
	return fetchStrict("/api/v1/ip").then(res => res.json());
}

// the backend will respond with status "401" if the user does not 
// posses a valid claim or if there is no claim, the claim is stored in a 
// cookie set by the server and the frontend never has to worry about passing the claim back and forth
// only ever deal with "you're not valid" state
export function backendGetUserInfo() {
	return fetchStrict("/api/v1/getinfo").then(res => res.json());
}