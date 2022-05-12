// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Fake geolocation API for tests, from stackoverflow.com/questions/43008925
global.navigator.geolocation = {
	watchPosition: jest.fn()
		.mockImplementationOnce((success) => Promise.resolve(
			success({ coords: { latitude: 12, longitude: 24 }})
		)
	),
	getCurrentPosition: jest.fn()
		.mockImplementationOnce((success) => Promise.resolve(
			success({ coords: { latitude: 12, longitude: 24 }})
		)
	),
};

// Fake SVG rendering for React Leaflet, from stackoverflow.com/questions/54382414
const createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function(namespaceURI, qualifiedName) {
	if (namespaceURI === "http://www.w3.org/2000/svg" && qualifiedName === "svg"){
	const element = createElementNSOrig.apply(this, arguments)
		element.createSVGRect = function() {};
		return element;
	}
	return createElementNSOrig.apply(this, arguments)
}

// Fake navigation API for notifications
global.navigator.serviceWorker = jest.fn();
global.Notification = jest.fn();