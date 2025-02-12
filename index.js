const express = require("express");


const port = 3001
const app = express();
const voitureRoute = require("./routes/voiture.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("api/voiture",voitureRoute)



app.listen(port,()=>{
    console.log("server is running on port 3001");
})
