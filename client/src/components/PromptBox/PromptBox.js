import React from "react";
// import { Col, Row, Container } from "../../components/Grid";
import "./PromptBox.css"


const PromptBox = (props) => (
    // <Container>

    <div className="col-12 noPadding">
        <div className="d-flex align-items-center justify-contents-center row w-100">
        <div className="col-1">
            <span ><img alt="bracket" className="leftBracket" src="/images/bracketleft.png"></img></span>
        </div>
        <div className="col-sm-10 col-xs-12">
        <span className="d-flex promptArea justify-content-center align-items-center"><p>{props.currentPrompt}</p></span>
        </div>
        <div className="col-1">
            <span ><img alt="bracket" className="rightBracket" src="/images/bracketright.png"></img></span>
        </div>
        </div>
    </div>

);

export default PromptBox;