const express = require('express');
const mongoose= require('mongoose');
const urlRoute = require('./routes/url')
const userRoute = require('./routes/user')
const {connectToMongoDB} = require('./connect')
const URL =require('./models/url');
const path = require('path');
const staticRoute = require('./routes/staticRouter')


const PORT = 8001;
const app = express();


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(()=>console.log('MongoDB connected'))

app.set('view engine' , 'ejs')
app.set('views',path.resolve('./views') )

app.use(express.json());
app.use(express.urlencoded({extended : false}))

app.use('/url' , urlRoute)
app.use('/user' , userRoute)
app.use('/' , staticRoute)

app.get("/url/:shortID", async (req, res) => {
    const shortID = req.params.shortID;
    try {
      const entry = await URL.findOneAndUpdate(
        { shortID },
        {
          $push: {
            visitHistory: {
              timestamp: Date.now(),
            },
          },
        }
      );
      if (!entry || !entry.redirectURL) {
        return res.status(404).json({ error: 'Short URL not found' });
      }
      res.redirect(entry.redirectURL);
    } catch (error) {
      return res.status(500).json({ error: 'Server error' });
    }
  });



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})
