const express = require("express");
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
require("dotenv").config();


//connection to Db
connectToDb();


// init app
const app = express();



//middlewares
app.use(express.json()); //to parse the incoming requests with JSON payloads


//Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));


// Error Handler Middlewate
app.use(notFound);
app.use(errorHandler);





// Running the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));