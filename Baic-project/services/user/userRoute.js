const express = require("express")
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../../middleware/auth");
const userRouter = express.Router();
userRouter.use(express.json())
// const auth =authenticateToken

userRouter.post('/signUp',async(req,res)=>{

    const {firstName,lastName,userName,password} = req.body;

        try{
            const existingUser = await prisma.user.findUnique({
            where:{
                
                    userName:userName
            },
        });
        if(existingUser){
            return res.status(400).json({'error':"user alreday exist"})

        }
        const hashedPassword = await bcrypt.hash(password,10)

        const user = await prisma.user.create({
            data:{firstName,
            lastName,
            userName,
            password:hashedPassword}
        })
        const{password:_password,...userWithoutPassword}=user

        res.status(201).json(userWithoutPassword)
    }catch(error){
        console.log("Error:", error);
        res.status(500).json({"errro":error})

    }
    })

userRouter.post('/login',async(req,res)=>{
    const {userName,password}=req.body
    try{
        const user = await prisma.user.findUnique({
          where:{
            userName:userName,
          }  
        })
        if (!user){
            res.status(400).json({"Error":"Invalid Creditionals"})
        }

        const passwordMatch =bcrypt.compare(password,user.password)
        if(!passwordMatch){
            res.status(400).json({"Error":"Invalid Creditionals"})
        }

        const token =jwt.sign(
            {userId:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )
        res.status(200).json({"message":"Login SucessFull","token":token})

    }catch(error){
        console.log({"error":error})
        res.status(500).json({"Error":"Internal Server Errror"})
    }

})

userRouter.get('/fetchALl',authenticateToken,async(req,res)=>{
    try{
        const data = await prisma.user.findMany({
        select:{
            id:true,
            firstName:true,
            lastName:true,
            userName:true,
            createdAt:true,
            updatedAt:true
        }
    })
    res.status(200).json(data)
}catch(error){
    console.log("errror",error)
    res.status(500).json({ error: ['Internal server error'] });
}
})

// 
userRouter.get('/fetchById',authenticateToken,async(req,res)=>{
    try {
        const {userId}=req.user
        console.log("userId",userId)

        const user = await prisma.user.findUnique({
            where:{id:userId},
            select:{
                id:true,
                firstName:true,
                lastName:true,
                userName:true
            }
        })

        if(!user){
            res.status(400).json({"error":"user not found"})
        }
        res.status(200).json(user)

    }catch(error){
        console.log("Error",error)
        res.status(500).json({"error":error})
    }
})



module.exports=userRouter