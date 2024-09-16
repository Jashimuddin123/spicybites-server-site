const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config();
const app =  express();
const port = process.env.PORT || 5000;

// MIDDLEWARE 
app.use(cors());
app.use(express.json())

// spicybites
// Pwz8jMmAJMRvQVtr

// mongodb database 
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3tcc9mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// const uri = "mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3tcc9mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb+srv://spicybites:Pwz8jMmAJMRvQVtr@cluster0.3tcc9mo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



const addFoodCollection = client.db('addfood').collection('add');
const foodPurchaseCollection = client.db('purchaseItem').collection('foodPurchases');

// Post method for food purchase
app.post('/purchasefood', async (req, res) => {
  const purchaseData = req.body;
  console.log('Purchase data received:', purchaseData);
  
  const result = await foodPurchaseCollection.insertOne(purchaseData);
  res.send(result);
});



// user collection
const userCollection = client.db('user').collection('user')
  // Post method
  app.post('/addfood', async (req, res) => {

    const newAdd = req.body;
    console.log('this is server post api',newAdd);
    const result = await addFoodCollection.insertOne(newAdd);
    res.send(result);
  });

  
    //  get method  for take data from database
    app.get('/addfood' , async (req, res)=>{
      const queryEmail = req.query.email;
      console.log('top food card here');
      
      if(queryEmail){
        const filter = {email:queryEmail};
        const result = await addFoodCollection.find(filter).toArray()
        return res.send(result)
      }
      const cursor = addFoodCollection.find()
      const result = await cursor.toArray()
      return res.send(result)
  })


  	// load single data 
	app.get('/addfood/:id', async(req,res) => {
		const id = req.params.id;
		const query = {_id: new ObjectId (id)}
		const result = await addFoodCollection.findOne(query);
		res.send(result);
	})


  // Post method
  app.post('/addfood', async (req, res) => {

    const newAdd = req.body;
    console.log('this is server post api',newAdd);
    const result = await foodPurchaseCoolection.insertOne(newAdd);
    res.send(result);
  });




   // get method by _id
  //  app.get('/addfood/:id', async(req, res)=>{
  // //   // const id = req.params.id;
  // //   // console.log('find id',id);
  // //   // const filter = {_id: new ObjectId(id)}
  // //   // const result = await addFoodCollection.findOne(filter);
  // //   // res.send(result)
  // // }) 
    



  // user related  api 
  app.post('/user', async(req, res)=>{
    const user = req.body;
    console.log('user body', user);
    const result = await userCollection.insertOne(user);
    res.send(result)
    
  })

// ----------------------------------====......................................................
// testing api 
app.get('/', (req, res)=>{
    res.send('simple jashim  crud is running')
})

// testing api for server
app.listen(port, ()=>{
    console.log(`Simple crud Running On port ${port}`);
    
})