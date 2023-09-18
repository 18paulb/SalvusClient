// const express = require('express');
// const path = require('path');
// const app = express();
// app.use(express.static(__dirname + '/dist/salvusfrontend'));
// app.get('/*', function(req,res) {
//   res.sendFile(path.join(__dirname+
//     '/dist/salvusfrontend/index.html'));});
// app.listen(process.env.PORT || 8080);
//
// const cors = require('cors');
// app.use(cors());

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.static(__dirname + '/dist/salvusfrontend'));

// Redirect to salvusai.com
app.get('/*', function(req, res) {
  res.redirect(301, 'https://salvusai.com' + req.originalUrl);
});

app.listen(process.env.PORT || 8080);
