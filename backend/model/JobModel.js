import mongoose from "mongoose";

const Job = new mongoose.Schema({
    company: {type : String, required: true},
    role: {type : String, required: true},
    status: {type: String, required: true}, 
    dateApplied: Date, 
    link: {type: String}, 
    notes: {type: String}
})


export default mongoose.model("Job", Job)

