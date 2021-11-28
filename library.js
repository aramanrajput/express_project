const express = require("express");
const mongoose = require("mongoose");

const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/test");
  };

  const app = express();

  app.use(express.json());


  const userSchema = new mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: false, default: "Male" },
    age: { type: Number, required: true },

  },{
    versionKey: false,
    timestamps: true,
  })
  
  const User = mongoose.model("user", userSchema);

  const sectionSchema = new mongoose.Schema(
    {
      Section_name:{type:String,required:true},
 
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  const Section = mongoose.model("section", sectionSchema); 

const bookSchema = new mongoose.Schema(
    {
       book_name:{type:String,required:true},
    body:{type:String,required:true},  
    author_ids:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"author",
            required:true
        }
    ],
    section_id:
        {
           type:mongoose.Schema.Types.ObjectId,
        ref:"section",
        required:true, 
        },
        
    
    },
    {
        versionKey: false,
        timestamps: true,
      }
    

   
)

const Book = mongoose.model("book",bookSchema)

const authorSchema = new mongoose.Schema(
    {
        author_name:{type:String,required:true},
      
    },
    {
        versionKey: false,
        timestamps: true,
      }
)

const Author = mongoose.model("author",authorSchema)


const checkoutSchema = new mongoose.Schema(
  {
    book_id:
      {
        type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      required: true,
      }
    ,
    user_id:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    checked_in_at:{type:String,required:true},
    checked_out_at:{type:String,required:true},
  },
  {
    versionKey: false,
    timestamps: true,
  }

)


const Checkout = mongoose.model("checkout",checkoutSchema)









//authors CRUD---------
app.post("/author",async(req,res)=>{
    try{
    const author = await Author.create(req.body);
    return  res.status(201).send({author})  
    }catch(e){
        return res.status(500).json({message:e.message,statua:"Failed"})
    }
    
})

app.get("/author", async (req, res) => {
    try {
      const authors = await Author.find().lean().exec();
  
      return res.send({ authors});
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });

  //all books by an author
  app.get("/author/:id/books", async (req, res) => {
    try {
      const author = await Author.findById(req.params.id).lean().exec();
      const books = await Book.find({ author_ids: author._id })
        
        .lean()
        .exec();
  
      return res.status(200).send({ author,books });
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });




//books CRUD------
  app.get("/books", async (req, res) => {
    try {
      const books = await Book.find().lean().exec();
  
      return res.send({ books});
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });




app.post("/books",async(req,res)=>{
    try{
    const book = await Book.create(req.body);
    return  res.status(201).send({book})  
    }catch(e){
        return res.status(500).json({message:e.message,statua:"Failed"})
    }
    
})




  

app.post("/section",async(req,res)=>{
    try{
    const section = await Section.create(req.body);
    return  res.status(201).send({section})  
    }catch(e){
        return res.status(500).json({message:e.message,statua:"Failed"})
    }
    
})

//section CRUD---------
app.get("/section", async (req, res) => {
  try {
    const section = await Section.find().lean().exec();

    return res.send({section});
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

//books in a section
app.get("/section/:id/books", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).lean().exec();
    const books = await Book.find({ section_id: section._id })
      // .populate("book_id")
      .lean()
      .exec();

    return res.status(200).send({ section,books });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});


//books of one author inside a section
app.get("/section/:id/author/:id2", async (req, res) => {
  console.log(req.params)
  try {
    const section = await Section.findById(req.params.id).lean().exec();
    const books = await Book.find({ section_id: section._id,author_ids:req.params.id2  })

      // .populate("book_id")
      .lean()
      .exec();

    return res.status(200).send({ section,books });
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
  
});


//user CRUD-----------
app.post("/user",async(req,res)=>{
  try{
  const user = await User.create(req.body);
  return  res.status(201).send({user})  
  }catch(e){
      return res.status(500).json({message:e.message,statua:"Failed"})
  }
  
})

app.get("/user", async (req, res) => {
  try {
    const user = await User.find().lean().exec();

    return res.send({user});
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(200).send(user);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

//checkout CRUD---------

app.post("/checkout",async(req,res)=>{
  try{
  const checkout = await Checkout.create(req.body);
  return  res.status(201).send({checkout})  
  }catch(e){
      return res.status(500).json({message:e.message,statua:"Failed"})
  }
  
})

//books that are checked out
app.get("/checkout", async (req, res) => {
  try {
    const checkout = await Checkout.find().populate("book_id").populate("user_id").lean().exec();

    return res.send({checkout});
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});

app.delete("/checkout/:id", async (req, res) => {
  try {
    const checkout = await Checkout.findByIdAndDelete(req.params.id).lean().exec();

    return res.status(200).send(checkout);
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});


//books in a section that are not checked out
app.get("/section/:id/checkout", async (req, res) => {
  try {
    const section = await Section.find(req.param.id).lean().exec()
    const checkout = await Checkout.find().populate("book_id").populate("user_id").lean().exec();
 const books = await Book.find({_id:{$ne :checkout[0].book_id._id}})
    return res.send({checkout,books});
  } catch (e) {
    return res.status(500).json({ message: e.message, status: "Failed" });
  }
});



  app.listen(2343, async function () {
    await connect();
    console.log("listening on port 2343")
  });