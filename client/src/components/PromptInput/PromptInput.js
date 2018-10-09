import React from "react";
import PromptBox from "../../components/PromptBox";

const PromptInput = (props) => (
    <div className="w-100">
        <PromptBox 
            currentPrompt = {props.currentPrompt}
        />           
    </div>
);

export default PromptInput;