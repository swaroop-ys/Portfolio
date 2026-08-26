require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  technologies: { type: [String], default: [] },
  image: String,
  githubUrl: String,
  liveUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model("Project", projectSchema);
const Contact = mongoose.model("Contact", contactSchema);

app.get("/api/health", (req,res) => res.json({status:"online", service:"SWAROOP.DEV API"}));

app.get("/api/projects", async (req,res) => {
  try {
    const projects = await Project.find().sort({createdAt:-1});
    res.json(projects);
  } catch (err) {
    res.status(500).json({message:"Could not load projects"});
  }
});

app.get("/api/projects/:id", async (req,res) => {
  try {
    const project = await Project.findById(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    res.json(project);
  } catch(err) {
    res.status(400).json({message:"Invalid project id"});
  }
});

app.post("/api/projects", async (req,res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch(err) {
    res.status(400).json({message:"Invalid project data", error:err.message});
  }
});

app.put("/api/projects/:id", async (req,res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
    if(!project) return res.status(404).json({message:"Project not found"});
    res.json(project);
  } catch(err) {
    res.status(400).json({message:"Could not update project"});
  }
});

app.delete("/api/projects/:id", async (req,res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if(!project) return res.status(404).json({message:"Project not found"});
    res.json({message:"Project deleted"});
  } catch(err) {
    res.status(400).json({message:"Could not delete project"});
  }
});

app.post("/api/contact", async (req,res) => {
  try {
    const {name,email,message} = req.body;
    if(!name || !email || !message) return res.status(400).json({message:"All fields are required"});
    const contact = await Contact.create({name,email,message});
    res.status(201).json({message:"Message received", id:contact._id});
  } catch(err) {
    res.status(400).json({message:"Could not save message"});
  }
});

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend")));
  app.get("*", (req,res) => res.sendFile(path.join(__dirname, "../frontend/index.html")));
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("MongoDB connected");
    const count = await Project.countDocuments();
    if(count === 0){
      await Project.insertMany([
        {title:"Cyber Vegetable Calculator",description:"Quantity and price calculator for kg and gram inputs.",technologies:["HTML","CSS","JavaScript"],githubUrl:"#",liveUrl:"#"},
        {title:"Anime Character Quiz",description:"Cyberpunk quiz interface with scoring and interactive character questions.",technologies:["JavaScript","CSS","DOM"],githubUrl:"#",liveUrl:"#"},
        {title:"2D Retro Adventure",description:"Browser retro-platformer concept built with original assets and game logic.",technologies:["HTML5","Canvas","JavaScript"],githubUrl:"#",liveUrl:"#"}
      ]);
      console.log("Seed projects created");
    }
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
