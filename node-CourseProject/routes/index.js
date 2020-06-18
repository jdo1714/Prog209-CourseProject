var express = require('express');
var router = express.Router();

function Spending(pTitle, pType, pPrice, pDateMonth, pDateDay, pDateYear) {
  this.title= pTitle;
  this.type = pType;
  this.price = pPrice;
  this.dateMonth = pDateMonth;
  this.dateDay = pDateDay;
  this.dateYear = pDateYear;
}

ServerSpendings = [];

ServerSpendings.push(new Spending("Lunch at Restaurant", "Food", 50, 5, 18, 20));
ServerSpendings.push(new Spending("New sweaters", "Clothing", 100, 3, 21, 20))
ServerSpendings.push(new Spending("Videogames", "Technology", 60, 4, 20, 20));
ServerSpendings.push(new Spending("Snacks", "Food", 10, 5, 5, 20));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile("./public/");
});

// Get all spendings data
router.get('/getAllSpendings', function(req, res){
  res.status(200).json(ServerSpendings);
});
// Add new spending
router.post('/AddSpending', function(req, res){
  const newSpending = req.body;
  ServerSpendings.push(newSpending);
  ServerSpendings.sort(function(a, b) {
    if (a.dateYear > b.dateYear)
    { return +1; }
    if (a.dateYear < b.dateYear)
    { return -1; }
    if (a.dateYear = b.dateYear)
    {
        if (a.dateMonth > b.dateMonth)
        { return +1; }
        if (a.dateMonth < b.dateMonth)
        { return -1; }
        if (a.dateMonth = b.dateMonth)
        {
            if (a.dateDay > b.dateDay)
            { return +1; }
            if (a.dateDay < b.dateDay)
            { return -1; }
            if (a.dateDay = b.dateDay)
            { return 0; }
        }
    }

});
  res.status(200).json(newSpending);
});
// Delete spending
router.delete('/DeleteSpending/:Index', (req,res) => {
  const indexNumber = req.params.Index;
  console.log(indexNumber);
  let found = false;
        for(var i = 0; i < ServerSpendings.length; i++) // find the match
        {
          console.log
            if(i == indexNumber){
                ServerSpendings.splice(i,1);  // remove object from array
                found = true;
                break;
            }
        }
        if(!found){
            console.log("not found");
            return res.status(500).json({
              status: "error"
            });
        }
        else {
          res.send('Spending deleted!');
        }
});

module.exports = router;
