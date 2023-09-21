const asyncHandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')

//@desc Get goals
//@route GET /api/goals
//@access private
const getGoals = asyncHandler(async(req,res)=>{
    const goals = await Goal.find({ user: req.user.id})
    res.status(200).json(goals)
})

//@desc Set goal
//@route SET /api/goals
//@access private
const setGoals = asyncHandler(async(req,res)=>{

    if(!req.body.text){
        res.status(400)
        throw new Error('please add something')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

//@desc Update goals
//@route UPDATE /api/goals/:id
//@access private
const updateGoals = asyncHandler(async(req,res)=>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found') 
    }

    //check for user
    if(!req.user){
        res.status(401)
        throw new Error('user not found')
    }

    //make sure logged in user matches goal user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('user not authorized')
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.status(200).json(updatedGoal)
})

//@desc Delete goals
//@route DELETE /api/goals/:id
//@access private
const deleteGoals = asyncHandler(async(req,res)=>{
    const goal = await Goal.findById(req.params.id)

    if(!goal){
        res.status(400)
        throw new Error('Goal not found') 
    }

    //check for user
    if(!req.user){
        res.status(401)
        throw new Error('user not found')
    }

    //make sure logged in user matches goal user
    if(goal.user.toString() !== req.user.id){
        res.status(401)
        throw new Error('user not authorized')
    }

    await goal.deleteOne()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals,
}