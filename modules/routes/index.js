var path = require('path');
var __dirname = path.resolve(path.dirname());
var translator = require('../translator/index.js');
var fs = require('fs');
if (process.env.NODE_ENV == 'development') {
	var translatedData = require(__dirname + "/tmp/out.json");
}

module.exports = function(app, credentials) {
	translator.install(credentials);
    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

    app.post('/translate', function(req, res){
    	if (process.env.NODE_ENV == 'production') {
    		translator.translate(req.body.text, (results) => {
				fs.writeFile(__dirname + "/tmp/out.json", JSON.stringify(results), function(err) {
					if(err) {
						return console.log(err);
					}

					console.log("Results written to disk!");
				});
				res.json(results);
			});
    	}else{
    		res.json(translatedData);
    	}
	});

};