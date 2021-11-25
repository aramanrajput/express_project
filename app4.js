const express = require("express")
const mongoose = require("mongoose")

let data = require("./movieDataMongo.json")

const app = express();

app.use(express.json());


const connect = () => {
    return mongoose.connect("mongodb://localhost:27017/entertainment");
  };



const movieSchema = new mongoose.Schema(
    {
    id:{type: Number,required:true},
    movie_name:{type:String,required:true},
    movie_genre:{type:String,required:true},
    production_year:{type:Number,required:true},
    budget:{type:Number,required:true},
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );



  const Movie = mongoose.model("movie", movieSchema); // movies

// see all movies
  app.get("/movies", async (req, res) => {
    try {
      const movies = await Movie.find().lean().exec();
  
      return res.send({ movies });
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });
  
// add a movie
  app.post("/movies", async (req, res) => {
    try {
      const movie = await Movie.create(req.body);
  
      return res.status(201).send(movie);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });


//   get a single movie
  app.get("/movies/:id", async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id).lean().exec();
  
      return res.send(movie);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });

// update a movie
  app.patch("/movies/:id", async (req, res) => {
    try {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      })
        .lean()
        .exec();
  
      return res.status(201).send(movie);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });


//   delete a movie
  app.delete("/movies/:id", async (req, res) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id).lean().exec();
  
      return res.status(200).send(movie);
    } catch (e) {
      return res.status(500).json({ message: e.message, status: "Failed" });
    }
  });

app.listen(2340, async function () {
    await connect();
    console.log("listening on port 2340");
  });