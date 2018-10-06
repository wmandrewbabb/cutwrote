const express = require("express");
const logger = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const routes = require("./routes");
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3001;
const io = require('socket.io')(server);

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
}
// Add routes, both API and view
// app.use(routes);

// Socket.io

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
        }
    }

io.on('connection', function(socket){

//THIS IS WHERE ALL OF OUR SOCKET EMITS ONS AND INS ARE

//   socket.emit('test', { hello: 'world' });

  console.log('a user connected with socket #' + socket.id);
  socket.emit('connected');
  
  socket.on('disconnect', function(){
    console.log('User Disconnected');
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
    console.log(gameRooms[roomCode]);

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

    } else {
      // no gameroom exists for that room code
      socket.emit('bad roomcode');
      console.log("bad roomcode");
    }
  });

  socket.on('takingSeat', (data) => {
    console.log("Getting a request to take seat from " + data.name + " in room " + data.roomCode);
    let name = data.name;
    let roomCode = data.roomCode;

    const { playerList} = gameRooms[roomCode];

    gameRooms[roomCode].playerList.players[socket.id].name = name;
    gameRooms[roomCode].playerList.players[socket.id].playing = true;

    let picPicker = picArchive.images;

    gameRooms[roomCode].playerList.players[socket.id].playerPicture = picPicker[Math.floor(Math.random()*picPicker.length)].url;

    io.sockets.in(roomCode).emit('update players', { 
      players: playerList.prepareToSend(), 
    });
  })

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

