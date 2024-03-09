const express = require("express");
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");


//connection to Db
connectToDb();


// init app
const app = express();



//middlewares
app.use(express.json()); //to parse the incoming requests with JSON payloads

//security headers helemt
app.use(helmet())

//prevent http params pollution
app.use(hpp());

//prevent xss(cross site scripting ) attacks by cleaning data
app.use(xss());

// Rate limiting
// app.use(rateLimiting({
//   windowMs: 10 * 60 * 1000, //10 min
//   max:200,
// }))

//Cors Policy
app.use(cors({
  origin:"http://localhost:3000"
}));



//Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/password", require("./routes/passwordRoute"));


// Error Handler Middlewate
app.use(notFound);
app.use(errorHandler);





// Running the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));