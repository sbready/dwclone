import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Header from './components/Header/Header'

import './App.css';

class App extends Component {

  constructor(props) {
    super(props)
    
    this.state = {

    }
  } 

  render() {
    return (
      <div className="App">

        <Header/>
        
      </div>
    );
  }
}

export default withRouter(App);
