import React from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import ReactStars from "react-rating-stars-component";

class Review extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			ratingLVL: ""
		};
	}


    handleRatingChange= (rating) =>{
        var ratingLVL_ = "";
        //based on rating score set the text
        switch(rating){

            case 1:
                ratingLVL_ = "Not Great";
                break;

            case 2:
                ratingLVL_ = "Not Good";
                break;

            case 3:
                ratingLVL_ = "Good";
                break;

            case 4:
                ratingLVL_ = "Great";
                break;

            case 5:
                ratingLVL_ = "Awesome";
                break;

        }
        //set the rating text in state
        this.setState({ratingLVL: ratingLVL_})

        //set hidden input to rating value
        document.getElementById("ratingNumber").value = rating;
    }

 
  render(){
    return (
        <Container>

                <Form.Group className="mb-3" controlId="formReviewText">
						<Form.Label>Review</Form.Label>
						<Form.Control
							name="reviewText"
                            input="text"
                            as="textarea"
							rows={4}
						/>
						{/* Display feedback message if the user screws up the input, see react-bootstrap.github.io/forms/validation/ */}
						
					</Form.Group>

                <Form.Group className="mb-3" constolId="formReviewRating">
                    <Form.Label>Rating</Form.Label>

                    {/*Hidden field makes acessing easier later*/}
                    <Form.Control 
                       type="hidden"
                       id="ratingNumber"
                    />
                    
                    {/* uses react stars library */}
                    <ReactStars count={5} size={40} onChange={this.handleRatingChange} activeColor="#FF449E" /> 
                    {this.state.ratingLVL}
                </Form.Group>

            


        </Container>
  )}
}

export default Review