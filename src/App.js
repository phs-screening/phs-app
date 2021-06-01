import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';
//import logo from './logo.svg';
import './App.css';

import Login from "./Login";
import HomePage from "./HomePage";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Form3 from "./Form3";

function App() {
  var authUser = false;
  return (
    <div className="App">
      {!authUser ? (
        <Form3 />
      ) : (
        <div className="App_body">
          <Router>

          

            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              
              <Route exact path="/form1" component={Form1} />


              <Route exact path="/form2">
                <Form2 />
              </Route>

              <Route exact path="/form3">
                <Form3 />
              </Route>

            </Switch>         
          
          </Router>

        </div>
      )}
    </div>
  );
}

export default App;
