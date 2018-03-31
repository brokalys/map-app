import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import Loading from './components/Loading';

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: Loading,
});
const Daily = Loadable({
  loader: () => import('./pages/Daily'),
  loading: Loading,
});

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="wrapper">
          <Route exact path="/" component={Home} />
          <Route path="/daily" component={Daily} />
        </div>
      </Router>
    );
  }

}

export default App;
