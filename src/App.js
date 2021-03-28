import React from 'react';
import {BrowserRouter as Router,Route,Redirect,Switch} from 'react-router-dom';

import Login from './Login';
import HomePage from "./HomePage";
import Form1 from './Form1';
import Form2 from './Form2';

function App() {
  var authUser = true;
  return (
    <div className="App">
      {!authUser ? (
        <Login />
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

            </Switch>         

            </Router>
        </div>
      )}
    </div>
  );
}

/*
function App() {
  var authUser = true;
  return (
    <div className="App">
      {!authUser ? (
        <Login />
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

            </Switch>         
          
          </Router>

        </div>
      )}
    </div>
  );
}
*/

export default App;
