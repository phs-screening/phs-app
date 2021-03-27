import React from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';

import Login from "./Login";
import HomePage from "./HomePage";
import Form1 from "./Form1";

function App() {
  var authUser = null;
  return (
    <div className="App">
      {!authUser ? (
        <Login />
      ) : (
        <div className="App_body">
          <HomePage />
        </div>
      )}
    </div>
  );
}

export default App;
