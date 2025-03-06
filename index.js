const express = require("express");
const app = express();
const cors = require("cors")
const voitureRoute = require("./src/routes/voiture.routes");
require("dotenv").config();


app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/voiture",voitureRoute)



const server = app.listen(process.env.port,process.env.host,()=>{
    console.log(
        `Server is running at http://${process.env.host}:${process.env.port}`
    );
})

module.exports = {app,server}