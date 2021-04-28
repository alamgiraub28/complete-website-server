const express = require('express');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qw23i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('reviewerImg'));
app.use(fileUpload());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Mr Alamgir Server Working dont worry!")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const serviceCollection = client.db("adalatService").collection("service");
  const reviewCollection = client.db("adalatService").collection("allReview");
  const bookingCollection = client.db("adalatService").collection("allOrder");
  const adminCollection = client.db("adalatService").collection("admin");



  console.log('database connect');

  // make admin
  app.post('/makeAdmin', (req, res) => {
    const admin = req.body;
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount)
    })
})

// find admin email
app.get('/admin/:email', (req, res) => {
    const email = req.params.email
    adminCollection.find({ email: email })
    .toArray((err, document) => {
        res.send(document[0])
    })
})

// add new service
app.post('/addService', (req, res) => {
    const services = req.body;
    serviceCollection.insertOne(services)
    .then(result => {
        res.send(result.insertedCount)
    })
})

// all services
app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

// single Service
app.get('/service/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectId(req.params.id) })
    .toArray((err, documents) => {
        res.send(documents);
    })
})

// Delete Service
app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
    .then(result => {
        res.send(result.deletedCount > 0)
    })
})

// add new Review
app.post('/addReview', (req, res) => {
    const reviews = req.body;
    reviewCollection.insertOne(reviews)
    .then(result => {
        res.send(result.insertedCount)
    })
})

// all Reviews
app.get('/reviews', (req, res) => {
    reviewCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

// add booking orders
app.post('/addOrder', (req, res) => {
    const orders = req.body;
    bookingCollection.insertOne(orders)
    .then(result => {
        res.send(result.insertedCount)
    })
})

// all booking orders
app.get('/orders', (req, res) => {
    bookingCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
})

// user booking orders
app.get('/order', (req, res) => {
    const email = req.query.email
    bookingCollection.find({ email: email })
        .toArray((err, documents) => {
        res.send(documents)
    })
})


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
