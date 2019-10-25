import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const Daily = lazy(() => import('./pages/Daily'));
const Pulse = lazy(() => import('./pages/Pulse'));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <div className="wrapper" style={{height: 'calc(100% - 56px)'}}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/daily" component={Daily} />
            <Route path="/pulse" component={Pulse} />
          </Switch>
        </div>
      </Suspense>
    </Router>
  );
}

export default App;
