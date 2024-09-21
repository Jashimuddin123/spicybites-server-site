const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors")
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const app =  express();
const port = process.env.PORT || 5000;

// MIDDLEWARE 
app.use(cookieParser())
app.use(cors({
  origin: 'http://localhost:5173', // Match this to your frontend's address
  credentials: true
}));
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
const cookieOption = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

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

// jsaon web token api 
app.post('/jwt', async(req, res)=>{
  const user = req.body;
   console.log('json token', user);
  
  const token = jwt.sign(user,process.env.ACCES_TOKEN , {expiresIn: "7h"})
  
  res.cookie('token', token , cookieOption).send({success : true})
})

app.post('/logout', async(req, res)=>{
  console.log('this is logout ');
  
  res.clearCookie('token',{...cookieOption, maxAge:0}).send({success:true})
})
// Post method for food purchase
app.post('/purchasefood', async (req, res) => {
  const purchaseData = req.body;
  console.log('Purchase data received:', purchaseData);
  
  const result = await foodPurchaseCollection.insertOne(purchaseData);
  res.send(result);
});



 
// Purchase method count
app.put('/purchasefood/:id',async(req, res)=>{
  const id = req.params.id;
  console.log('params id', id);
  const filter = { _id: new  ObjectId(id) };
    
  const result = await addFoodCollection.updateOne(filter, {$inc:{purchaseCount : 1}}, { upsert: true });
    res.send(result);
  
})
  

    //  get method  for take data from database
    app.get('/purchasefood' , async (req, res)=>{
      const queryEmail = req.query.email;
      console.log('top food card here');
      
      if(queryEmail){
        const filter = {email:queryEmail};
        const result = await addFoodCollection.find(filter).toArray()
        return res.send(result)
      }
      const cursor = foodPurchaseCollection.find()
      const result = await cursor.toArray()
      return res.send(result)
  })



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
//get method for top food section
app.get('/topFood', async(req, res)=>{
  const result =  await addFoodCollection.find().sort({purchaseCount : -1}).toArray()
  res.send(result)
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

  // update method ,,for update data
  app.put('/addfood/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
    console.log('Update data from client:', updateData);

    const filter = { _id: new ObjectId(id) };
    const updateDocument = {
        $set: {
            food_name: updateData.updatedFoodName,
            price: updateData.updatedFoodPrice,
            food_category: updateData.updatedFoodCategory,
            food_image: updateData.updatedFoodImage
        },  
        
    };
    
    const result = await addFoodCollection.updateOne(filter, updateDocument, { upsert: true });
    res.send(result);
});



  // delete method
  app.delete('/purchasefood/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await foodPurchaseCollection.deleteOne(query);
    res.send(result)
  } )



  // user related  api 
  app.post('/user', async(req, res)=>{
    const user = req.body;
    console.log('user body', user);
    const result = await userCollection.insertOne(user);
    res.send(result)
    
  })


// get api for search method impliment in all foods apges

  app.get('/addfood', async (req, res) => {
    const queryFoodName = req.query.food_name;
    let result;
  
    if (queryFoodName) {
      // If the query contains a food name, filter by food_name
      const filter = { food_name: { $regex: queryFoodName, $options: "i" } }; // case insensitive search
      result = await addFoodCollection.find(filter).toArray();
    } else {
      // If no query parameter is present, return all food items
      const cursor = addFoodCollection.find();
      result = await cursor.toArray();
    }
    
    res.send(result);
  });
  

// ----------------------------------====......................................................
// testing api 
app.get('/', (req, res)=>{
    res.send('simple jashim  crud is running')
})

// testing api for server
app.listen(port, ()=>{
    console.log(`Simple crud Running On port ${port}`);
    
})