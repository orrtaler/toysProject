const express= require("express");
const {auth} = require("../middlewares/auth")
const {ToysModel,validateToy} = require("../models/toyModel")
const router = express.Router();

router.get("/" , async(req,res)=> {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;

  try{
    let data = await ToysModel.find({})
    .limit(perPage)
    .skip((page - 1) * perPage)
    .sort({_id:-1})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.get("/search",async(req,res) => {
  try{
    let queryS = req.query.s;

    let searchReg = new RegExp(queryS,"i")
    let data = await ToysModel.find({ $or: [{ name: { $regex: searchReg} }, { info: { $regex: searchReg } }] })
    .limit(50)
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.get("/category/:catname", async(req, res) => {
  let type = req.params.catname;
  let temp_ar = await ToysModel.filter(item => item.category == type)
  res.json(temp_ar)
})

router.get("/single/:id", async (req, res) => {
  let id = req.params.id;
  try {
      let data = await ToyModel.findOne({_id:id});
      res.json(data)
  }
  catch(err) {
      console.log(err);
      res.status(500).json({msg: "err", err});
  }
})

router.get("/prices", async(req, res) => {
  try{
      let minQ = req.query.min || 0;
      let maxQ= req.query.max || Infinity;
      let perPage = req.query.perPage || 10;
      let data = await ToyModel.find({price: { $gte: minQ, $lte: maxQ }}).limit(perPage)
      res.json(data);
  }
  catch(err) {
      console.log(err)
      res.status(500).json({msg: "err", err})
  } 
})

router.post("/", auth,async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let cake = new ToysModel(req.body);
    cake.user_id = req.tokenData._id;
    await cake.save();
    res.status(201).json(cake);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})


router.put("/:editId",auth, async(req,res) => {
  let validBody = validateToy(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let editId = req.params.editId;
    let data;
    if(req.tokenData.role == "admin"){
      data = await ToysModel.updateOne({_id:editId},req.body);
    }
    else{
      data = await ToysModel.updateOne({_id:editId,user_id:req.tokenData._id},req.body)
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

router.delete("/:delId",auth, async(req,res) => {
  try{
    let delId = req.params.delId;
    let data;
    if(req.tokenData.role == "admin"){
      data = await ToysModel.deleteOne({_id:delId});
    }
    else{
      data = await ToysModel.deleteOne({_id:delId,user_id:req.tokenData._id});
    }
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:"there error try again later",err})
  }
})

module.exports = router;