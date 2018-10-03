//all server-side sockets functions will be written here;
//initSockets will be exported to server-side index
// var roomData = {};
module.exports.initSockets = function(socket, clients, ioAccess){

    //   var isButtonClicked = false;
    const gameRooms = {};
    const prompts = require('./prompts.js');

    // for (x=0; x < prompts.prompts.length; x++) {
    //     console.log("prompts: " + prompts.prompts[x].prompt);
    // }

    class GameRoom {
        // GameRoom contains data and methods pertaining to the game room
        constructor(roomCode) {
            this.roomCode = roomCode;
            this.playerList = new PlayerList(roomCode);
            // this.promptDeck = new Prompts([...prompts]);
        }
        
        // adds a player to the room
        addToRoom(name, id) {
        this.playerList.players[id] = new Player(id, this.roomCode);
        }
    
        // removes a player from the room
        // long and complicated due to handling of edge cases
        removeFromRoom(id) {
        const { roomCode, playerList, playerSelections } = this;
        const { players, pending } = playerList;
    
        // delete player from playerList and let other players know someone left
        let departingPlayer = players[id].name;
        console.log(`${departingPlayer} left room ${roomCode}`);
        delete players[id];
        io.sockets.in(roomCode).emit('update players', { players: playerList.prepareToSend(), departingPlayer })
    
        if(playerList.length < 3 ) { //&& <<<<roomStatus == waiting >>>> 
            //things
            } else {
            // ...even if there are now enough players, still need to reset the game
            }
        }
    
        //once you've got three players, you can start
        // startGame() {

        // }
    }

    class Prompts {

        constructor(prompts) {
          this.prompts = this.shuffle(prompts);
        }
      
        // does what it says
        shuffle(prompts) {
          let shuffledprompts = [];
      
          for(let i = 0; i < prompts.length; i++) {
            let randIndex = Math.floor(Math.random() * prompts.length);
            shuffledprompts.push(prompts.splice(randIndex, 1)[0]);
          };
      
          return shuffledprompts;
        }
      
        // getter so I only need to type 'whiteDeck.count' instead of 'whiteDeck.prompts.length'
        get count() {
          return this.prompts.length;
        }

      }

    class PlayerList {
        // PlayerList handles all data and methods pertaining to the list of players,
        // both active and pending
        constructor(roomCode) {
            this.players = {};
            this.pending = {};
            this.roomCode = roomCode;
            this.cardCzarIndex = 0;
        }

        // getter so I only need to type 'playerList.length' instead of...well, just look at it VVVV
        get length() {
            return Object.keys(this.players).length;
        }

        // returns whether or not all players are ready
        allReady() {
            for(let id in this.players) {
            if (!this.players[id].ready) {
                return false;
            }
            }
            return true;
        }

        // resets all players' ready status to false
        resetReady() {
            for(let id in this.players) {
            this.players[id].ready = false;
            }
        }

        prepareToSend() {
            let playersPackaged = [];
        
            for (let id in this.players) {
              playersPackaged.push({
                name: this.players[id].name,
                id: id,
                ready: this.players[id].ready,
                winningCards: this.players[id].winningCards,
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

    console.log(`${data.name} has created a game, code ${roomCode}`);
    
    // creates new GameRoom instance
    gameRooms[roomCode] = new GameRoom(roomCode);

    // joins the player to the GameRoom they created
    socket.join(roomCode);
    gameRooms[roomCode].addToRoom(data.name, socket.id);

    // updates the players playerList
    socket.emit('update players', {
      players: gameRooms[roomCode].playerList.prepareToSend(),
      joiningPlayer: data.name,
    });

    // gives the player their prompts
    socket.emit('joined', {
    //   prompts: [...gameRooms[roomCode].playerList.players[socket.id].prompts],
      roomCode,
    });
    
  });

  // 'join' essentially does the same thing as 'create' as it relates to joining to a room
  // has extra logic to prevent duplicate names or more than 10 players
  socket.on('join', (data) => {
    let roomCode = data.roomCode.toUpperCase();

    // if there is a room to join...(basically if they typed the right code)
    if (gameRooms[roomCode]) {

        socket.join(roomCode);
        socket.emit('joined', {
            roomCode,
        });

      }  else {
      // no gameroom exists for that room code
      socket.emit('bad roomcode');
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

}