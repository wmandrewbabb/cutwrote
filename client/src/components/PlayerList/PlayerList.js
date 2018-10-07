import React from "react";
// import DeleteBtn from "../../components/DeleteBtn";
import { Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/PlayerFace";
// import { Input, TextArea, FormBtn } from "../../components/Form";
import "./PlayerList.css"

export const PlayerList = props => {

      return (
        <Container fluid>
          <Row>
              {props.players.length ? (
                <List>
                  {props.players.filter(x => x.playing).map(x => (
                         <ListItem key={x.id}>
                         <div className="crushPic">
                            <img src={x.playerPicture} alt={x.name}></img>
                            <p>{x.name}</p>
                         </div>
                         </ListItem>  
                  )
                  )}
                </List>
              ) : (
                <h3>No Results to Display</h3>
              )}
          </Row> 
        </Container>
      );
  }

  export default PlayerList;

