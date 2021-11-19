const express = require("express")
let data = require("./MOCK_DATA.json")


const app = express()

function logger(req,res,next){
    console.log(req.method)
    next()
}
app.use(logger)



  


app.get("/",(req,res)=>{
    res.send("Welcome to home page")
})


app.get("/users",(req,res)=>{
    res.send(data)
})

app.listen(2346,()=>{
    console.log("listening to port 2346")
})


