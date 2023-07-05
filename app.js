//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to ThoughtCanvas, a virtual haven for aspiring writers and passionate bloggers. Unleash your creativity and express your unique voice on our platform. Seamlessly compose and publish your captivating blog posts, sharing your insights, stories, and expertise with the world. Join our community of wordsmiths and let your thoughts paint a masterpiece on this digital canvas of ideas.";
const aboutContent = "Welcome to ThoughtCanvas, a dynamic platform designed to empower individuals to share their voices and ideas with the world. Whether you're a seasoned writer or a novice storyteller, this is your space to unleash your creativity and craft compelling blog posts.Whether you want to share your knowledge, inspire others, or ignite meaningful discussions, ThoughtCanvas provides the canvas for your thoughts to flourish. Start your blogging journey today and let your creativity soar on ThoughtCanvas.";

const contactContent = "We would love to hear from you at ThoughtCanvas! If you have any questions, suggestions, or simply want to connect, feel free to reach out. Our team is dedicated to providing you with the best blogging experience.You can email us at sinumang20@gmail.com or call us at our customer executive number:9065698814";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res){

  Post.find({}).then((posts)=>{
      res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});
let posts=[];
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  Post.insertMany(post);
  posts.push(post);
  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.find({_id: requestedPostId}).then((post)=>{
    res.render("post",{
      title:post.title,
      content:post.content
    });
  });

});

app.listen(4000, function() {
  console.log("Server started on port 4000");
});
