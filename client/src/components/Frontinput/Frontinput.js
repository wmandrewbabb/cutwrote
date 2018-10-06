import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./Frontinput.css";
import TextField from '@material-ui/core/TextField';

const FrontInput = props => {

        return (
            <Container className="h-100" fluid>
                <Row>
                <Col size="md-12">
                    <button className="createRoomButton" onClick={props.createGame}>Create Room</button>
                </Col>
                </Row>
                <form className='inputRoom' noValidate autoComplete="off" onSubmit={props.joinGame}>
                    <TextField
                        inputProps={{
                            maxLength:5,
                        }}
                        id="standard-name"
                        label="Room Code"
                        className="inputRoomTxt"
                        value={props.codeInput}
                        onChange={props.handleChange}
                        margin="normal"
                        type="text"
                        name="codeInput"
                    />
                </form>
            </Container>
        );
  }
  
  export default FrontInput;