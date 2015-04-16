'use strict'

var travelItems = require('../../../json/travelItems');
var TravelItemActions = require('../../../actions/TravelItemActions.jsx');
var {Link} = Router;
var timeoutId;
var loopDuration = 8000;
var Nav = React.createClass({
  next() {
    if(this.index !== undefined) {
      var index = (this.index + 1) % travelItems.length;
      this.updateTravelItem(index);
    }
  },
  updateTravelItem(index) {
    var self = this;
    if(this.index !== index) {
      clearTimeout(timeoutId);
      var item = travelItems[index];
      TravelItemActions.update(item);
      this.index = index;
      timeoutId = setTimeout(() => { self.next(); }, loopDuration);
      window.location.hash = item.id;
    }
  },
  componentDidMount () {
    var index = _.findIndex(travelItems, (item) => { return location.hash.indexOf(item.id) > 0 });
    if(index === -1) index = 0;
    this.updateTravelItem(index);
  },
  render() {
    var self = this;
    return (
      <nav>
        <ul className="list">
        {_.map(travelItems, ((item, index) => {
          return <li key={`nav${index}`}><Link onClick={self.updateTravelItem.bind(null, index)} to={item.id}>{item.label}</Link></li>
        }))}
        </ul>
      </nav>
    );
  }

});

module.exports = Nav;