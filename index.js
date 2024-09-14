const express = require('express');
const cors = require("cors")
const app =  express();
const port = process.env.PORT || 5000;

// MIDDLEWARE 
app.use(cors());
app.use(express.json())


// testing api 
app.get('/', (req, res)=>{
    res.send('simple crud is running')
})

// testing api for server
app.listen(port, ()=>{
    console.log(`Simple crud Running On port ${port}`);
    
})