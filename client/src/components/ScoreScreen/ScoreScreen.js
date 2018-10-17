import React, { Component } from "react";
// import DeleteBtn from "../../components/DeleteBtn";
import { Container } from "../../components/Grid";
// import $ from 'jquery';
import "./ScoreScreen.css"
// import anime from 'animejs';

function Tie(props) {
    return (
            <div className="col-md-12">
                <div className="row w-100 d-flex justify-content-center align-items-center winnerSpace">
                    <div className="col-12">
                        <div className="row w-100 d-flex justify-content-center align-items-center">
                            <h1 className="winnerAnnoucement">There's a tie!</h1>
                        </div>
                        <div className="row w-100 d-flex justify-content-center align-items-center">
                            <div className="col-md-6 d-flex justify-content-center align-items-center">
                                <div className="row w-100 justify-content-center align-items-center">
                                    <div className="col-12 d-flex justify-content-center">
                                        <img alt="" className="bounceIn winnerPic" src={props.players[0].playerPicture} />
                                    </div>
                                    <div className="col-12">
                                        <h2 className="winnerName">{props.players[0].name}</h2>
                                    </div>
                                    <div className="col-12">
                                        <h2 className="winnerScore">{props.players[0].score.toFixed(1)}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex justify-content-center align-items-center">
                            <div className="row w-100 justify-content-center align-items-center">
                                    <div className="col-12 d-flex justify-content-center">
                                        <img alt="" className="bounceIn winnerPic" src={props.players[1].playerPicture} />
                                    </div>
                                    <div className="col-12">
                                        <h2 className="winnerName">{props.players[1].name}</h2>
                                    </div>
                                    <div className="col-12">
                                        <h2 className="winnerScore">{props.players[1].score.toFixed(1)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            );
  }
  
function Win(props) {
    return (
        <div className="col-md-12">
        <div className="row w-100 d-flex justify-content-center align-items-center winnerSpace">
            <h1 className="winnerAnnoucement">Game Winner:</h1>
            <div className="col-md-12 d-flex justify-content-center align-items-center">
                <div className="row w-100 justify-content-center align-items-center">
                    <div className="col-12 d-flex justify-content-center">
                        <img alt="" className="bounceIn winnerPic" src={props.players[0].playerPicture} />
                    </div>
                    <div className="col-12">
                        <h2 className="winnerName">{props.players[0].name}</h2>
                    </div>
                    <div className="col-12">
                        <h2 className="winnerScore">{props.players[0].score.toFixed(1)}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>    );
}

class ScoreScreen extends Component {

    
    render() {

    return(
        <div className="container d-flex">
            {this.props.players[0].score.toFixed(1) === this.props.players[1].score.toFixed(1) ? (<Tie players={this.props.players}/>) : (<Win players={this.props.players}/>)}
        </div>

    );
  };

}   

  export default ScoreScreen;

