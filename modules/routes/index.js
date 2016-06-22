module.exports = function(app, credentials) {
    var path = require('path');
    var __dirname = path.resolve(path.dirname());

    app.get('/', function(req, res){
        res.sendFile(__dirname + '/public/index.html');
    });

};