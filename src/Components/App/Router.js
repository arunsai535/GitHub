import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home } from './Index';
import { ProductDetails } from '../ProductDetails/Index';
import { Header } from '../Header/Index'
export default class App extends Component {
  render() {
    return (

      <Router>
          <Header />
          <Route exact path='/' component={Home} />
          <Route path='/ProductDetails/:Id' component={ProductDetails} />
      </Router>
    );
  }
}
