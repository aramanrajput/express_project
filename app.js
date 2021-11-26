const express = require("express")
let data = require("./books.json")


const app = express()

function logger(req,res,next){
   res.name = "Dhaval Chheda"
    next()
}
app.use(logger)


app.use(express.json());
  




// this will return all the users
app.get("/",(req,res)=>{
   
    res.send({ "api_requested_by":res.name,"books":data})
})



// pass an user to it and it will append it to the end of the users and return it
app.post("/books",(req,res)=>{

    let books = [...data,req.body]

    res.send({"api_requested_by":res.name,"books":books})

})

// this will return user with a specific id
app.get("/books/:id",(req,res)=>{
  
   
    const newUser = data.filter((user)=>user.id ==req.params.id)
    
  
    res.send({"api_requested_by":res.name,"book":newUser})
    })

    // pass a different author and published year only and update those on the book that matched the id

    app.patch("/books/:id",(req,res)=>{
        const newUser = data.map((user)=>{
            if(req.params.id==user.id){
                if(req?.body?.id)user.id=req.body.id
                if(req?.body?.author)user.author=req.body.author
                if(req?.body?.book_name)user.book_name=req.body.book_name
                if(req?.body?.pages)user.pages=req.body.pages
                if(req?.body?.published_year)user.published_year=req.body.published_year
            }
            return user
        })
        res.send({"api_requested_by":res.name,"books":newUser})
    })


    // delete the book that matched the id
    app.delete("/books/:id",(req,res)=>{
  
   
        const newUser = data.filter((user)=>user.id !=req.params.id)
        
        console.log(newUser)
        res.send({"api_requested_by":res.name,"book":newUser})
        })

app.listen(2346,()=>{
    console.log("listening to port 2346")
})


