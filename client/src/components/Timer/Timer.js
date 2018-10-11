import React, { PropTypes, Component } from 'react';
import "./Timer.css";


class Timer extends Component {

constructor(props) {
    
    super(props);

    this.state = {
        idiotCountdown: this.props.secondsRemaining,
    }
}


tick = () => {
        var passIn = this.state.idiotCountdown - 1;
        this.setState({ idiotCountdown: passIn });
        if (this.state.idiotCountdown <= 0) {
          clearInterval(this.interval);
          if(this.props.onCompletion){
            this.props.onCompletion();
          }
        }
      }

componentDidMount () {
        this.setState({ idiotCountdown: this.props.secondsRemaining });
        this.interval = setInterval(this.tick, 1000);
      }

componentWillUnmount () {
        clearInterval(this.interval);
      }
 render() {

    return (
      <div className="row w-100">
        <span className="row w-100">
          <span className="timerText ml-auto">
              <strong>{this.state.idiotCountdown} seconds left.</strong>
          </span>
        </span>
      </div>
    );
  }
}

export default Timer;