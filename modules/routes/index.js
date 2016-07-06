var path = require('path');
var __dirname = path.resolve(path.dirname());
var translator = require('../translator/index.js');
var fs = require('fs');
var translatedData;
(()=>{
	let path = "../../tmp/out.json";
	fs.access(path, fs.F_OK, function(err) {

		//if the path doesn't resolve or we're running in production mode
		//don't require the path.
		if (err || (process.env.NODE_ENV == 'production')) {
			translatedData = false;
		} else {
			console.log(path);
			translatedData = require(path);
		}
	});
})();

module.exports = function(app, credentials) {
	translator.install(credentials);
	app.get('/', function(req, res){
		res.sendFile(__dirname + '/public/index.html');
	});

	app.post('/translate', function(req, res){
		if (!translatedData) {
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