import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/Home';
import Daily from './pages/Daily';

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/daily" component={Daily} />
        </div>
      </Router>
    );
  }

}

export default App;
