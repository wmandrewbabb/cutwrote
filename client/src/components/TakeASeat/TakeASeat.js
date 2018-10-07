import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./TakeASeat.css";
import TextField from '@material-ui/core/TextField';

const TakeASeat = props => {

        return (
            <Container fluid>
                <Row>
                    <Col size="md-12">
                    {props.playing ? (<p>You've taken a seat!</p>) : (<p>Enter a name to join the game:</p>)}
                    <form className='name' noValidate autoComplete="off" onSubmit={props.enterName}>
                        {props.playing === false &&
                        <TextField
                            inputProps={{
                                maxLength:10,
                            }}
                            id="name"
                            label="name"
                            className="nameTxt"
                            value={props.name}
                            onChange={props.handleChange}
                            margin="normal"
                            type="text"
                            name="name"
                        />}

                    </form>
                    </Col>
                </Row>
            </Container>
        );
  }
  
  export default TakeASeat;