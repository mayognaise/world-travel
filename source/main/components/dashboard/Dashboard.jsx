'use strict'

var TravelItemActions = require('../../../actions/TravelItemActions.jsx');

var Item = React.createClass({
  reset() {
    var el = this.getDOMNode();
    TweenMax.set(el, { opacity: 0, y: 20 });
  },
  show(delay) {
    var el = this.getDOMNode();
    TweenMax.to(el, .5, { opacity: 1, y: 0, delay: (delay || 0) });
  },
  componentDidMount () {
    this.reset();
    this.show(3);
  },
  componentWillUpdate (nextProps, nextState) {
    if(nextProps.item !== this.props.item) {
      this.reset();
    }
  },
  componentDidUpdate (prevProps, prevState) {
    if(prevProps.item !== this.props.item) {
      this.show(3);
    }
  },
  render() {
    var {id, label, address, tel, image} = this.props.item;
    return (
      <section>
        <h2>{label}</h2>
        <p>{address}</p>
        <p>{tel}</p>
        <p><img src={image} /></p>
      </section>
    );
  }
});

var Dashboard = React.createClass({
  mixins: [Reflux.connect(require('../../../store/TravelItemStore.jsx'), 'item')],
  render() {
    var {name, state} = this.props.params;
    return (
      <article className={name}>
      {this.state.item.id? (<Item item={this.state.item} />) : null}
      </article>
    );
  }
});

module.exports = Dashboard;