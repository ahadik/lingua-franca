var path = require('path');
var __dirname = path.resolve(path.dirname());
var translator = require('../translator/index.js');
var fs = require('fs');
var translatedData;
(()=>{
	let path = "./tmp/out.json";
	fs.access(__dirname + path, fs.F_OK, function(err) {
		//if the path doesn't resolve or we're running in production mode
		//don't require the path.
		if (err || (process.env.NODE_ENV == 'production')) {
			translatedData = false;
		} else {
			translatedData = require(path);
		}
	});
})();

module.exports = function(app, credentials) {
	translator.install(credentials);
	app.get('/', function(req, res){
		res.render('pages/index', translator.getLanguages());
	});

	app.post('/translate', function(req, res){
		if (!translatedData) {
			translator.translate(req.body.text, (results) => {
				fs.writeFile("./tmp/out.json", JSON.stringify(results), function(err) {
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