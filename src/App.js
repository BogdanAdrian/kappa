import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Task1 from './components/task1';
import Task2 from './components/task2';
import Task3 from './components/task3';
import Task4 from './components/task4';
import './App.scss';


function Index() {
  return <h2>Home</h2>;
}

function App() {
  return (
    <div className="App">
       <Router>
        <div className='inner-app'>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/task1/">Task 1</Link>
              </li>
              <li>
                <Link to="/task2/">Task 2</Link>
              </li>
              <li>
                <Link to="/task3/">Task 3</Link>
              </li>
              <li>
                <Link to="/task4/">Task 4</Link>
              </li>
            </ul>
          </nav>

          <Route path="/" exact component={Index} />
          <Route path="/task1/" component={Task1} />
          <Route path="/task2/" component={Task2} />
          <Route path="/task3/" component={Task3} />
          <Route path="/task4/" component={Task4} />
        </div>
      </Router>
    </div>
  );
}

export default App;
