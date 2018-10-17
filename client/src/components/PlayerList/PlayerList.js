import React from "react";
// import DeleteBtn from "../../components/DeleteBtn";
import { Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/PlayerFace";
// import { Input, TextArea, FormBtn } from "../../components/Form";
import "./PlayerList.css"

export const PlayerList = props => {

      return (
        <Container fluid>
          <div className="row w-100">
              {props.players.length ? (
                <List>
                  {props.players.filter(x => x.playing).map(x => (
                         <ListItem key={x.id}>
                         <div className="crushPic">
                            {props.currentScreen === 'prompts' &&
                            <div>{x.ready ? (<p className="readyExclamation bounceIn">!</p>) : (<p className="readyExclamation bounceIn">?</p>)}</div>}
                            <img src={x.playerPicture} alt={x.name}></img>
                            <p className="nameText">{x.name}</p>
                            {props.currentScreen === 'winner' && 
                            <div className="scoreList bounceIn">{x.score.toFixed(1)}</div>}
                         </div>
                         </ListItem>  
                  )
                  )}
                </List>
              ) : (
                <h3>No Results to Display</h3>
              )}
          </div> 
        </Container>
      );
  }

  export default PlayerList;

