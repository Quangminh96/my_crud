const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const app = express();


app.set('view engine','ejs');

var db;

MongoClient.connect('mongodb://quangminh:12345678@ds119682.mlab.com:19682/my-quotes',(err,database)=>{
	if (err) return console.log(err)
	  db = database
	  app.listen(3000, () => {
	    console.log('listening on 3000');
  		});
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(bodyParser.json());
app.get('/',(req,res)=>{
	db.collection('quotes').find().toArray( (err,result)=>{
		if(err) return console.log(err);
		res.render('index.ejs',{quotes: result});
	});
});

app.post('/quotes',(req,res)=>{
	db.collection('quotes').save(req.body,(err, result)=>{
		if(err) return console.log(err);
		console.log('saved to db');
		res.redirect('/');
	});
});

app.put('/quotes',(req,res)=>{
	db.collection('quotes').findOneAndUpdate(
		{name: 'Minh'},
		{
			$set: {
				name: req.body.name,
				quote: req.body.quote
			}
		},
		{
			sort: {_id: -1},
			upsert: true
		}, 
		(err,result)=>{
			if(err) return res.send(err);
			res.send(result);
		});
	fetch('quotes', {
	  method: 'put',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify({
	    'name': 'Darth Vader',
	    'quote': 'I find your lack of faith disturbing.'
	  })
	})
	.then(res => {
	  if (res.ok) return res.json()
	})
	.then(data => {
	  console.log(data)
	})
});
