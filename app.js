require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());


const userRoutes=require("./Controller/userRoutes")
// Use the user routes
app.use('/api', userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("server up and running on PORT :", port);
});