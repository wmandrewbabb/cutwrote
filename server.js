const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
// Add routes, both API and view
app.use(routes);

// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Sockets= require('./serverSockets.js');

const gameRooms = {};
const prompts = require('./prompts.js');

const promptLib = prompts.prompts;

    // for (x=0; x < prompts.prompts.length; x++) {
    //     console.log("prompts: " + prompts.prompts[x].prompt);
    // }

class GameRoom {
        // GameRoom contains data and methods pertaining to the game room
  constructor(roomCode) {
    this.roomCode = roomCode;
    this.playerList = new PlayerList(roomCode);
    // this.prompts = new Prompts;
  }
        
        // adds a player to the room
  addToRoom(id) {
    this.playerList.players[id] = new Player(id, this.roomCode);
  }

}

class Prompts {

  constructor(prompts) {
    this.prompts = promptLib;
  }
      
}

class PlayerList {
      // PlayerList handles all data and methods pertaining to the list of players,
        // both active and pending
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
                score: this.players[id].score,
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
            // this.score = [];
        }

        // getter so I only need to type player.score instead of player.score.length
        // get score() {
        //     return this.score.length;
        // }
    }

io.on('connection', function(socket){

  // var clients= io.sockets.adapter;
  // var ioAccess= io.sockets
  // Sockets.initSockets(socket, clients, ioAccess);
  

//THIS IS WHERE ALL OF OUR SOCKET EMITS ONS AND INS ARE

//   socket.emit('test', { hello: 'world' });

  console.log('a user connected with socket #' + socket.id);
  socket.emit('connected');
  
  socket.on('disconnect', function(){
    console.log('User Disconnected');
  });

  socket.on('example_message', function(msg, msg2){
    console.log('message: ' + msg + ' ' + msg2);
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

    // // gives the player their prompts
    // socket.emit('joined', {
    //   roomCode,
    // });
    
  });

  // 'join' essentially does the same thing as 'create' as it relates to joining to a room
  socket.on('join', (data) => {
    let roomCode = data.roomCode.toUpperCase();
    console.log("Getting a request to join room " + data.roomCode);
    console.log(gameRooms[roomCode]);

    // if there is a room to join...(basically if they typed the right code)
    if (gameRooms[roomCode]) {

        const { playerList} = gameRooms[roomCode];
        // const { players, pending, cardCzarIndex } = playerList;

        socket.join(roomCode);
        gameRooms[roomCode].addToRoom(socket.id);

        io.sockets.in(roomCode).emit('update players', { 
          players: playerList.prepareToSend(), 
          // joiningPlayer: data.name 
        });

    } else {
      // no gameroom exists for that room code
      socket.emit('bad roomcode');
      console.log("bad roomcode");
    }
  });

  //Here's the function to create my roomcode
    // generates a random 5-digit alphanumeric room code for players to join
    function roomCodeGen() {

        let roomCode = '';
        let charBank = 'abcdefghijklmnpqrstuvwxyz';
        
        for(let i = 0; i < 5; i++){
            roomCode += charBank.charAt(Math.floor(Math.random() * charBank.length));
        }
        
        return roomCode.toUpperCase();

    }

});

io.listen(8000);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist");

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
