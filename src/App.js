<<<<<<< HEAD
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import routes from 'src/routes';

import './App.css';

const App = () => {
  const routing = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
=======
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
>>>>>>> 92844644de2ec477deefad96e4f442ab7a2bc703
  );
};

export default App;
