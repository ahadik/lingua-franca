require('babel-core/register');
require('source-map-support').install();

var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    queryParser = require('query-parser'),
    hello_world = require('./modules/hello-world'), //for demonstration purposes only
    fs,
    URL = require('url-parse');

var app = express(),
    appEnv = cfenv.getAppEnv();

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging'){
	app.set('port', process.env.VCAP_APP_PORT || 80);
}else{
	app.set('port', 3000);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

require('./modules/routes/index.js')(app, {}); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {
    console.info('Server listening on port ' + this.address().port);
});