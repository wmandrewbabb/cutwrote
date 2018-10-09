import React from "react";
import PromptBox from "../../components/PromptBox";
import TextField from '@material-ui/core/TextField';


const PromptInput = (props) => (
    <div className="w-100">
        {props.promptsSubmitted === false &&
        <div>
            {props.onePromptSubmitted === false && 
                <div>
                    <PromptBox 
                        currentPrompt = {props.currentPrompt}
                    />
                    <div className = "d-flex row w-75 justify-content-center align-items-center">
                        <form className='inputPrompts' noValidate autoComplete="off" onSubmit={props.sendFirstPrompt}>
                            <TextField
                                inputProps={{
                                    maxLength:70,
                                }}
                                id="firstPromptText"
                                label="firstPromptText"
                                className="promptInputField"
                                value={props.firstPromptText}
                                onChange={props.handleChange}
                                margin="normal"
                                type="text"
                                name="firstPromptText"
                                fullWidth
                            />
                        </form>
                    </div>
                </div>    
            }
            {props.onePromptSubmitted === true && 
                <div>
                    <PromptBox 
                        currentPrompt = {props.currentPrompt}
                    />
                    <div className = "d-flex row w-75 justify-content-center align-items-center">
                        <form className='inputPrompts' noValidate autoComplete="off" onSubmit={props.sendSecondPrompt}>
                            <TextField
                                inputProps={{
                                    maxLength:70,
                                }}
                                id="secondPromptText"
                                label="secondPromptText"
                                className="promptInputField"
                                value={props.secondPromptText}
                                onChange={props.handleChange}
                                margin="normal"
                                type="text"
                                name="secondPromptText"
                                fullWidth
                            />
                        </form>
                    </div>
                </div>    
            }     
        </div>
        }
                   
    </div>
);

export default PromptInput;