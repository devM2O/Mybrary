if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require('express');
const app = express()
const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

//Mongoose
const mongoose = require('mongoose');
//connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true,useUnifiedTopology: true})
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log(err));

//Routes
app.use('/', require('./routes/index'));


const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server has started successfully`);
});
