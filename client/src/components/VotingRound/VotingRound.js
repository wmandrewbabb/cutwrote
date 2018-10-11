import React from "react";
import PromptBox from "../../components/PromptBox";
import "./VotingRound.css";
import Timer from "../../components/Timer";


const VotingRound = (props) => (
    <div className="col-12 megaScroll">
        <div className="d-flex row align-items-center justify-contents-center">
            <PromptBox 
                currentPrompt = {props.currentPrompt}
            />
        </div>
        <div className="row w-100 justify-content-center align-items-center">
            <div className="votingRoomMessage">{props.canVote ? (<h3>Vote for the funniest Answer!</h3> ) : (<h3>Please wait while the others vote!</h3> )}</div>
        </div>
        <div className="row w-100 justify-content-center align-items-center">
            <Timer
                secondsRemaining={30}
                // onCompletion={props.voteFor("neither")}
            />
        </div>
        <div className="speechRow row w-100 justify-content-around align-items-center">
            <div className="col-sm-6">
                <div className="speechBubbleLeft justify-content-center align-items-center">{props.answer1}</div>
                <div className="playerFaceDivLeft">
                    <img src={props.player1Pic} alt={props.player1name}></img>
                    <p className="nameText">{props.player1Name}</p>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="speechBubbleRight justify-content-center align-items-center">{props.answer2}</div>
                <div className="playerFaceDivRight">
                    <img src={props.player2Pic} alt={props.player2Name}></img>
                    <p className="nameText">{props.player2Name}</p>
                </div>
            </div>
        </div>
    </div>
);

export default VotingRound;