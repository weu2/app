

function getDistance(latitude1, longitude1, latitude2, longitude2) {
	// get delta
	const dLat = latitude1 - latitude2;
	const dLong = longitude1 - longitude2;
	// convert to km
	const latKm = dLat * 110.574;
	const longKm = 111.320 * Math.cos(dLat) * dLong;
	// year 8 math
	const distance = Math.sqrt((latKm * latKm) + (longKm * longKm));
	return distance;
}


module.exports.getDistance = getDistance;