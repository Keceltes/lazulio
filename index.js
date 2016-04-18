var express = require('express');
var wagner = require('wagner-core');

var app = express();

app.set('port', (process.env.PORT || 5000));
//registers models with wagner
module.exports.models = require('./models/models.js')(wagner);
//registers API with wagner
app.use('/api/v1', require('./api')(wagner));
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



/*var Category = models.Category;
var category = new Category({
  _id: "testCategory2"
});

category.save();

Category.find({}).exec(function(err, models) {
  if (err) {
    console.log('error');
  } else {
    console.log(models.length);
  }
});*/

