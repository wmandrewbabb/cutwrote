import React from 'react';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import "./JoinRoom.css";
// import io from 'socket.io-client';
// const socket = io('http://localhost:8000');

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});


class TextFields extends React.Component {

  constructor(props) {

    super(props);
    //socketIO stuff
    this.joinGame = this.joinGame.bind(this);
  }

  state = {
    codeInput: '',
    multiline: 'Controlled',
  };

  handleChange = codeInput => event => {
    this.setState({
      [codeInput]: event.target.value,
    });
  };

  joinGame(e) {
      e.preventDefault();
    if (this.state.codeInput.length > 0 && this.state.codeInput.length === 5) {
      console.log(`joining game ${this.state.codeInput}`);
      window.socket.emit('join', {roomCode: this.state.codeInput});
    } 
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off" onSubmit={this.joinGame}>
        <TextField
          inputProps={{
              maxLength:5,
          }}
          id="standard-name"
          label="Room Code"
          className={classes.textField}
          value={this.state.codeInput}
          onChange={this.handleChange('codeInput')}
          margin="normal"
          type="text"
          name="Room Code"
        />
      </form>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);
