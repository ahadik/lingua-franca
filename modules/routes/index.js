var path = require('path');
var __dirname = path.resolve(path.dirname());
var translator = require('../translator/index.js');

module.exports = function(app, credentials) {
	translator.install(credentials);
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    app.post('/translate', function(req, res){
    	translator.translate(req.body.text, (results) => {
    		res.json(results);
    	});
    });

};