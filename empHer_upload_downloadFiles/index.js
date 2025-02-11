const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const ObjectsToCsv = require("objects-to-csv");
const PDFDocument = require("pdfkit");
require("dotenv").config();
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/empherpostCommentApp");

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
});
const User = mongoose.model("User", userSchema);

// Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isPublic: { type: Boolean, default: false },
});
const Post = mongoose.model("Post", postSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  text: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});
const Comment = mongoose.model("Comment", commentSchema);

const fileSchema = new mongoose.Schema({
    filename: String,
    filetype: String,
    data: Buffer, // Store file as binary
    createdAt: { type: Date, default: Date.now }
  });
  const ReportFile = mongoose.model("ReportFile", fileSchema);

// Middleware to verify JWT token
const authenticate = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
 // console.log(token)
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, 'shhhh');
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

// Register User
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.send("User registered");
});

// Login User
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("User not found");

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ _id: user._id, role: user.role }, 'shhhh');
  res.json({ token });
});

// Create Post
app.post("/posts", authenticate, async (req, res) => {
  const { title, content, isPublic } = req.body;
  const post = new Post({ title, content, author: req.user._id, isPublic });
  await post.save();
  res.json(post);
});

// Get All Posts (Public and User's Own Posts)
app.get("/posts", authenticate, async (req, res) => {
  const posts = await Post.find({ $or: [{ isPublic: true }, { author: req.user._id }] }).populate("author", "username");
  res.json(posts);
});

// Comment on a Post
app.post("/comments", authenticate, async (req, res) => {
  const { postId, text } = req.body;
  const comment = new Comment({ text, author: req.user._id, post: postId });
  await comment.save();
  res.json(comment);
});

// // Generate Admin Report (CSV Download)
// app.get("/admin/report", authenticate, async (req, res) => {
//   if (req.user.role !== "admin") return res.status(403).send("Access Denied");

//   const posts = await Post.find();
//   const comments = await Comment.find();

//   const reportData = [
//     { metric: "Total Posts", count: posts.length },
//     { metric: "Total Comments", count: comments.length },
//   ];

//   const csv = new ObjectsToCsv(reportData);
//   const filePath = "./reports/admin_report.csv";
//   await csv.toDisk(filePath);

//   res.download(filePath, "admin_report.csv", () => {
//     // fs.unlinkSync(filePath);
//   });
// });
// Generate Admin Report (CSV or PDF Download)
app.get("/admin/report", async (req, res) => {
    //if (req.user.role !== "admin") return res.status(403).send("Access Denied");
  
    const posts = await Post.find();
    const comments = await Comment.find();
    
  
    const reportData = [
      { metric: "Total Posts", count: posts.length },
      { metric: "Total Comments", count: comments.length },
    ];
  
    const fileType = req.query.filetype || "csv";
    const filePath = `./reports/admin_report.${fileType}`;
  
    if (fileType === "csv") {
      const csv = new ObjectsToCsv(reportData);
      await csv.toDisk(filePath);
      res.download(filePath, "admin_report.csv", () => fs.unlinkSync(filePath));
    } else if (fileType === "pdf") {
        // const doc = new PDFDocument();
        // const writeStream = fs.createWriteStream(filePath);
        
        // doc.pipe(writeStream);
        // doc.fontSize(18).text("Admin Report", { align: "center" });
        // doc.moveDown();
        // doc.fontSize(14).text(`Total Posts: ${posts.length}`);
        // doc.fontSize(14).text(`Total Comments: ${comments.length}`);
        // doc.end();
      
        // writeStream.on("finish", () => {
        //   res.download(filePath, "admin_report.pdf", () => fs.unlinkSync(filePath));
        // });
        ////////
        const htmlTemplate = fs.readFileSync("reportTemplate.html", "utf8");
        const finalHtml = htmlTemplate
        .replace("{{totalPosts}}", posts.length)
        .replace("{{totalComments}}", comments.length);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(finalHtml);
        await page.pdf({ path: filePath, format: "A4" });
        await browser.close();

        res.download(filePath, "admin_report.pdf", async () => 
         {   
            // res.send("File Downloaded")
            const fileData = fs.readFileSync(filePath);
      const report = new ReportFile({
        filename: "admin_report.pdf",
        filetype: "pdf",
        data: fileData
      });
      await report.save();
            fs.unlinkSync(filePath)})
         res.send("File sent")
        } else {
      res.status(400).send("Invalid file type");
    }
  });
  //// 
  app.get("/admin/getreport/:reportId", async (req, res) => {
   // if (req.user.role !== "admin") return res.status(403).send("Access Denied");
  
    try {
      const report = await ReportFile.findById(req.params.reportId);
      if (!report) return res.status(404).send("Report not found");
  
      res.set({
        "Content-Type": report.filetype === "csv" ? "text/csv" : "application/pdf",
        "Content-Disposition": `attachment; filename="${report.filename}"`,
      });
  
      res.send(report.data);
    } catch (err) {
      res.status(500).send("Error retrieving the report");
    }
  });
// Generate Sharable Link for a Post
app.get("/posts/:postId/share", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) return res.status(404).send("Post not found");

  if (!post.isPublic) return res.status(403).send("This post is private");

  res.json({ shareableLink: `http://localhost:3000/posts/${post._id}` });
});

// Start Server
app.listen(8080, () => {
  console.log("Server running on http://localhost:3000");
});
