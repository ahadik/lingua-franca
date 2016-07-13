require('babel-core/register');
require('source-map-support').install();

var express = require('express'),
    cfenv = require('cfenv'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs;

var credentials = require('./private/creds.js');

var app = express(),
    appEnv = cfenv.getAppEnv();

app.set('view engine', 'ejs');
app.set('views', 'public/views')

if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'staging'){
	app.set('port', process.env.VCAP_APP_PORT || 80);
}else{
	app.set('port', 3000);
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use('/bower_components',    express.static('bower_components'));
require('./modules/routes/index.js')(app, credentials); // load our routes and pass in our app and fully configured passport

app.listen(app.get('port'), function() {
    console.info('Server listening on port ' + this.address().port);
});