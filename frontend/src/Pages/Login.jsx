import React from "react";
import "./RegisterTest.css";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email:"",
            password:""
        };
        
        this.tryLogin = this.tryLogin.bind(this);
    }

    tryLogin() {
        console.log(this.state.email);
        console.log(this.state.password);
        const logindeets = {
            email: this.state.email,
            pwd: this.state.password
        };
        fetch('/api/v1/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logindeets)
        }).then( r => r.json())
        .then(d => {
            console.log(d);
        });     
    }

	render(){ 
        return (
            <div className="RegisterTest">
                <div className="Content">
                    <h1>Login</h1>
                    <div className="Slider">
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" placeholder="jdoe@gmail.com" required={true} 
                                onChange={(e) => this.setState({email:e.target.value})} 
                                value={this.state.email} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input type="password" required={true} 
                                onChange={(e) => this.setState({password:e.target.value})} 
                                value={this.state.password}/>
                        </div>
                        <button className="FormButton" onClick={this.tryLogin}>Login</button>
                    </div>

                </div>
            </div>
        )
    }
}

export default Login;
