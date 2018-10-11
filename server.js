const express = require("express");
const logger = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const routes = require("./routes");
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(server);
var path = require('path');

app.use(logger('dev'));
app.use(express.static(`${__dirname}/public`));

server.listen(port, function() {
  console.log(`Cutwrote game listening on port: ${port}`);
});


// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku) 
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

else {
  app.use(express.static(path.join(__dirname, './client/public')));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}
// Add routes, both API and view
// app.use(routes);

// Socket.io

// app.get('*', (req,res) =>{
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });



// const Sockets= require('./serverSockets.js');

const gameRooms = {};
const prompts = require('./prompts.js');
const picArchive = require('./picArchive.js');

const promptLib = prompts.prompts;

// io.listen();

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist");

// // Start the API server
// app.listen(PORT, function() {
//   console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
// });



    // for (x=0; x < prompts.prompts.length; x++) {
    //     console.log("prompts: " + prompts.prompts[x].prompt);
    // }

class GameRoom {
        // GameRoom contains data and methods pertaining to the game room
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.playerList = new PlayerList(roomCode);
    this.currentScreen = "lobby";
    this.promptList = new PromptList(roomCode);
    this.activePlayerKeys = [];
    this.currentRound = 0;
    this.setTimeout;
  }
        
        // adds a player to the room
  addToRoom(id) {
    this.playerList.players[id] = new Player(id, this.roomCode);
  }

  addPromptToRoom(prompt, id1, id2, roomCode, order) {
    this.promptList.prompts[order] = new GamePrompt(prompt, id1, id2, roomCode);
  }

  // removeFromRoom(id) {
      //this is going to be long
      // const { roomCode, playerList, promptList, currentScreen, currentRound, activePlayerKeys } = this;
      // const { players } = playerList;
  
  // }

}

class GamePrompt {

  constructor(prompt, player1, player2, roomCode) {
    this.prompt = prompt;
    this.player1ID = player1;
    this.player1Name = gameRooms[roomCode].playerList.players[player1].name;
    this.player1Picture = gameRooms[roomCode].playerList.players[player1].playerPicture;
    this.player2ID = player2;
    this.player2Name = gameRooms[roomCode].playerList.players[player2].name;
    this.player2Picture = gameRooms[roomCode].playerList.players[player2].playerPicture;
    this.answer1 = "";
    this.answer2 = "";
    this.answer1Votes = 0;
    this.answer2Votes = 0;
    this.alreadyshown = false;
  }
      
}

class PromptList {
  constructor(roomCode) {
    this.prompts = {};
    this.roomCode = roomCode;
    this.currentPromptIndex = 0;
  }

  get length() {
    return Object.keys(this.prompts).length;
  }

  preparePrompts() {
    let promptsPackaged = [];

    for(let id in this.prompts) {
      promptsPackaged.push({
        id:id,
        prompt: this.prompts[id].prompt,
        player1ID: this.prompts[id].player1ID,
        player1Name: this.prompts[id].player1Name,
        player2ID: this.prompts[id].player2ID,
        player2Name: this.prompts[id].player2Name,
        answer1: this.prompts[id].answer1,
        answer2: this.prompts[id].answer2,
        answer1Votes: this.prompts[id].answer1Votes,
        answer2Votes: this.prompts[id].answer2Votes,
        alreadyshown: this.prompts[id].alreadyshown,
        player1Picture: this.prompts[id].player1Picture,
        player2Picture: this.prompts[id].player2Picture,
      });
    }

    return promptsPackaged;
  }

}

class PlayerList {
  // PlayerList handles all data and methods pertaining to the list of players
  constructor(roomCode) {
    this.players = {};
    this.roomCode = roomCode;
  }

        // getter so I only need to type 'playerList.length' instead of...well, just look at it VVVV
  get length() {
    return Object.keys(this.players).length;
  }

  prepareToSend() {

    let playersPackaged = [];
        
    for (let id in this.players) {
      playersPackaged.push({
        id: id,
        roomCode: this.players[id].roomCode, 
        score: this.players[id].score,
        name: this.players[id].name,
        playing: this.players[id].playing,
        ready: this.players[id].ready,
        voted: this.players[id].voted,
        canVote: this.players[id].canVote,
        playerPicture: this.players[id].playerPicture,
        playerID: this.players[id].playerID,
        connected: this.players[id].connected,
      });
    }
        
    return playersPackaged;
  }

  timeOut() {

    let playersPackaged = [];
        
    for (let id in this.players) {
      playersPackaged.push({
        id: id,
        roomCode: this.players[id].roomCode, 
        score: this.players[id].score,
        name: this.players[id].name,
        playing: this.players[id].playing,
        ready: true,
        voted: this.players[id].voted,
        canVote: this.players[id].canVote,
        playerPicture: this.players[id].playerPicture,
        playerID: this.players[id].playerID,
      });
    }
        
    return playersPackaged;
  }

}

class Player {
  // Player contains all data and methods pertaining to each individual player
  constructor(id, roomCode) {
    this.id = id;
    this.roomCode = roomCode;
    this.score = 0;
    this.name = "";
    this.playing = false;
    this.ready = false;
    this.voted = false;
    this.canVote = true;
    this.playerPicture = "";
    this.playerID = 0;
    this.connected = true; //I'm fairly certain I'm going to need this to prevent errors from popping up if an active player leaves during the game.
  }
}


//THIS IS WHERE ALL OF OUR SOCKET EMITS ONS AND INS ARE

io.on('connection', function(socket){

  //   socket.emit('test', { hello: 'world' });

  console.log('a user connected with socket #' + socket.id);
  socket.emit('connected');
  
  socket.on('disconnect', function(){
    console.log(socket.id + ' User Disconnected');
    // for (let roomCode in gameRooms) {
    //   let { players } = gameRooms[roomCode].playerList;

    //   if (players[socket.id]) {
    //     socket.leave(roomCode);
    //     gameRooms[roomCode].removeFromRoom(socket.id);
    //   }
    // }
  });

  socket.on('create', (data) => {
    let roomCode;

    // ensures that the roomCode generated is unique and not currently in use
    while(!roomCode || gameRooms[roomCode]) {
      roomCode = roomCodeGen();
    }

    console.log(`${socket.id} has created a game, code ${roomCode}`);
    
    // creates new GameRoom instance
    gameRooms[roomCode] = new GameRoom(roomCode);

    // joins the player to the GameRoom they created
    socket.join(roomCode);
    gameRooms[roomCode].addToRoom(socket.id);

    // updates the players playerList
    socket.emit('update players', {
      players: gameRooms[roomCode].playerList.prepareToSend(),
    });

    socket.emit('room created', {
      roomCode,
    });
    
  });

  // 'join' essentially does the same thing as 'create' as it relates to joining to a room
  socket.on('join', (data) => {
    let roomCode = data.roomCode.toUpperCase();
    console.log("Getting a request to join room " + data.roomCode);

    // if there is a room to join...
    if (gameRooms[roomCode]) {

        const { playerList} = gameRooms[roomCode];

        socket.join(roomCode);
        gameRooms[roomCode].addToRoom(socket.id);

        io.sockets.in(roomCode).emit('update players', { 
          players: playerList.prepareToSend(), 
          // joiningPlayer: data.name 
        });

        socket.emit('room joined', {
          roomCode,
        });

        console.log(gameRooms[roomCode]);


    } else {
      // no gameroom exists for that room code
      socket.emit('bad roomcode');
      console.log("bad roomcode");
    }
  });

  socket.on('joinRedirect', (data) => {
    let roomCode = data.roomCode.toUpperCase();
    console.log("getting a redirect to join room " + data.roomCode);

    if (gameRooms[roomCode]) {

      const { playerList} = gameRooms[roomCode];

      socket.join(roomCode);
      gameRooms[roomCode].addToRoom(socket.id);

      io.sockets.in(roomCode).emit('update players', { 
        players: playerList.prepareToSend(), 
        // joiningPlayer: data.name 
      });

      socket.emit('room joined', {
        roomCode,
      });

      console.log(gameRooms[roomCode]);


  } else {
    // no gameroom exists for that room code
    socket.emit('bad roomcode');
    console.log("bad roomcode");
  }


  })

  socket.on('takingSeat', (data) => {
    console.log("Getting a request to take seat from " + data.name + " in room " + data.roomCode);
    let name = data.name;
    let roomCode = data.roomCode;

    const { playerList } = gameRooms[roomCode];

    gameRooms[roomCode].playerList.players[socket.id].name = name;
    gameRooms[roomCode].playerList.players[socket.id].playing = true;

    //Here we're going to randomly assign a player an avatar as they sit down -- no, they don't get to choose
    //The totally rad skull one is the best, by the way

    let picPicker = picArchive.images;

    gameRooms[roomCode].playerList.players[socket.id].playerPicture = picPicker[Math.floor(Math.random()*picPicker.length)].url;

    io.sockets.in(roomCode).emit('update players', { 
      players: playerList.prepareToSend(), 
    });
  })

  socket.on('firstPromptSent', (data) => {

    let firstPrompt = data.firstPrompt;
    let roomCode = data.roomCode;

    for(let x=0; x< gameRooms[roomCode].promptList.length; x++)
    {
      if(gameRooms[roomCode].promptList.prompts[x].player1ID == socket.id){
        gameRooms[roomCode].promptList.prompts[x].answer1 = firstPrompt;
      }
    }

    io.sockets.in(roomCode).emit('game progress update', { 
      players: gameRooms[roomCode].playerList.prepareToSend(), 
      prompts: gameRooms[roomCode].promptList.preparePrompts(),
      gameRound: gameRooms[roomCode].currentRound,
    });

  });

  socket.on('secondPromptSent', (data) => {
    console.log(data.secondPrompt);

    
    let secondPrompt = data.secondPrompt;
    let roomCode = data.roomCode;

    for(let x=0; x< gameRooms[roomCode].promptList.length; x++)
    {

      if(gameRooms[roomCode].promptList.prompts[x].player2ID == socket.id){
        gameRooms[roomCode].promptList.prompts[x].answer2 = secondPrompt;
      }
    }

    gameRooms[roomCode].playerList.players[socket.id].ready = true;
    

    io.sockets.in(roomCode).emit('game progress update', { 
      players: gameRooms[roomCode].playerList.prepareToSend(), 
      prompts: gameRooms[roomCode].promptList.preparePrompts(),
      gameRound: gameRooms[roomCode].currentRound,
    });

    // gameRooms[roomCode].playerList.players[socket.id].ready = true;

    console.log(`Active players : ${gameRooms[roomCode].activePlayerKeys.length}`)

    let iterator = 0;
    let playerKey = Object.keys(gameRooms[roomCode].playerList.players);
    let checkPlayers = 0;

    //here we're going to get some information about our intial players and push this to the game room
    //there is probably a smaller way of doing this but this works for now

    while (iterator < playerKey.length)
    {
      let iv = playerKey[iterator];
      if (gameRooms[roomCode].playerList.players[iv].ready === true) 
      {
        checkPlayers++;
      }
    
      iterator++;
    }

    if(gameRooms[roomCode].activePlayerKeys.length === checkPlayers) {
      console.log("everyone's ready");

        gameRooms[roomCode].currentRound++;

        io.sockets.in(roomCode).emit('start voting', {
          gameRound: gameRooms[roomCode].currentRound,
        });

        gameRooms[roomCode].currentScreen = "votingRounds";
        clearInterval(gameRooms[roomCode].setTimeout);

    } else {
      console.log("waiting on someone still");
    }


  });

  socket.on("startGame", (data) => {
    console.log(`Starting game in room ${data.roomCode}`);
    let roomCode = data.roomCode;

    gameRooms[roomCode].currentScreen = "firstTransition";


    //This is a failsafe in case someone does something dumb like tabs out and the tab goes inactive and never returns anything
    gameRooms[roomCode].setTimeout = setTimeout( ()=> {

      console.log("the room has timed out");

      io.sockets.in(roomCode).emit('game progress update', { 
        players: gameRooms[roomCode].playerList.timeOut(),
        prompts: gameRooms[roomCode].promptList.preparePrompts(),
        gameRound: gameRooms[roomCode].currentRound,
      });

        io.sockets.in(roomCode).emit('start voting', {
          gameRound: gameRooms[roomCode].currentRound,
        });
        
        gameRooms[roomCode].currentScreen = "votingRounds";

    }, 180000);


    let numPlayers = 0;
    let iterator = 0;
    let playerBox = [];
    let playerKey = Object.keys(gameRooms[roomCode].playerList.players);
    const { playerList, promptList } = gameRooms[roomCode];


    console.log(playerKey);

    //here we're going to get some information about our intial players and push this to the game room
    //there is probably a smaller way of doing this but this works for now

    while (iterator < playerKey.length)
    {
      let iv = playerKey[iterator];
      console.log(gameRooms[roomCode].playerList.players[iv].playing);

      if (gameRooms[roomCode].playerList.players[iv].playing === true) 
      {
        numPlayers++;
        playerBox.push(gameRooms[roomCode].playerList.players[iv]);
        gameRooms[roomCode].playerList.players[iv].playerID = iterator;
      }
    
      iterator++;
    }

    gameRooms[roomCode].activePlayerKeys = playerBox; //Now our gameroom knows who's in there

    console.log (`Number of players: ${numPlayers}`);
    // console.log (`activeplayers: ${playerBox}`);
  
    //Now we're going to fill an array up to match the same number of active players

    let promptBox = [];

      while(promptBox.length < playerBox.length) {
        let randNum = Math.floor(Math.random() * promptLib.length);

        if(!promptLib[randNum].asked) {
          promptBox.push(promptLib[randNum].prompt);
          promptLib[randNum].asked=true;
        }
      }

      console.log(`Our prompts: ${promptBox}`);

      //And here we're going to start making our prompt objects from our GamePrompt constructor

      console.log(`Number of players: ${numPlayers}`);
      console.log(`Length of PromptBox: ${promptBox.length}`);


      // let pArray = [];

      for(x=0; x < promptBox.length; x++) {
        
        let borfTest = numPlayers-1;
        console.log(borfTest);


        if (x == borfTest) {

          gameRooms[roomCode].addPromptToRoom(promptBox[x], playerBox[x].id, playerBox[0].id, roomCode, x);
          console.log(`inserting as last prompt`);
          console.log(`prb: ${promptBox[x]}, pl1: ${playerBox[x].id}, pl2: ${playerBox[0].id}`)

        } else {

          gameRooms[roomCode].addPromptToRoom(promptBox[x], playerBox[x].id, playerBox[x+1].id, roomCode, x);
          console.log(`inserting as a prompt`);
          console.log(`prb: ${promptBox[x]}, pl1: ${playerBox[x].id}, pl2: ${playerBox[x+1].id}`)
        }
      }

      // gameRooms[roomCode].prompts.push(pArray);
      
      //  this is what I get for building this one the wrong day lol

        console.log(gameRooms[roomCode]);

        io.sockets.in(roomCode).emit('start your game', { 
          players: playerList.prepareToSend(), 
          prompts: promptList.preparePrompts(),
        });
      //   console.log(`This is what gameRoom's prompt 0 looks like: ${gameRooms[roomCode].promptList.prompts[0].prompt}`)
      //   console.log(`This is what gameRoom's prompt 1 looks like: ${gameRooms[roomCode].promptList.prompts[1].prompt}`)
      //   console.log(`This is what gameRoom's prompt 0's player1Name looks like: ${gameRooms[roomCode].promptList.prompts[0].player1Name}`)
      //   console.log(`This is what gameRoom's prompt 0's player2Name looks like: ${gameRooms[roomCode].promptList.prompts[0].player2Name}`)
      //   console.log(`This is what gameRoom's prompt 1's player1Name looks like: ${gameRooms[roomCode].promptList.prompts[1].player1Name}`)
      //   console.log(`This is what gameRoom's prompt 1's player2Name looks like: ${gameRooms[roomCode].promptList.prompts[1].player2Name}`)
      //   console.log(`This is what gameRoom's prompt 0's player1id looks like: ${gameRooms[roomCode].promptList.prompts[0].player1ID}`)
      //   console.log(`This is what gameRoom's prompt 0's player2id looks like: ${gameRooms[roomCode].promptList.prompts[0].player2ID}`)
      //   console.log(`This is what gameRoom's prompt 1's player1id looks like: ${gameRooms[roomCode].promptList.prompts[1].player1ID}`)
      //   console.log(`This is what gameRoom's prompt 1's player2id looks like: ${gameRooms[roomCode].promptList.prompts[1].player2ID}`)
    });

  // Here's the function to create my roomcode
  // generates a random 5-digit alphanumeric room code for players to join
  // Using five characters gives us something like 11881375 combinations, so we're more likely to crash a server before running out of rooms
    function roomCodeGen() {

        let roomCode = '';
        let charBank = 'abcdefghijklmnpqrstuvwxyz';
        
        for(let i = 0; i < 5; i++){
            roomCode += charBank.charAt(Math.floor(Math.random() * charBank.length));
        }
        
        return roomCode.toUpperCase();

    }

});

