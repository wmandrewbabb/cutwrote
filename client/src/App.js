import React from "react";
import SplashTitle from "./components/SplashTitle";
import FrontInput from "./components/Frontinput";
import Nav from "./components/Nav";
import BackgroundBokke from "./components/BackgroundBokke";
// import JoinRoom from "./components/JoinRoom";

const App = () => (
  <div >
    {/* <BackgroundBokke /> */}
      <Nav />
      <SplashTitle />
      <FrontInput />
      <BackgroundBokke/>

  </div>
);

export default App;
