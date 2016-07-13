var path = require('path');
var __dirname = path.resolve(path.dirname());
var translator = require('../translator/index.js');
var fs = require('fs');
var translatedData;
var url = require('url');
var filepath = __dirname + "/tmp/out.json";
(()=>{
	fs.access(filepath, fs.F_OK, function(err) {
		//if the path doesn't resolve or we're running in production mode
		//don't require the path.
		if (err || (process.env.NODE_ENV == 'production')) {
			translatedData = false;
		} else {
			fs.readFile(filepath, "utf8", function zz2(err, file) {  
				translatedData = JSON.parse(file);
			});
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
			translator.translate(req.body.text, 'lang' in req.query ? req.query.lang : null ,(results) => {
				fs.writeFile(filepath, JSON.stringify(results), 'utf8', function(err) {
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