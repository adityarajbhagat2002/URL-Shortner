const express = require('express');
const mongoose= require('mongoose');

const app = express();

app.use(express.json());
const PORT = 8001;



app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
})