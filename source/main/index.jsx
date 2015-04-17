'use strict'

require('../style/main.scss');
require('./style.scss');

// window.location.hash = '';

/*
 * Gsap
 * http://greensock.com/docs/#/HTML5/GSAP/TweenMax/
 */
require('gsap/src/uncompressed/TweenMax');

/*
 * Temporary contect data.
 */
var context = require('../json/context');
var travelItems = require('../json/travelItems');


/*
 * Mobile detection
 */
var md = new MobileDetect(window.navigator.userAgent);
if(md.mobile()) {
  document.body.setAttribute('mobile', 'true');
}

/*
 * Set routes
 */
var { Route, DefaultRoute, NotFoundRoute } = Router,
    App = require('./App.jsx'),
    Dashboard = require('./components/dashboard');

  var routes = (
    <Route name="app" path="/" handler={App}>
      {_.map(travelItems, ((item, index) => {
        return <Route key={`route${index}`} name={item.id} handler={Dashboard} />
      }))}
      <DefaultRoute handler={Dashboard}/>
      <NotFoundRoute handler={Dashboard}/>
    </Route>
  );

  var router = Router.create({
    routes: routes,
    // location: Router.HistoryLocation
  });
  router.run((Handler, state) => {
    var params = state.params || {},
      name = state.path.split('/')[1];
    params.name = name;
    params.state = state;
    React.render(<Handler params={params} />, document.body);
  });