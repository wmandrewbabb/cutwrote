import React, { Component } from "react";
import SplashTitle from "./components/SplashTitle";
import FrontInput from "./components/Frontinput";
import Nav from "./components/Nav";
import BackgroundBokke from "./components/BackgroundBokke";
import Popup from "./components/Popup";
import Modal from "./components/Modal";
import RoomDashBoard from "./components/RoomDashBoard";
import TakeASeat from "./components/TakeASeat";
import PlayerList from "./components/PlayerList";
import ReadyButton from "./components/ReadyButton";
import ReadySetGo from "./components/ReadySetGo";
// import TransitionSlide from "./components/TransitionSlide"
// import Prompt from "./components/Prompt";
import PromptInput from "./components/PromptInput";
// import Votes from "./components/Votes";
// import ScoreScreen from "./components/ScoreScreen";
// import FinalScore from "./components/FinalScore";
// import SaveGame from "./components/SaveGame";
// import ReturntoStartButton from "./components/ReturntoStartButton";

import io from 'socket.io-client';

//oh wow this doesn't break heroku anymore

const socket = io({host:'/', port:''}, {transports: ['websocket']});

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
      gameStarted: false,
      playersReady: false,
      playing: false,
      message: '',
      modalMessage: '',
      popupMessage: '',
      modalButtons: null,
      showMenu: false,
      showModal: false,
      showPopup: false,
      codeInput: '',
      multiline: 'Controlled',
      playerCount: 0,
      showFooter: false,
      firstPrompt: -1,
      secondPrompt: -1,
      currentPromptPos: -1,
      firstPromptText: "",
      secondPromptText: "",
      onePromptSubmitted: false,
      promptsSubmitted: false,
    }

    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterName = this.enterName.bind(this);
    this.checkNumberofPlayers = this.checkNumberofPlayers.bind(this);
    this.startGame = this.startGame.bind(this);
    this.proceed = this.proceed.bind(this);
    this.figureOutIndividualPrompts = this.figureOutIndividualPrompts.bind(this);
    this.sendFirstPrompt = this.sendFirstPrompt.bind(this);
    this.sendSecondPrompt = this.sendSecondPrompt.bind(this);
    // this.sendVote = this.sendVote.bind(this);
    // this.handleWinners = this.handleWinners.bind(this);
    // this.sortScores = this.sortScores.bind(this);

  } 

  componentDidMount() {

    //ALL OF OUR GODDAMN SOCKETS LIVE HERE
    //Why am I mad? Because I'm an idiot that tried loading this individually on each component and learned the hard way
    //that loading them that way is 1) a mess and 2) a bad idea and 3) leads to problems
    //Thanks stackoverflow for telling me that I was dumb way before documentation did

    socket.connect();

    socket.on('connected', (data) => {
        console.log(`connected as ${socket.id}`);
    })

    socket.on('update players', (data) => {
        console.log('updating player list');
        this.setState({
          players: data.players
        })
        console.log(data.players);
        this.checkNumberofPlayers();
        console.log("Player Count: " + this.state.playerCount);
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

    socket.on("start your game", (data) => {
      console.log("Going to screen transition!");
      let newScreen = 'readyset';
      this.setState({
        players: data.players,
        prompts: data.prompts,
        currentScreen: newScreen,
      })

      this.figureOutIndividualPrompts();
      
      setTimeout(() => { 
        this.setState({
          currentScreen: 'prompts'
        })
       }, 7000);
      // this.checkNumberofPlayers();
      })
  }

 
//FUNCTION JUNCTION

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

  startGame() {
    console.log("You're starting a game!");
    if(this.state.playerCount > 1) { //We're going to set this to 1 for testing purposes, it should be 2
      socket.emit('startGame', {roomCode:this.state.codeInput});
    } else {
      console.log("Not enough players yet!");
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
    if (this.state.playerCount < 8) {
      console.log(`${this.state.name} is taking a seat at the game in room ${this.state.roomCode}`);
      socket.emit('takingSeat', {name: this.state.name, roomCode: this.state.roomCode});
      this.setState({
        playing: true,
      })
    } else {
      console.log('TOO MANY PLAYERS');
    }
  }

  figureOutIndividualPrompts() {

    for (var x=0; x < this.state.prompts.length; x++) {
      if (this.state.prompts[x].player1ID == socket.id) {
        this.setState({
            firstPrompt: x
          });
         }
      if (this.state.prompts[x].player2ID == socket.id) {
        this.setState({
            secondPrompt: x
          });
        } 
    }

    this.setState({
        currentPromptPos: this.state.firstPrompt
    });

    console.log(`This is the position of the first prompt: ${this.state.firstPrompt}`);
    console.log(`This is the first prompt: ${this.state.prompts[this.state.firstPrompt].prompt}`);
    console.log(`This is the position of the second prompt: ${this.state.secondPrompt}`);
    console.log(`This is the second prompt: ${this.state.prompts[this.state.secondPrompt].prompt}`);
  }


  sendFirstPrompt() {
    console.log(this.state.firstPromptText);
    this.setState({
      onePromptSubmitted: true,
      currentPromptPos: this.state.secondPrompt
    });
    socket.emit("firstPromptSent", {roomCode: this.state.roomCode, firstPrompt: this.state.firstPromptText});
  }

  sendSecondPrompt() {
    console.log(this.state.secondPromptText);
    this.setState({
      promptsSubmitted: true
    })
    socket.emit("secondPromptSent", {roomCode: this.state.roomCode, secondPrompt: this.state.secondPromptText});
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

  proceed() {
    this.setState({
      currentScreen: 'prompts'
    })
  }

  toggleMenu() {
    this.setState((prevState) => {
      return {
        showMenu: !prevState.showMenu
      }
    })
  }

  checkNumberofPlayers() {
    this.setState({
      playerCount: this.state.players.filter(x => x.playing).length
    })
  }
 
  handleChange(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      [name]: value
    })
  };

  //ACTUALLY RENDER ALL MY DAMN COMPONENTS
  
  render() {
    const {
      name,
      roomCode,
      prompts,
      currentPrompt,
      currentScreen,
      players,
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
      playerCount,
      playing,
      showFooter,
      firstPrompt,
      secondPrompt,
      firstPromptText,
      secondPromptText,
      onePromptSubmitted,
      promptsSubmitted,
      currentPromptPos,
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
                playing={playing}
                handleChange={this.handleChange}
                enterName={this.enterName}
              />
              <PlayerList 
                players={players}
              />
              <ReadyButton 
                playerCount={playerCount}
                startGame={this.startGame}
                playing={playing}
              />
            </div>}
          {currentScreen === 'readyset' &&
            <ReadySetGo />
          }
          {currentScreen === 'prompts' &&
            <div>
              <PromptInput
                firstPromptText={firstPromptText}
                secondPromptText={secondPromptText}
                onePromptSubmitted={onePromptSubmitted}
                promptsSubmitted={promptsSubmitted}
                sendFirstPrompt={this.sendFirstPrompt}
                sendSecondPrompt={this.sendSecondPrompt}
                handleChange={this.handleChange}
                currentPrompt={this.state.prompts[this.state.currentPromptPos].prompt} 
              />
            </div>}  
          {/*{currentScreen === 'game' &&
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
