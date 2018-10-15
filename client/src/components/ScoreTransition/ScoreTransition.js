import React, { Component } from "react";
import "./ScoreTransition.css";
import anime from 'animejs';
import { Container } from "../../components/Grid";
import $ from 'jquery';

// import ReactCountdownClock from "react-countdown-clock";

class ScoreTransition extends Component {

    //you can hit props with this.props.[whatever]
  
    componentDidMount() {
      this.animateWin();
    //   console.log(`this is game round: ${this.props.gameRound}`);
    }

  
    animateWin = () => {
        
            // Wrap every letter in a span
            $('.ml16').each(function(){
                $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
            });
            
            anime.timeline({loop: false})
                .add({
                targets: '.ml16 .letter',
                translateY: [-100,0],
                easing: "easeOutExpo",
                duration: 1400,
                delay: function(el, i) {
                    return 30 * i;
                }
                }).add({
                targets: '.ml16',
                opacity: 0,
                duration: 1000,
                easing: "easeOutExpo",
                delay: 3000
                });
    };
  
    render() {
      return (
        <Container fluid>
        <div className="d-flex fullBlackScreen2 justify-content-center align-items-center">
                <span className="text-wrapper d-flex justify-content-center align-items-center">
                <h1 className="ml16">FINAL SCORE</h1>
                </span>
        </div>        
        </Container>
      );
    }
  }
  
  export default ScoreTransition