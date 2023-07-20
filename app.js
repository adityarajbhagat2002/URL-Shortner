require('dotenv').config();
const express = require('express');
const mongoose= require('mongoose');
const urlRoute = require('./routes/url')
const userRoute = require('./routes/user')
const {connectToMongoDB} = require('./connect')
const URL =require('./models/url');
const path = require('path');
const staticRoute = require('./routes/staticRouter')
const cookieParser =  require('cookie-parser');
const {restictToLoggedInUserOnly , checkAuth} = require('./middlewares/auth')

const PORT = process.env.PORT || 8000;
const app = express();


connectToMongoDB(process.env.MONGO_URL)
.then(()=>console.log('MongoDB connected'))

app.set('view engine' , 'ejs')
app.set('views',path.resolve('./views') )

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

app.use('/url' ,restictToLoggedInUserOnly, urlRoute)
app.use('/user' , userRoute)
app.use('/' , checkAuth , staticRoute)

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
