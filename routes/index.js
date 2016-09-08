
var passport = require('./../passport/passport');

var index_controller = require('./../controller/index_controller');

var users_controller = require('./../controller/users_controller');

module.exports = function(app) {

    var bind = function (accepter, method) {

        return accepter[method].bind(accepter);

    };
    //app.get('/',bind(index_controller,"index"));

    //app.post('/', passport.authenticate('local', {successRedirect: '/users', failureRedirect: '/'}));

    app.all('/users', bind(users_controller,"isLoggedIn"));

    app.get('/users',bind(users_controller,"users"));

    app.post('/users', bind(users_controller,"create_app"))

    app.get('/query_app',bind(users_controller,"query"));

    app.post('/query_app', bind(users_controller,"query_app"))

    app.get('/app', bind(users_controller,"app"))

    app.post('/app', bind(users_controller,"relation_app"))

    app.get('/logout', bind(index_controller,"logout"));

    app.get('/dataBox', bind(index_controller,"dataBox"));

    app.get('/create_api', bind(index_controller,"create_api"));

    app.get('/visit_api', bind(index_controller,"visit_api"));

}

