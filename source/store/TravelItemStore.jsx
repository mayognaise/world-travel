'use strict';

var TravelItemStore = Reflux.createStore({
  listenables: [require('../actions/TravelItemActions.jsx')],
  onUpdate(item){
    this.item = item || {};
    this.trigger(this.item);
  },
  getInitialState() {
    this.item = this.item || {};
    return this.item;
  }
});
module.exports = TravelItemStore;