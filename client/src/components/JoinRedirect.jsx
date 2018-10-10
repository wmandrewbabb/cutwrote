import React, { Component } from "react";


class JoinRedirect extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        this.props.joinGame(this.props.params.id);
    }
    
}

export default JoinRedirect;
