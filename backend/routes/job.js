import express from "express"
import JobModel from "../model/JobModel.js"

const router = express.Router()


router.get('/', async(req, res) => {
    const posts = await JobModel.find();
    res.json(posts)
})

router.post('/', async(req, res) => {
    const job = await JobModel.create(req.body);
    res.status(201).json(job)
})

router.patch('/:id', async(req, res) => {
    try{
        const updatedJob = await JobModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body},
            {new: true, runValidators: true}
        );

        if (!updatedJob) return res.status(404).send("Item not found");
        res.status(200).json(updatedJob);
    } catch (error){
        res.status(400).json({message: error.message})
    }
})


export default router;