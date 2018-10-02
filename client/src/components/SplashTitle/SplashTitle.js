import React, { Component } from "react";
import "./SplashTitle.css";
import { Col, Row, Container } from "../../components/Grid";
// import { Transition } from 'react-transition-group';
import anime from 'animejs';



// const SplashTitle = () => (
//   <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//     <a className="navbar-brand" href="/">
//       Cutwrote React Demo
//     </a>
//   </nav>
// );

// export default Nav;

class SplashTitle extends Component {
    state = {
      players: []
    };
  
    componentDidMount() {
      this.loadTitle();
    }
  
    loadTitle = () => {
        anime.timeline({loop: false})
        .add({
          targets: '.ml15 .word',
          scale: [14,1],
          opacity: [0,1],
          easing: "easeOutCirc",
          duration: 800,
          delay: function(el, i) {
            return 800 * i;
          }
        });
        // }).add({
        //   targets: '.ml15',
        //   opacity: 0,
        //   duration: 1000,
        //   easing: "easeOutExpo",
        //   delay: 1000
        // });
    };
  
    render() {
      return (
        <Container fluid>
          <Row>
            <Col size="md-12">
                <div className ="spacer">
                    <h1 className ="ml15">
                        <span className ="word">cut</span>
                        <span className ="word">wrote</span>
                        {/* <span className ="word">+</span> */}
                    </h1>
                </div>

            </Col>
          </Row>
        </Container>
      );
    }
  }
  
  export default SplashTitle;