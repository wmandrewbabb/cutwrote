import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./ReadyButton.css"

const CheckPlayers = props => {

    let playersPlaying = props.playerCount;

    if(playersPlaying > 1) {
        return <button className="readyButton" onClick={props.startGame}>Start Game</button>
    }

    return <button className="readyButtonGray">Waiting on Players</button>
}

const ReadyButton = props => {



    return (
        <Container className="startButtonContainer justify-contents-center w-100" fluid>
            <Row className="w-100 align-center buttonRow">
            {props.playing === true && 
                <Col size="md-12">
                <div className="buttonRow">
                    <CheckPlayers 
                     startGame={props.startGame}
                     playerCount={props.playerCount}
                    />
                </div>

                </Col>
            }
            </Row>
        </Container>
    );
}

export default ReadyButton;