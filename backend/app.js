const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");

const app = express();

//Route import
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use(express.json());
app.use(cookieParser());

app.use("/products/item", product);
app.use("/products/item", user);

app.use(errorMiddleware);
module.exports = app;
