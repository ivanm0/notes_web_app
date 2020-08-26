const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://notes-api.us.auth0.com/.well-known/jwks.json",
  }),

  audience: "https://notes-api",
  issuer: "https://notes-api.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(cors());
app.use(express.json());
app.use(checkJwt);
app.use("/api/notes", require("./routes/api/notes"));
app.use("/api/tags", require("./routes/api/tags"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
