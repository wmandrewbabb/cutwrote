import React, { Component } from "react";
import { Col, Row, Container } from "../../components/Grid";
// import { Transition } from 'react-transition-group';
// import anime from 'animejs';
// import openSocket from 'socket.io-client';
// import JoinRoom from "../JoinRoom";
import "./Frontinput.css";

import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// const styles = theme => ({
//     container: {
//       display: 'flex',
//       flexWrap: 'wrap',
//     },
//     textField: {
//       marginLeft: theme.spacing.unit,
//       marginRight: theme.spacing.unit,
//       width: 200,
//     },
//     dense: {
//       marginTop: 19,
//     },
//     menu: {
//       width: 200,
//     },
//   });

const FrontInput = props => {

        return (
            <Container className="h-100" fluid>
                <Row>
                <Col size="md-12">
                    {/* <button onClick={this.sendSocketIO}>Send Socket.io</button> */}
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