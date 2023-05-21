const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aifxgic.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create collection
    const toyCollection = client.db('toyGarden').collection('toys')

    // get all toys in server
    app.get('/toys', async (req, res) => {
      // console.log(req.params.text)
      // if (req.params.text == 'panda' || req.params.text == 'honey' || req.params.text == 'coco') {
      //   const result = await toyCollection.find({ name: req.params.text }).toArray();
      //   return res.send(result)
      // }
      const result = await toyCollection.find().sort({ createdAt: -1 }).toArray();
      res.send(result)
    })

    // get specific id
    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toyCollection.findOne(query);
      res.send(result)
    })

    // post data
    app.post('/addtoy', async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      const result = await toyCollection.insertOne(body)
      res.send(result)
      // console.log(body)
    })

    app.get('/mytoys/:email', async(req, res) => {
      console.log(req.params.email)
      const result = await toyCollection.find({seller_email : req.params.email}).toArray();
      res.send(result)
    })

    // update
    app.put('/updatetoy/:id', async(req, res) => {
      const id = req.params.id;
      const body = req.body;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          quantity_available: body.quantity_available,
          description: body.description,
          price: body.price
        }
      }
      const result = await toyCollection.updateOne(filter, updateDoc);
      res.send(result)
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Kids are playing with toys')
})

app.listen(port, () => {
  console.log(`toys are running on port: ${port}`)
})