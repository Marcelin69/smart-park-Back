const express = require("express");
const app = express();
const cors = require("cors")
const voitureRoute = require("./src/routes/voiture.routes");
const reservationRoute = require("./src/routes/reservation.routes");
const authRoute = require("./src/routes/auth.routes");
require("dotenv").config();


app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/voiture",voitureRoute)
app.use("/api/reservation",reservationRoute)
app.use("/api/auth",authRoute)



const server = app.listen(process.env.port,process.env.host,()=>{
    console.log(
        `Server is running at http://${process.env.host}:${process.env.port}`
    );
})

module.exports = {app,server}