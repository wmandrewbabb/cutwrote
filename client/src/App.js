import React, { Component } from "react";
import SplashTitle from "./components/SplashTitle";
import FrontInput from "./components/Frontinput";
import Nav from "./components/Nav";
import BackgroundBokke from "./components/BackgroundBokke";
import Popup from "./components/Popup";
import Modal from "./components/Modal";
import RoomDashBoard from "./components/RoomDashBoard";
import TakeASeat from "./components/TakeASeat";
// import PlayerList from "./components/PlayerList";
// import Prompt from "./components/Prompt";
// import PromptInput from "./components/PromptInput";
// import Votes from "./components/Votes";
// import ScoreScreen from "./components/ScoreScreen";
// import FinalScore from "./components/FinalScore";
// import SaveGame from "./components/SaveGame";
// import ReturntoStartButton from "./components/ReturntoStartButton";

import io from 'socket.io-client';

const socket = io({host:'/', port:''}, {transports: ['websocket']});


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

    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterName = this.enterName.bind(this);


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

    socket.on('room created', (data) => {

      console.log("New Room Created! Code: " + data.roomCode);
      this.setState((prevState) => {
        let newCurrentScreen;

        if (prevState.currentScreen === 'home') {
          newCurrentScreen = 'lobby';
        }
        return {
          // prompts: data.prompts,
          roomCode: data.roomCode,
          showModal: false,
          currentScreen: newCurrentScreen || 'lobby',
        }
      })
    });

    socket.on("room joined", (data) => {
      console.log("Joining room! Room: " + data.roomCode);
      this.setState((prevState) => {
        let newCurrentScreen;
        if (prevState.currentScreen === 'home') {
          newCurrentScreen = 'lobby';
        }
        return {
          // prompts: data.prompts,
          roomCode: data.roomCode ? data.roomCode : prevState.roomCode,
          showModal: false,
          currentScreen: newCurrentScreen || 'lobby',
        }
      })
    });
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

  
  enterName(e) {
    e.preventDefault();
    console.log(`${this.state.name} is taking a seat at the game in room ${this.state.roomCode}`);
    socket.emit('takingSeat', {name: this.state.name, roomCode: this.state.roomCode})
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
          <Nav name={name} roomCode={roomCode}/>
          {/* <BackgroundBokke /> */}
          {showPopup &&
            <Popup popupMessage={popupMessage} />
          }
          {showModal &&
          <Modal
            message={modalMessage}
            buttons={modalButtons}
          />}
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
          {currentScreen === 'lobby' &&
            <div>
              <RoomDashBoard 
                roomCode={roomCode}
              />
              <TakeASeat 
                name={name}
                handleChange={this.handleChange}
                enterName={this.enterName}
              />
              {/*<PlayerList />
              <ReadyButton /> */}
            </div>}
          {/*{currentScreen === 'prompts' &&
            <div>
              <Prompt />
              <PromptInput />
            </div>}  
          {currentScreen === 'game' &&
            <div>
              <PromptGame />
              <Votes />
            </div>}
          {currentScreen === 'score' &&
            <div>
              <ScoreScreen />
            </div>}
          {currentScreen === 'gameover' &&
            <div>
              <FinalScore />
              <SaveGame />
              <ReturntoStartButton />
            </div>}     */}

        </div>



    )

  }

}


export default App;
