'use strict'

var Globe = require('./three/Globe.jsx');

var Item = React.createClass({
  render() {
    var {id, label} = this.props.item;
    return (
      <section>
        <span>{label}</span>
      </section>
    );
  }
});

var Dashboard = React.createClass({
  mixins: [Reflux.connect(require('../../../store/TravelItemStore.jsx'), 'item')],
  componentDidMount() {
    this.Globe = new Globe({el: this.getDOMNode()});
  },
  componentDidUpdate() {
    // console.log(this.state.item);
    var item = this.state.item;
    this.Globe.update(item);
  },
  render() {
    return (
      <div className="webgl" />
    );
  }
});

module.exports = Dashboard;


