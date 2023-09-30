const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const cors = require("cors");

require("dotenv").config();

const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 8000;

const mongoose = require("./db/database");

app.use(express.json());
app.use(express.urlencoded({
    extended : false
}))
app.use(cors());
app.use(fileUpload({
    useTempFiles : true
}))


app.use("/api/auth/", require("./routes/authRoutes"));
app.use("/api/posts/", require("./routes/postRoutes"));
app.use("/api/comments/", require("./routes/commentRoutes"));
app.use("/api/review", require("./routes/ratingRoutes"));
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})

