import React, { Component } from "react";
import "./ReadySetGo.css";
import anime from 'animejs';
import { Container } from "../../components/Grid";
// import ReactCountdownClock from "react-countdown-clock";

class ReadySetGo extends Component {

    //you can hit props with this.props.[whatever]
  
    componentDidMount() {
      this.setItOff();
      console.log(this.props);
    }

    // nextcard = () => {
    //     this.setState({
    //         currentScreen: "prompts"
    //     });
    // }
  
    setItOff = () => {
        var ml4 = {};
        ml4.opacityIn = [0,1];
        ml4.scaleIn = [0.2, 1];
        ml4.scaleOut = 3;
        ml4.durationIn = 800;
        ml4.durationOut = 600;
        ml4.delay = 500;

        anime.timeline({loop: false})
        .add({
            targets: '.ml4 .letters-1',
            opacity: ml4.opacityIn,
            scale: ml4.scaleIn,
            duration: ml4.durationIn
        }).add({
            targets: '.ml4 .letters-1',
            opacity: 0,
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            easing: "easeInExpo",
            delay: ml4.delay
        }).add({
            targets: '.ml4 .letters-2',
            opacity: ml4.opacityIn,
            scale: ml4.scaleIn,
            duration: ml4.durationIn
        }).add({
            targets: '.ml4 .letters-2',
            opacity: 0,
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            easing: "easeInExpo",
            delay: ml4.delay
        }).add({
            targets: '.ml4 .letters-3',
            opacity: ml4.opacityIn,
            scale: ml4.scaleIn,
            duration: ml4.durationIn
        }).add({
            targets: '.ml4 .letters-3',
            opacity: 0,
            scale: ml4.scaleOut,
            duration: ml4.durationOut,
            easing: "easeInExpo",
            delay: ml4.delay
        }).add({
            targets: '.ml4',
            opacity: 0,
            duration: 500,
            delay: 500
        });
    };
  
    render() {
      return (
        <Container fluid>
                <div className ="d-flex fullBlackScreen justify-content-center align-items-center">
                    <h1 className="ml4 d-flex fullBlackScreen justify-content-center align-items-center">
                        <span className="letters letters-1 d-flex justify-content-center align-items-center">Ready</span>
                        <span className="letters letters-2 d-flex justify-content-center align-items-center">Set</span>
                        <span className="letters letters-3 d-flex justify-content-center align-items-center">Go!</span>
                    </h1>
                </div>
                {/* <ReactCountdownClock seconds={5}
                     color="#000"
                     alpha={0.01}
                     size={30}
                    //  onComplete={this.nextcard} 
                    /> */}
        </Container>
      );
    }
  }
  
  export default ReadySetGo