const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

// get all tasks
const getAllTasks = asyncWrapper( async (req, res) => {
    const tasks = await Task.find();
    res.status(200).json({ tasks })
  }
)

//Create a task
const createTasks = asyncWrapper(async (req, res) => {

const { name, completed } = req.body;

// You can decide to prevent duplicate tasks with the code below
const existingTask = await Task.findOne({ name });

if (existingTask) {
  return res.status(409).json({error:'existing task'});
}

const task = await Task.create({
   
  name: name,
  completed: completed

})

//Return a success status with the created task
res.status(201).json({task});

})

//Get a particular task by ID
const getTask = asyncWrapper( async (req, res) => {

    const { id } = req.params;

    const task = await Task.findById(id);
    
    if (!task) {
      // Task with the provided ID was not found
      const error = new Error('Not Found')
      error.status = 404

      return res.status(404).json({ error: `No task with Id ${id}`});
    }
    
    res.status(200).json({ task })

  } )


// Update a task by Id
const updateTask = asyncWrapper( async (req, res) => {

  const { name, completed } = req.body;
  const { id } = req.params;

  const existingTask = await Task.findById(id);

  if(!existingTask) {
    return res.status(404).json({error:"task does not exist"})

  }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {name: name, completed: completed }, 
      { new: true })
 
  res.status(200).json({ message: 'Task updated successfully', task:updatedTask }); 

} )


// delete a task by id
const deleteTask = asyncWrapper( async (req, res) => {
  
  const { id } = req.params;

  const deletedTask = await Task.findByIdAndDelete(id)

  if (!deletedTask) {
    return res.status(404).json({error:`task with id ${id} does not exist`})
  }

  res.status(200).json({message:`Task ${id} deleted successfully`});

})

module.exports = {
  getAllTasks, createTasks, getTask,
  updateTask, deleteTask
}