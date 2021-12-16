const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
const store = new MongoDBStore({
  uri: "mongodb://saisatwik-1:saisatwik@first-shard-00-00.fitvi.mongodb.net:27017,first-shard-00-01.fitvi.mongodb.net:27017,first-shard-00-02.fitvi.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=First-shard-0&authSource=admin&retryWrites=true&w=majority",
  collection: 'sessions'
});
dotenv.config();


app.use(express.json());

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
  }))

app.use("/admin",adminRoutes);
app.use("/user",userRoutes);


mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    app.listen(process.env.PORT);
    console.log("Server started");
  })
  .catch(err => {
    console.log(err);
  });