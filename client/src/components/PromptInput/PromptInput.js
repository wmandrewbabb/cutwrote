import React from "react";
import PromptBox from "../../components/PromptBox";
import TextField from '@material-ui/core/TextField';
import "./PromptInput.css";


const PromptInput = (props) => (
    <div className="w-100">
        <div>
            {props.onePromptSubmitted === false && 
                <div className="d-flex row w-100 justify-content-center align-items-center" id="fixMarginBox">
                    <PromptBox 
                        currentPrompt = {props.currentPrompt}
                    />
                    <div className = "d-flex row w-75 justify-content-center align-items-center">
                        <form className='inputPrompts w-100' noValidate autoComplete="off" onSubmit={props.sendFirstPrompt}>
                            <TextField
                                id="firstPromptText"
                                style={{ margin: 8 }}
                                placeholder="Your First Answer"
                                helperText="70 characters max"
                                className="promptInputField"
                                value={props.firstPromptText}
                                onChange={props.handleChange}
                                fullWidth
                                margin="normal"
                                variant="filled"
                                type="text"
                                name="firstPromptText"
                                InputLabelProps={{
                                    shrink: true,
                                    maxLength:70,
                                }}
                            />
                        </form>
                    </div>
                </div>    
            }
            {props.onePromptSubmitted === true && 
                <div className={props.promptsSubmitted ? ("d-flex row w-100 justify-content-center align-items-center invisible") : ("d-flex row w-100 justify-content-center align-items-center")}>
                    <PromptBox 
                        currentPrompt = {props.currentPrompt}
                    />
                    <div className = "d-flex row w-75 justify-content-center align-items-center">
                        <form className='inputPrompts' noValidate autoComplete="off" onSubmit={props.sendSecondPrompt}>
                            <TextField
                                id="secondPromptText"
                                style={{ margin: 8 }}
                                placeholder="Your Second Answer"
                                helperText="70 characters max"
                                className="promptInputField"
                                value={props.secondPromptText}
                                onChange={props.handleChange}
                                fullWidth
                                margin="normal"
                                variant="filled"
                                type="text"
                                name="secondPromptText"
                                InputLabelProps={{
                                    shrink: true,
                                    maxLength:70,
                                }}
                            />
                        </form>
                    </div>
                </div>    
            }
        </div>
                   
    </div>
);

export default PromptInput;