'use strict'

var Nav = require('./components/nav');
var Webgl = require('./components/webgl');
var {RouteHandler} = Router,

App = React.createClass({
  render() {
    return (
      <div className="app">
        <Webgl />
        <Nav />
        <RouteHandler {...this.props}/>
      </div>
    );
  }
});

module.exports = App;