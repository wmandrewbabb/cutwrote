import React from "react";
import PromptBox from "../../components/PromptBox";
import "./VotingRound.css";
import Timer from "../../components/Timer";


const VotingRound = (props) => (
    <div className="w-100">
        <div>
            <PromptBox 
                        currentPrompt = {props.currentPrompt}
            />
        </div>
    </div>
);

export default VotingRound;