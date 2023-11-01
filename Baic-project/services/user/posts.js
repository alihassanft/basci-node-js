const express = require('express')
const {PrismaClient} = require("@prisma/client")
const authenticateToken = require("../../middleware/auth")
const prisma =new PrismaClient()
const postRouter =express.Router();
postRouter.use(express.json())



// 
postRouter.post('/createPost',authenticateToken,async(req,res)=>{
    const {title,content,authorId}=req.body
    try{
        const {userId}=req.user
        const post = await prisma.post.create({
            data:{
                title,
                content,
                authorId:userId
            }
        })
        res.status(201).json(post)
    }catch(error){
        console.log("error",error)
    }
    
})

postRouter.get('/fetchAll',authenticateToken,async(req,res)=>{
    try{
        const data = await prisma.post.findMany()
        res.status(200).json(data)

    }catch(error){
        console.log("error",error)
    }
    
})

postRouter.get('/fetchAllByUser',authenticateToken,async(req,res)=>{
    try{
        const userId = req.user.userId
        console.log("user-id",userId)
        const data = await prisma.post.findMany({
            where:{
                authorId:userId
            }
        })
        res.status(200).json(data)

    }catch(error){
        console.log("error",error)
    }
    
})

// like and dislike

postRouter.patch('/updatelikedislike/:postId',authenticateToken,async(req,res)=>{
    const {postId } = req.params
    try{const {likes,dislikes} = req.body

     const updatePOst = await prisma.post.update({
        where:{id:postId},
        data:{likes,dislikes}
     })
     res.status(200).json(updatePOst)
     }catch(error){
        console.log("error",error)
     }
})

module.exports =postRouter

