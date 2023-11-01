const express =require("express")
const app =express()
const userRouter = require("./services/user/userRoute.js")
const postRouter = require("./services/user/posts.js")



const start= async ()=>{
    app.use(express.json())

    app.get("/",(req,res)=>{
        app.use("/user",userROuter)
        res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>API Status</title>
        </head>
        <body>
          <h6>{ "error": "Authorization is required" }</h6>
        </body>
      </html>
    `);
    // app.use("/user",userROuter)
    // app.use(cord)
    
    })
    

}

app.use("/user",userRouter)
app.use("/post",postRouter)



// live
const port =3000
app.listen(port,async()=>{
    start();
    console.log("server is live on 3k")
})