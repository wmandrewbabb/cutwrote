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
io.on('connection', function(socket){
  console.log('a user connected with socket #' + socket.id);
  socket.on('disconnect', function(){
    console.log('User Disconnected');
  });
  socket.on('example_message', function(msg, msg2){
    console.log('message: ' + msg + ' ' + msg2);
  });
});
io.listen(8000);

// Connect to the Mongo DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactreadinglist");

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
