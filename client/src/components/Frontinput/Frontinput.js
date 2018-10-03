import React, { Component } from "react";
import { Col, Row, Container } from "../../components/Grid";
// import { Transition } from 'react-transition-group';
// import anime from 'animejs';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8000');

class FrontInput extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          counters: []
        };  
        //socketIO stuff
        this.sendSocketIO = this.sendSocketIO.bind(this);
        this.createGame = this.createGame.bind(this);

      }

    sendSocketIO() {
        socket.emit('example_message', 'demo', 'second arg');
      }
     
    createGame() {
        console.log(`player creating game`);
        socket.emit('create', {name: 'player'});
        
    }      
  
      render() {
        return (

            <Container className="h-100" fluid>
                <Row>
                <Col size="md-12">
                    <button onClick={this.sendSocketIO}>Send Socket.io</button>
                    <button onClick={this.createGame}>Create Room</button>
                </Col>
                </Row>
            </Container>
        );
      }
  }
  
  export default FrontInput;