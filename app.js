const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const borrowedBookRoutes = require("./routes/borrowedBookRoutes");
const { swaggerUi, specs } = require('./config/swagger.config');

app.use(express.json());
require("dotenv").config();
require("./config/db.config");

// app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/", bookRoutes);
app.use("/api/", memberRoutes);
app.use("/api/", borrowedBookRoutes);
 
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
