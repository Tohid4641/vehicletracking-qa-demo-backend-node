const express = require("express");
const { Server } = require("socket.io");
const https = require("https");
const http = require("http");
const app = express();
const formRoutes = require("./routes/form.routes");
const manualDemo = require("./routes/manualDemo.routes.js");
const automaticDemo = require("./routes/automaticDemo.routes.js");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser=require('cookie-parser');
const fs = require('fs');
const verifyToken = require("./middlewares/socketAuthorization");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(express.json())
app.use(cors());
app.use(morgan("short"));

// EJS
app.set('view engine','ejs');
app.set('views','./views');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api-demo.vehicletracking.qa/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api-demo.vehicletracking.qa/fullchain.pem'),
};

// const server = http.createServer(app);  // for local
const server = https.createServer(options,app); // for server

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

global.io = io;

app.use("/api/vt-qa/demo/", formRoutes);
app.use("/api/vt-qa/demo/manual-demo", manualDemo);
app.use("/api/vt-qa/demo/automatic-demo", automaticDemo);

// middleware for authenticate socket connection
io.use(verifyToken);


// socket connection
io.on("connection", (socket) => {
  console.log("user connected!");
});

const port=process.env.PORT || 5000

// For Local
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// For Server
server.listen( port, () =>
  console.log(
    `---------------------------------------------------------------------
Server Listening :::: https://api-demo.vehicletracking.qa:${port}/
-------------------------------------------------------------------`
  )
);

