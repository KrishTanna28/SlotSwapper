import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    if(password.length < 6){
        return res.status(400).json({message:"Password must be at least 6 characters long"});
    }
    if(!email.includes("@")){
        return res.status(400).json({message:"Invalid email"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword){
        return res.status(500).json({message:"Internal server error"});
    }
    try{
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const newUser = await User.create({name,email,passwordHash:hashedPassword});
        const token = generateToken(newUser);
        return res.status(201).json({message:"User created successfully",user:newUser,token});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:"All fields are required"});
    }
    if(!email.includes("@")){
        return res.status(400).json({message:"Invalid email"});
    }
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password,user.passwordHash);
        if(!isPasswordValid){
            return res.status(400).json({message:"Invalid password"});
        }
        const token = generateToken(user);
        return res.status(200).json({message:"User logged in successfully",user,token});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logoutUser = async(req,res)=>{
    try{
        req.user = null;
        return res.status(200).json({message:"User logged out successfully"});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal server error"});
    }
}