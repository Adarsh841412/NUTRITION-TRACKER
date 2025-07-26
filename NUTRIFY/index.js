const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// models and middleware
const userModel = require('./models/userModel');
const foodModel = require('./models/foodModel');
const trackingModel = require('./models/trackingModel');
const verifyToken = require('./verifyToken');

// database connection
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
  .then(() => console.log("Database connection successful"))
  .catch(err => console.log(err));

// session store
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// session options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

const app = express();
app.use(express.json());
app.use(cors());

// user registration
app.post("/register", (req, res) => {
  let user = req.body;
  bcrypt.genSalt(10, (err, salt) => {
    if (!err) {
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (!err) {
          user.password = hpass;
          try {
            let doc = await userModel.create(user);
            res.status(201).send({ message: "User Registered" });
          } catch (err) {
            console.log(err);
            res.status(500).send({ message: "Some Problem" });
          }
        }
      });
    }
  });
});

// user login
app.post("/login", async (req, res) => {
  let userCred = req.body;
  try {
    const user = await userModel.findOne({ email: userCred.email });
    if (user !== null) {
      bcrypt.compare(userCred.password, user.password, (err, success) => {
        if (success === true) {
          jwt.sign({ email: userCred.email }, "nutrifyapp", (err, token) => {
            if (!err) {
              res.send({ message: "Login Success", token: token, userid: user._id, name: user.name });
            }
          });
        } else {
          res.status(403).send({ message: "Incorrect password" });
        }
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem" });
  }
});

// get all foods
app.get("/foods", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find();
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem while getting info" });
  }
});

// search food by name
app.get("/foods/:name", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find({ name: { $regex: req.params.name, $options: 'i' } });
    if (foods.length !== 0) {
      res.send(foods);
    } else {
      res.status(404).send({ message: "Food Item Not Found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});

// track food
app.post("/track", verifyToken, async (req, res) => {
  let trackData = req.body;
  try {
    let data = await trackingModel.create(trackData);
    console.log(data);
    res.status(201).send({ message: "Food Added" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in adding the food" });
  }
});

// get all tracked food for a user by date
app.get("/track/:userid/:date", async (req, res) => {
  let userid = req.params.userid;
  let date = new Date(req.params.date);
  let strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

  try {
    let foods = await trackingModel.find({ userId: userid, eatenDate: strDate }).populate('userId').populate('foodId');
    console.log(foods);
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});

// serve React static files in production
app.use(express.static(path.join(__dirname, 'client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

// start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
