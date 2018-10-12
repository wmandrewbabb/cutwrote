import React from "react";
import { Col, Row, Container } from "../../components/Grid";
import "./TakeASeat.css";
import TextField from '@material-ui/core/TextField';

const TakeASeat = props => {

        return (
            <Container fluid>
                <div className="col-12 w-100">
                    <div className="row w-100 nameInputField justify-items-left">
                        <div className="col-12 w-100">
                            <div className="row w-100">
                                <div className="blockProp">{props.playing ? (<p>You've taken a seat!</p>) : (<p>Enter a name to join the game:</p>)}</div>
                            </div>
                            <div className="row w-100 align-contents-left justify-items-left">
                                <div className="nameInputField">
                                </div>
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
                            </div> 
                        </div> 
                    </div>
                </div>
            </Container>
        );
  }
  
  export default TakeASeat;