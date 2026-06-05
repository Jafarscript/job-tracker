import express from "express" 
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose";
import jobRoutes from "./routes/job.js"

dotenv.config()
const app = express();
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    req.send("Hello World")
})

app.use("/jobs", jobRoutes)

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.log(`"Failed:"${error}`))

app.listen(5050, () => {
    console.log("Click the link to open the url http://localhost:5050/")
})