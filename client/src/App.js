import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import SplashTitle from "./components/SplashTitle";
import FrontInput from "./components/Frontinput";
import Nav from "./components/Nav";
import BackgroundBokke from "./components/BackgroundBokke";
// import BackgroundParticle from "./components/BackgroundParticle";
import BackgroundRectangle from "./components/BackgroundRectangle";
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
import VotingRoundTransition from "./components/VotingRoundTransition";
import VotingRound from "./components/VotingRound";
import ScoreTransition from "./components/ScoreTransition";
// import Votes from "./components/Votes";
import ScoreScreen from "./components/ScoreScreen";
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
      joinFromRedirect: false,
      timer: null,
      gameRound: 0,
      votingFor: "",
      hasVoted: false,
      canVote: true,
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
    this.proceedToVotes = this.proceedToVotes.bind(this);
    this.voteFor = this.voteFor.bind(this);
    // this.sortByKey = this.sortByKey.bind(this);
    // this.handleWinners = this.handleWinners.bind(this);
    // this.sortScores = this.sortScores.bind(this);

  } 

  // componentDidUpdate() {
  //   setTimeout(function(){ socket.connect();}, 1000);


  //   socket.on('connected', (data) => {

  //       console.log(`connected as ${socket.id}`);

  //       if (this.state.joinFromRedirect) {
  //         this.joinGameFromRedirect(this.props.match.params.id);
  //       } 

  //   })
  // }

  componentDidMount() {

    socket.connect();


    socket.on('connected', (data) => {

        console.log(`connected as ${socket.id}`);

        if (this.state.joinFromRedirect) {
          this.joinGameFromRedirect(this.props.match.params.id);
        } 

    })

    socket.on('disconnect', () => {

      this.setState({
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
        joinFromRedirect: false,
        timer: null,
        gameRound: 0,
        votingFor: "",
        hasVoted: false,
        canVote: true,
      })

      console.log("Disoconnected, reload to reconnect");
      // socket.connect();

    })


    // console.log(`connected as ${socket.id}`);
    if (this.props.match.params.id === undefined) {
      console.log("Undefined param");
      console.log(this.state.joinFromRedirect);

      console.log(this.props.match.params.id);
    } else {
      console.log(this.props.match.params.id);
      this.setState({joinFromRedirect: true})
      console.log(this.state.joinFromRedirect);
    }



    //ALL OF OUR GODDAMN SOCKETS LIVE HERE
    //Why am I mad? Because I'm an idiot that tried loading this individually on each component and learned the hard way
    //that loading them that way is 1) a mess and 2) a bad idea and 3) leads to problems
    //Thanks stackoverflow for telling me that I was dumb way before documentation did

    socket.on('update players', (data) => {
        console.log('updating player list');
        this.setState({
          players: data.players
        })
        console.log(data.players);
        this.checkNumberofPlayers();
        console.log("Player Count: " + this.state.playerCount);
    });

    socket.on('game progress update', (data) => {
      this.setState({
        players: data.players,
        prompts: data.prompts,
        gameRound: data.gameRound
      });
      console.log(data.players);
      console.log(data.prompts);
      console.log(`game round: ${data.gameRound}`);
      console.log(`server status: ${data.status}`);
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
      this.setState({
        roomCode: data.roomCode
      });
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

    socket.on("late join", (data) => {

      this.setState({
        roomCode: data.roomCode
      });

      let currentScreenFromServer = data.currentScreen;
      let newPromptPos = 0;

      if (data.gameRound > 0){
        newPromptPos = data.gameRound-1;
      }
      
      console.log(`data.gameRound: ${data.gameRound}`);


      this.setState({
        playing: false,
        players: data.players,
        prompts: data.prompts,
        gameRound: data.gameRound,
        currentPromptPos: newPromptPos,
        promptsSubmitted: true,
      });

      console.log(data.players);
      console.log(data.prompts);
      
      console.log(`stupid prompt error: ${this.state.prompts[this.state.currentPromptPos].prompt}`);
      
      if (currentScreenFromServer === "votingRounds") {
        
        this.voteFor(this.state.prompts[this.state.currentPromptPos].id, 0);

        // let newScreen = 'votingTransition';
        this.setState({
          currentScreen: "voting",
        });


        console.log("You'll be able to vote next time!");

      } else if( currentScreenFromServer === "firstTransition") {

        let newScreen = "prompts";


        this.setState({
          currentScreen: newScreen,
          currentPromptPos: newPromptPos,
          gameRound: data.gameRound,
        })
      }

    });

    

    socket.on("start voting", (data) => {

      console.log("resetting voting state");
      this.setState({
        votingFor: "",
        hasVoted: false,
        canVote: true,
      })

      console.log(`Player's current ability to vote: ${this.state.canVote}`);
      if(data.gameRound <= this.state.prompts.length) {
        //Starting voting round!
        let newScreen = 'votingTransition';
        let newPromptPos = data.gameRound-1;

        this.setState({
          currentScreen: newScreen,
          currentPromptPos: newPromptPos,
          gameRound: data.gameRound,
        })

        console.log(`player pictures: ${this.state.prompts[this.state.currentPromptPos].player2Picture}`);
        console.log(`player pictures: ${this.state.prompts[this.state.currentPromptPos].player1Picture}`);

        //We're going to test if this is one of the prompts you filled out, if so you're flagged as not being able to vote
        if(this.state.prompts[this.state.currentPromptPos].player1ID === socket.id || this.state.prompts[this.state.currentPromptPos].player2ID === socket.id) {
          console.log("Sorry! You can't vote on this one!");
          this.setState({
            canVote: false,
          });
        } 
      } else {

        //If we're out of prompts, we'll sort the winners and then display the final score transition card

        let winnersSort = this.state.players.sort((a, b) => a.score-b.score);
        //let winnersSort = this.state.players.sort((a, b) => b.score-a.score);

        winnersSort = winnersSort.reverse();
        console.log(`sorted winners = ${winnersSort}`);

        this.setState({currentScreen:"scoreTransition"});

        setTimeout(() => {
          this.setState ({
          currentScreen: "winner",
          players: winnersSort
        })
        }, 6000);

        console.log("End of rounds");
      }


    })

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
    console.log(this.state.joinFromRedirect);
    if(this.state.joinFromRedirect == false)
    {
      if (this.state.codeInput.length > 0 && this.state.codeInput.length === 5) {
        console.log(`joining game ${this.state.codeInput}`);
        socket.emit('join', {roomCode: this.state.codeInput});
       } 
    }
  }

  joinGameFromRedirect(roomCode) {
    console.log("sees outside");
    function ham() {
      console.log("sees inside");
      console.log(roomCode.length);
      if (roomCode.length > 0 && roomCode.length === 5) {
        // console.log("Attempting to join game: " + roomCode);
        console.log(`joining game ${roomCode}`);
        socket.emit('joinRedirect', {roomCode: roomCode});
      } 
    }

    ham();
  }

  startGame() {
    console.log("You're starting a game!");
    if(this.state.playerCount > 1) { //We're going to set this to 1 for testing purposes, it should be 2
      socket.emit('startGame', {roomCode: this.state.roomCode});
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
      if (this.state.prompts[x].player1ID === socket.id) {
        this.setState({
            firstPrompt: x
          });
         }
      if (this.state.prompts[x].player2ID === socket.id) {
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


  sendFirstPrompt(e) {
    e && e.preventDefault();
    console.log(this.state.firstPromptText);
    this.setState({
      onePromptSubmitted: true,
      currentPromptPos: this.state.secondPrompt
    });
    socket.emit("firstPromptSent", {roomCode: this.state.roomCode, firstPrompt: this.state.firstPromptText});
  }

  sendSecondPrompt(e) {
    e && e.preventDefault();
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

  proceedToVotes() {
    setTimeout(() => { 
      this.setState({
        currentScreen: 'voting'
      })
     }, 3000);
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

  voteFor(promptId, playerID) {

    if(this.state.canVote === true) {
      this.setState({
        hasVoted: true,
        canVote: false,
      });
  
      let voteWorth = 1;
  
      if(this.state.playing === false)
      { voteWorth = .1}
  
      socket.emit("sendVote", {
        promptId: promptId,
        voteWorth: voteWorth,
        playerID: playerID,
        roomCode: this.state.roomCode,
        voterID: socket.id, 
      });
    } else {
      console.log("You've already voted/can't vote. This may be a result of of the timer ending without everyone voting.");
    }
  };

    // sortByKey(array, key) {
    //   return array.sort(function(a, b) {
    //       var x = a[key];
    //       var y = b[key];

    //       if (typeof x == "string")
    //       {
    //           x = (""+x).toLowerCase(); 
    //       }
    //       if (typeof y == "string")
    //       {
    //           y = (""+y).toLowerCase();
    //       }

    //       return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    //   });
    // }




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
      timer,
      gameRound,
      votingFor,
      hasVoted,
      canVote,
    } = this.state;

    return(
        <div className="MainApp" fluid="true">
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
            <div className="h-100 mainCapture">
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
                currentScreen={currentScreen}
              />
              <ReadyButton 
                playerCount={playerCount}
                startGame={this.startGame}
                playing={playing}
              />
              <BackgroundRectangle />
            </div>}
          {currentScreen === 'readyset' &&
            <ReadySetGo />
          }
          {currentScreen === 'prompts' &&
            <div>
              {this.state.playing === true &&
              <PromptInput
                timer={this.timer}
                firstPromptText={firstPromptText}
                secondPromptText={secondPromptText}
                onePromptSubmitted={onePromptSubmitted}
                promptsSubmitted={promptsSubmitted}
                sendFirstPrompt={this.sendFirstPrompt}
                sendSecondPrompt={this.sendSecondPrompt}
                handleChange={this.handleChange}
                currentPrompt={this.state.prompts[this.state.currentPromptPos].prompt} 
              />}
              <PlayerList 
                players={players}
                currentScreen={currentScreen}
              />
            </div>}
          {currentScreen === 'votingTransition' &&
              <VotingRoundTransition 
                gameRound = {gameRound}
                proceedToVotes = {this.proceedToVotes}
              />
          } 
          {currentScreen === 'voting' &&
            <div>
              <VotingRound
                id={this.state.prompts[this.state.currentPromptPos].id}
                currentPrompt={this.state.prompts[this.state.currentPromptPos].prompt} 
                player1ID={this.state.prompts[this.state.currentPromptPos].player1ID} 
                player2ID={this.state.prompts[this.state.currentPromptPos].player2ID} 
                player1Name={this.state.prompts[this.state.currentPromptPos].player1Name} 
                player2Name={this.state.prompts[this.state.currentPromptPos].player2Name} 
                answer1={this.state.prompts[this.state.currentPromptPos].answer1} 
                answer2={this.state.prompts[this.state.currentPromptPos].answer2} 
                answer1Votes={this.state.prompts[this.state.currentPromptPos].answer1Votes} 
                answer2Votes={this.state.prompts[this.state.currentPromptPos].answer2Votes}
                player1Pic={this.state.prompts[this.state.currentPromptPos].player1Picture}
                player2Pic={this.state.prompts[this.state.currentPromptPos].player2Picture}
                player1Status={this.state.prompts[this.state.currentPromptPos].player1Status}
                player2Status={this.state.prompts[this.state.currentPromptPos].player2Status}
                canVote={canVote}
                hasVoted={hasVoted}
                voteFor={this.voteFor}
              />
              {/* <Votes /> */}
            </div>}
          {currentScreen === "scoreTransition" &&
            <div> 
              <ScoreTransition />
            </div>}
          {currentScreen === 'winner' &&
            <div>
              <ScoreScreen 
                players={players}
              />
              <div className="restartButton">
                <a href="/">New Game!</a>
              </div>
              <PlayerList
                players={players}
                currentScreen={currentScreen}
              />
              <BackgroundBokke />
              {/* <GameOver />  */}
            </div>}
          {/*{currentScreen === 'gameover' &&
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
