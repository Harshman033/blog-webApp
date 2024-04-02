import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

const password = "MyMoneyDontJiggle"

app.get("/", (req, res) => {
  res.render("index.ejs", { posts: posts });
});

app.get("/create", (req, res) => {
  res.render("authenticate.ejs");
});



app.post("/submit-password", (req, res) => {
  let passwordEntered = req.body["password"];

 if( passwordEntered == password){
   res.render("create.ejs");
 }else{
  res.render("authenticate2.ejs");
 }
});

let posts=[];
let currentId = 1;

app.post("/createPost", (req, res) => {

const post = {
  id: currentId++,
  title: req.body.heading,
  author : req.body.name,
  content: req.body.content
};
posts.push(post);
res.redirect('/');
});

app.get("/posts/:id", (req, res) => {
  const requestedPostId = Number(req.params.id);
  const foundPost = posts.find(post => post.id === requestedPostId);

  if (foundPost) {
      res.render("posts.ejs", { post: foundPost });
  } else {
      res.send("Not Found");
  }
});

app.get("/authenticateDelete", (req, res) => {
  const postId = req.query.id; // Extract the ID from the query string
  if (!postId) {
    return res.send("Post ID is required.");
  }
  // Pass postId to the EJS template
  res.render("authenticateDelete.ejs", { postId: postId });
});


app.post("/delete", (req, res) => {
  const postId = Number(req.body.id); // Convert the ID from the form to a number
  console.log(req.body); // For debugging
  console.log(postId); // For debugging

  let passwordEntered = req.body["password"];
  if (passwordEntered === password) { // Check if the entered password matches the expected password
    const postIndex = posts.findIndex(post => post.id === postId); // Find the index of the post to be deleted
    if (postIndex !== -1) { // Check if the post was found
      posts.splice(postIndex, 1); // Delete the post from the array
      res.redirect('/'); // Redirect to the home page or list of posts
    } else {
      res.send("Post not found."); // Send a message if the post was not found
    }
  } else {
    res.render("authenticateDelete2.ejs"); // Render a different template if the password is incorrect
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});