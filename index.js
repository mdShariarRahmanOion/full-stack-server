const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser= require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;


const port = process.env.PORT || 5055
// console.log(process.env.DB_USER)

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e6ix3.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err',err)
  const ordercollection = client.db("freshValley").collection("order");
  // perform actions on the collection object
  // console.log('Database Connected Successfully')

  app.get('/order', (req, res) =>{
    ordercollection.find()
    .toArray((err, items)=>{
      
      res.send(items)
     console.log('from databse', items);
    })
  })

    app.post('/addOrder', (req, res ) =>{
      const newOrder = req.body;
      console.log('adding new event: ', newOrder);
      ordercollection.insertOne(newOrder)
      .then( result => {
        console.log('inserted count',result.insertedCount)
        res.send(result.insertedCount > 0)
      })
    })

});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})