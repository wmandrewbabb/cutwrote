import React, { Component } from "react";
import SplashTitle from "./components/SplashTitle";
import FrontInput from "./components/Frontinput";
import Nav from "./components/Nav";
import BackgroundBokke from "./components/BackgroundBokke";
// import JoinRoom from "./components/JoinRoom";

import io from 'socket.io-client';

const socket = io();


// const App = () => (
//   <div >
//     {/* <BackgroundBokke /> */}
//       <Nav />
//       <SplashTitle />
//       <FrontInput />
//       <BackgroundBokke/>

//   </div>
// );

class App extends Component {
  constructor() {
    super();

    this.state = {
      name: '',
      roomCode: '',
      prompts: [],
      currentPrompt: {},
      currentScreen: 'home',
      players: [],
      viewers: [],
      gameStarted: false,
      playersReady: false,
      message: '',
      modalMessage: '',
      popupMessage: '',
      modalButtons: null,
      showMenu: false,
      showModal: false,
      showPopup: false,
      codeInput: '',
      multiline: 'Controlled',
    }

    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.handleChange = this.handleChange.bind(this);


  }

  componentDidMount() {
    socket.connect();

    socket.on('connected', (data) => {
        console.log('connected');
    })

    socket.on('update players', (data) => {
        console.log('updating player list');
        this.setState({
          players: data.players
        })
        console.log(data.players);
    });

    socket.on('joined', (data) => {
 
      this.setState((prevState) => {
        let newCurrentScreen;
        if (prevState.currentScreen === 'home') {
          newCurrentScreen = 'lobby';
        }
        return {
          prompts: data.prompts,
          roomCode: data.roomCode ? data.roomCode : prevState.roomCode,
          showModal: false,
          currentScreen: newCurrentScreen || 'lobby',
          joiningGame: false,
        }
      })
    });
  }

  sendSocketIO() {
    socket.emit('example_message', 'demo', 'second arg');
  }

  createGame() {
      console.log(`player creating game`);
      socket.emit('create', {name: 'player'});   
  }  

  joinGame(e) {
    console.log("Attempting to join game: " + this.state.codeInput);
    e.preventDefault();
    if (this.state.codeInput.length > 0 && this.state.codeInput.length === 5) {
      console.log(`joining game ${this.state.codeInput}`);
      socket.emit('join', {roomCode: this.state.codeInput});
    } 
  }

  setScreen(screen) {
    this.setState({
      currentScreen: screen,
      showMenu: false,
    })
  }

  setMessage(message, type = null, timeout = 2000) {
    switch(type) {
      case 'modal':
        this.setState({
          modalMessage: message
        });
        break;
      case 'popup':
        this.setState({
          popupMessage: message,
          showPopup: true,
        });
        setTimeout(() => {
          this.setState({
            popupMessage: '',
            showPopup: false,
          })
        }, timeout)
        break;
      default:
        this.setState({
          message
        });
    }
  }

  toggleMenu() {
    this.setState((prevState) => {
      return {
        showMenu: !prevState.showMenu
      }
    })
  }
 
  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    })
  };
  
  render() {
    const {
      name,
      roomCode,
      prompts,
      currentPrompt,
      currentScreen,
      players,
      viewers,
      gameStarted,
      playersReady,
      message,
      modalMessage,
      popupMessage,
      modalButtons,
      showMenu,
      showModal,
      showPopup,
      codeInput,
    } = this.state;

    return(
        <div className="h-100" fluid="true">
          <Nav />
          {/* <BackgroundBokke /> */}
          {currentScreen === 'home' && 
            <div>
              <SplashTitle />
              <FrontInput 
                codeInput={codeInput}
                handleChange={this.handleChange}
                createGame={this.createGame}
                joinGame={this.joinGame}
                message={message}          />
              <BackgroundBokke/>
            </div>}


        </div>



    )

  }

}


export default App;
