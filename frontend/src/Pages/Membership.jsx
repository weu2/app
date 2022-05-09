import React from 'react'

// <Container> adds padding to the sides of the page content, makes it look nicer
import Container from "react-bootstrap/Container";

// <LargeButton> is a subclass of React Bootstrap's <Button> with an icon added to the right side
import LargeButton from "../Components/LargeButton";

import PaymentComponent from '../Components/PaymentComponent';

import Form from "react-bootstrap/Form";

import { backendGetUserInfo } from "../api.jsx";

class Membership extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
            userInfo: null,
			activeMember: false,
            memberEmail: null,
            renewalDate: null
		};
	}

   
    /*Kalebs Plan
        create ui thats rendered for current members, which is just the member status, number and renewal date
        
        create ui that renders for a non-active member which includes the payment component

    */

    renewMembership(){


        console.log("YO HO A BOTTLE OF RUM FOR ME!");
    }


render(){
  return (
    <div>
      <Container>
            <h2>Membership</h2>
            
            {/*Common elements */}

            <h5>Member Number: {this.state.memberNumber}</h5>

            <h5>Membership Status: {this.state.activeMember === true ? <>Active</> : <>Inactive</>}</h5>
            
            <br />

            {/* For active members */}

            {this.state.activeMember === true ? <h5>Membership Renewal Date: {this.state.renewalDate} </h5> : null}


            {/* for non active members */}
            {this.state.activeMember === false ? <PaymentComponent /> : null}
            {this.state.activeMember === false ? <LargeButton className="mb-3" variant="primary" type="submit" icon="arrow-right" onClick={this.renewMembership}>
						                                Renew Membership
					                             </LargeButton> : null}

     </Container>
    </div>
  )}
}

export default Membership
