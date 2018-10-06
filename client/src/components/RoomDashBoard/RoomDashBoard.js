import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./RoomDashBoard.css";

const RoomDashBoard = props => {
    return (
        <Container className="h-25" fluid>
        <Row>
        <Col size="md-12">
            <p className="roomCodeBig">{props.roomCode}</p>
            <p>Send this code to your friends!</p>
        </Col>
        </Row>
        </Container>
    );   
}

export default RoomDashBoard;