import userModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function register(req,res){
    const {username,email,password}=req.body;
    const isAlreadyregistered=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isAlreadyregistered){
        res.status(409).json({
            message:"username or email already exist"
        })
    }
    const hashedPassword=crypto.createHash("sha256").update(password).digest("hex");
    const user=await userModel.create({
        username,
        email,
        password:hashedPassword
    })
    const accessToken=jwt.sign({
        id:user._id
    },config.JWT_SECRET,{
            

    })
    const refreshToken=jwt.sign({
        id:user._id
    },config.JWT_SECRET,
    {
        expiresIn:"7d"
    }
)

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7 * 24 * 60 * 60 * 1000//7 DAYS
    })

    res.status(201).json({
        message:"user registeres succesfully",
        user:{
            username:user.username,
            email:user.email,
            email:user.email
        },
        accessToken,
    })
}

export async function getMe(req,res) {
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message:"token not found"
        })
    }
    const decoded=jwt.verify(token,config.JWT_SECRET)
    const user=await userModel.findById(decoded.id)
    res.status(200).json({
        message:"user fetched succesfully",
        user:{
            username:user.username,
            email:user.email,
        }
    })
}

export async function name(params) {
    
}