import React from "react";

const Nav = (props) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="/">
      Cutwrote React Demo
    </a>
    <ul className="nav ml-auto">
      <li className="nav-item">
      {props.roomCode}
      </li>
    </ul>
  </nav>
);

export default Nav;
