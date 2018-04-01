import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import loadable from 'react-loadable';
import Loading from './components/Loading';

const Home = loadable({
  loader: () => import('./pages/Home'),
  loading: Loading,
});
const Daily = loadable({
  loader: () => import('./pages/Daily'),
  loading: Loading,
});

class App extends React.Component {

  render() {
    return (
      <Router>
        <div className="wrapper" style={{height: 'calc(100% - 56px)'}}>
          <Route exact path="/" component={Home} />
          <Route path="/daily" component={Daily} />
        </div>
      </Router>
    );
  }

}

export default App;
