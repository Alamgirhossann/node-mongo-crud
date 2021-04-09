const express = require('express')
const password = 'w9BRMKESFwvMNjdi';
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organic-product:w9BRMKESFwvMNjdi@cluster0.s5oej.mongodb.net/organic-product?retryWrites=true&w=majority";

app.get('/', (rea, res) => {
    res.sendFile(__dirname + '/index.html')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("organic-product").collection("product");
    console.log('database connected');

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, document) => {
                res.send(document)
            })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document[0])
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                res.redirect('/')
            })
    })
    

    app.patch('/update/:id', (req, res) => {
        console.log(req.body.price);
        collection.updateOne({ _id: ObjectId(req.params.id) },
     
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
               res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })


});



app.listen(3000)

