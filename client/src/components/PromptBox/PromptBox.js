import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./PromptBox.css";


const PromptBox = (props) => (
    <Container>
        <Row>
            <div
                style={{ clear: "both", textAlign: "center", justifyContent: "center" }}
                className="jumbotron"
            >
                <div className="leftBracket" style={{ clear: "both", float: "none" }}>
                    <img src="/images/bracketleft.png" className="bracket"></img>
                </div>
                <div className="promptArea">
                <p className="promptText">{props.currentPrompt}</p>
                </div>
                <div className="rightBracket" style={{ clear: "both", float: "none" }}>
                    <img src="/images/bracketright.png" className="bracket"></img>
                </div>
            </div>
        </Row>
    </Container>

);

export default PromptBox;