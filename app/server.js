var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(path.join(__dirname)));
app.use("/css", express.static(__dirname));
app.use("/scripts", express.static(__dirname + '/scripts'));
app.use("/examples", express.static(__dirname + '/examples'));

// viewed at based directory http://localhost:8080/
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + 'views/index.html'));
});


app.listen(process.env.PORT || 8080);