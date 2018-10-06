import React, { Component } from "react";
// import DeleteBtn from "../../components/DeleteBtn";
import { Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/PlayerFace";
// import { Input, TextArea, FormBtn } from "../../components/Form";

export const PlayerList = props => {

      return (
        <Container fluid>
          <Row>
              {props.players.length ? (
                <List>
                  {props.players.filter(x => x.playing).map(x => (
                         <ListItem key={x.id}>
                            <img src={x.playerPicture}></img>
                            <p>{x.name}</p>
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

//   {this.state.books.map(book => (
//     <ListItem key={book._id}>
//       <a href={"/books/" + book._id}>
//         <strong>
//           {book.title} by {book.author}
//         </strong>
//       </a>
//       <DeleteBtn />
//     </ListItem>
//   ))}
  
  export default PlayerList;

