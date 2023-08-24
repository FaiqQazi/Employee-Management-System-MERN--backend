/* there are gonna be 5 routes 
1 for the creating of task later only assigned to employer 
2 is the read to be viewed by both employee and employer
3 some how it is job to try to make update such that the user side can only update the the report and not the other while employer can uppdate every thing 
4 delete only possible by employer when <submitted></submitted>
*/
const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Task=require('../models/Tasks');
const fetchuser = require('../middleware/fetchuser');


router.get('/getalltasks',fetchuser,async (req, res) =>
{
    const tasks=await Task.find({user:req.user.empid});
   
    try{
    if(!tasks)
    {
        res.json("no tasks at the moment");
    }
    else
    {
        res.json(tasks);
    }
}
catch(error){
    
        console.error(error.message);
        res.status(500).send("Internal Server Error");
}
})


router.get('/getallemployertasks',fetchuser,async (req, res) =>
{
    const tasks=await Task.find();
    try{
    if(!tasks)
    {
        res.json("no tasks at the moment");
    }
    else
    {
        res.json(tasks);
    }
}
catch(error){
    
        console.error(error.message);
        res.status(500).send("Internal Server Error");
}
})



router.post('/createnewtask',fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Enter a valid description').isLength({ min: 1 }),
    body('empid', 'Enter a valid id').isLength({ min: 1 })
   
  ],async (req, res) =>
{
    try{
        const {title,description,empid}=req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const task=new Task({
            title:req.body.title,
            description:req.body.description,
            empid:req.body.empid
        })
        savedtask=await task.save();
        res.json(savedtask);

    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})




// router.put('/updatetask/:id',fetchuser,[
//     body('title', 'Enter a valid title').isLength({ min: 1 }),
//     body('description', 'Enter a valid description').isLength({ min: 1 }),
//     body('report', 'Enter a valid report').isLength({ min:1 })

//   ],async (req, res) =>
//   {
//      const {title,description,report}=req.body;
//      try{
// const newtask={};
// if(title)
// {
//     newtask.title=title;
// }
// if(description)
// {
//     newtask.description=description;
// }
// if(report)
// {
//     newtask.report=report;
// }
// newtask= await Task.findById(req.params.id);
// newtask = await Note.findByIdAndUpdate(req.params.id, { $set: newtask }, { new: true });
// res.json(newtask);

//      }
//      catch(error){
//         console.error(error.message);
//         res.status(500).send("Internal Server Error");
//      }
//   })
router.put('/updatetask/:id', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Enter a valid description').isLength({ min: 1 }),
    body('report', 'Enter a valid report').isLength({ min: 1 })
  ], async (req, res) => {
    const { title, description, report } = req.body;
    
    try {
      // Create a new task object
      const newTask = {};
      if (title) {
        newTask.title = title;
      }
      if (description) {
        newTask.description = description;
      }
      if (report) {
        newTask.report = report;
      }
      
      // Find the task to be updated and update it
      let task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send("Not Found");
      }
  
      // Assuming 'task.user' is the user associated with the task
      // Check if the user is authorized to update the task
    //   if (task.user.toString() !== req.user.id) {
    //     return res.status(401).send("Not Allowed");
    //   }
  
      task = await Task.findByIdAndUpdate(req.params.id, { $set: newTask }, { new: true });
      res.json({ task });
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  



 
router.delete('/deletetask/:id', fetchuser, async (req, res) => {
    try {
      const taskToDelete = await Task.findById(req.params.id);
  
      if (!taskToDelete) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      // Make sure the user is authorized to delete the task (if required)
  
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: 'Task deleted successfully' });
    } catch(error)  {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  //end of Task routes
  module.exports = router