import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from './Home';
import AddSong from './AddSong';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/addSong">
          <AddSong />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/">
          <div>Page Does'nt Exists Right now</div>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
