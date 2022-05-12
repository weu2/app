// useParams() can only be used in a function component
// This class returns the output through a property "onload"
// Use like <UrlPartGrabber onload={console.log} />

import React from "react";
import { useParams } from "react-router-dom";

function UrlPartGrabber(props) {
	props.onload(useParams());
	return null;
}

// React.memo prevents this from refreshing the page infinitely
export default React.memo(UrlPartGrabber);