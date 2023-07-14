const express = require('express');
const mongoose= require('mongoose');
const urlRoute = require('./routes/url')
const {connectToMongoDB} = require('./connect')
const URL =require('./models/url');

const PORT = 8001;
const app = express();


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('MongoDB connected'))

app.set('view engine' , 'ejs')

app.use(express.json());

app.use('/url' , urlRoute)

app.get('/:shortID' , async(req,res)=>{
    const shortID = req.params.shortID;
    const entry = await URL.findOneAndUpdate({
        shortID
    },{
        $push:{
            visitHistory: {
                timestamp : Date.now(),
            }
        }
    })

    res.redirect(entry.redirectURL)
})




app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})