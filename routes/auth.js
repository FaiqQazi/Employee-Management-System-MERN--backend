const express=require('express');
const mongoose=require('mongoose');
const User = require('../models/Users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET='faiq';






router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 1 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 1 }),
    body('role', 'Enter a valid role').isIn(['employee', 'employer']) ,
    body('empid', 'emp id not correct').isLength({ min: 1 })
  ], async (req, res) => {
    // If there are errors, return Bad request and the errors
    
    try {
        const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
  
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        role:req.body.role,
        empid:req.body.empid
      });
      const data = {
        user: {
          id: user.id
          //empid:user.empid
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
  
  
      // res.json(user)
      console.log(req.body);
      res.json({ authtoken })
  
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })




//   router.post('/login',fetchuser,[
//     body('email', 'Enter a valid email').isEmail(),
//     body('password', 'Password must be atleast 1 characters').isLength({ min: 1 }),
//   ],async (req, res) =>
//   {
//     const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//    const {email,password}=req.body;
// let user=await User.findOne({email});
// if(!user)
// {
//     return res.status(400).json({ success, error: "Please try to login with correct credentials" });
// }
// const passwordCompare = await bcrypt.compare(password, user.password);
// if (!passwordCompare) {
//   success = false
//   return res.status(400).json({ success, error: "Please try to login with correct credentials" });
// }
// const data = {
//     user: {
//       id: user.id
//     }
//   }
//   const authtoken = jwt.sign(data, JWT_SECRET);
//   success = true;
//   console.log('Received request with body:', req.body);
//   res.json({ success, authtoken,role:user.role,name:user.name})

//   })
// Route:-2 Authentication a user using: POST "api/auth/login". Doesn't require Auth
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;

  const error = validationResult(req);
  if (!error.isEmpty()) {
      return res.status(404).json({ error: error.array() });
  }

  const {email, password} = req.body;
  try {
      let user = await User.findOne({email});
      if(!user){
          success = false;
          return res.status(404).json({error: "please try to login with connect credentials"})
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
          success = false;
          return res.status(404).json({success, error: "please try to login with connect credentials"})
      }

      const data = {
          user:{
              id: user.id
              // empid:user.empid
          }
      }
      const authtoken  = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken,role:user.role,name:user.name,empid:user.empid})


  } catch (error) {
      console.error(error.massage);
      res.status(500).send("Internal server Error");
  }

})   



//authenticate user

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password")
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  module.exports = router
