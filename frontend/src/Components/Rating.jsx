import React from "react";

import ReactStars from "react-rating-stars-component";

class Rating extends React.Component {

    handleRatingChange= (rating) =>{
        console.log(rating);
    }



  render(){
    return (
        <div>
            <ReactStars count={5} size={40} onChange={this.handleRatingChange} activeColor="#FF449E" />
        </div>
  )}
}

export default Rating
