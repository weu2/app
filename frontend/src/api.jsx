// This file contains utility functions for getting or sending data from the frontend to the backend.
// To interact with any backend API on the frontend, it should be added in here.

// This file can probably be deleted later since the calls are mostly one liners

// fetchStrict() detours fetch() to reject when the request is not OK
// Use .status(XXX) in the backend to cause a rejection
function fetchStrict(endpoint, options) {
	return new Promise((resolve, reject) => {
		fetch(endpoint, options).then(response => {
			if (response.ok) {
				resolve(response);
			} else {
				reject(response);
			}
		}).catch(reject);
	});
}

// Attempts to log into the backend, compares password to stored password hash
export function backendLogin(formData) {
	return fetchStrict("/api/v1/user/login", {
		method: "POST",
		body: formData
	});
}

// Attempts to register an account, adding a new entry to /data/users.json
export function backendRegister(formData) {
	return fetchStrict("/api/v1/user/register", {
		method: "POST",
		body: formData
	});
}

// Attempts to update account details, currently only certain details can be updated
export function backendUpdate(formData) {
	return fetchStrict("/api/v1/user/update", {
		method: "POST",
		body: formData
	});
}

// Basic test to check if the backend is broken
export function backendTest() {
	return fetchStrict("/api/v1/test").then(res => res.json());
}

// Gets a public URL for the website so other people can open it, may not work yet
export function backendGetURL() {
	return fetchStrict("/api/v1/ip").then(res => res.json());
}

// the backend will respond with status "401" if the user does not 
// posses a valid claim or if there is no claim, the claim is stored in a 
// cookie set by the server and the frontend never has to worry about passing the claim back and forth
// only ever deal with "you're not valid" state
export function backendGetUserInfo() {
	return fetchStrict("/api/v1/user/getinfo").then(res => res.json());
}

// Upload an image to the backend, returns the UUID
export function backendUploadImage(image) {
	return fetchStrict("/api/v1/callout/uploadimage", {
		method: "POST",
		body: image
	}).then(res => res.json());
}

// Attempts to open a new callout, adding a new entry to /data/callouts.json
export function backendCreateCallout(formData) {
	return fetchStrict("/api/v1/callout/create", {
		method: "POST",
		body: formData
	});
}

// Gets a list of callouts, either all opened by a customer or accepted by a service professional
export function backendGetMyCallouts() {
	return fetchStrict("/api/v1/callout/list").then(res => res.json());
}

// Gets a list of new callouts
export function backendGetNewCallouts() {
	return fetchStrict("/api/v1/callout/newcallouts").then(res => res.json());
}

// Gets detail on one specific callout
export function backendGetCallout(calloutId) {
	return fetchStrict("/api/v1/callout/status", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			calloutid: calloutId
		})
	}).then(res => res.json());
}

// Changes the status of a callout
export function backendUpdateCallout(calloutId, status) {
	return fetchStrict("/api/v1/callout/update", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			calloutid: calloutId,
			status: status
		})
	}).then(res => res.json());
}