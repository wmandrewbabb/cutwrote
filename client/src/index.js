import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import App from "./App";
import "./index.css";

{/* <JoinRedirect 
joinGame = {this.joinGame}/>
<Switch location={this.props.location}>
<Route exact path="/" component={App} />
<Route path='/:id' component={App} />
</Switch> */}

ReactDOM.render(

    <Router>
        <div>
            <Route exact path="/" component={App} />
            <Route path="/:id" component={App} />
        </div>
    </Router>
    
    , document.getElementById("root"));
