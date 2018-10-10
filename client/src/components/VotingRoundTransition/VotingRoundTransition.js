import React, { Component } from "react";
import "./VotingRoundTransition.css";
import anime from 'animejs';
import { Container } from "../../components/Grid";
import $ from 'jquery';

// import ReactCountdownClock from "react-countdown-clock";

class ReadySetGo extends Component {

    //you can hit props with this.props.[whatever]
  
    componentDidMount() {
      this.animateRound();
      this.props.proceedToVotes();
      console.log(`this is game round: ${this.props.gameRound}`);
    }

  
    animateRound = () => {
        // Wrap every letter in a span
        $('.ml6 .letters').each(function(){
            $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
        });
        
        anime.timeline({loop: false})
            .add({
            targets: '.ml6 .letter',
            translateY: ["1.1em", 0],
            translateZ: 0,
            duration: 750,
            delay: function(el, i) {
                return 50 * i;
            }
            }).add({
            targets: '.ml6',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
            });
    };
  
    render() {
      return (
        <Container fluid>
        <div className="d-flex fullBlackScreen2 justify-content-center align-items-center">
                <h1 className="ml6 d-flex justify-content-center align-items-center">
                <span className="text-wrapper d-flex justify-content-center align-items-center">
                    <span className="letters">Round {this.props.gameRound}</span>
                </span>
                </h1>
        </div>        
        </Container>
      );
    }
  }
  
  export default ReadySetGo