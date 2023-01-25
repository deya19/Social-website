import express from "express";
import authRoutes from "./routes/auth.route.js";
import commentRoutes from "./routes/comments.route.js";
import likeRoutes from "./routes/likes.route.js";
import postRoutes from "./routes/post.route.js";
import userRoutes from "./routes/users.route.js";
import relatioshipRoutes from "./routes/relationships.route.js";
import storyRoutes from "./routes/stories.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import hpp from "hpp";
import helmet from "helmet";
import compression from "compression";
import rateLimit from 'express-rate-limit';


//express app
const app = express();

// setting various HTTP headers
app.use(helmet());

// enable domain "http://localhost:3000" to access your application
app.use(cors({
  origin:"http://localhost:3000",
  credentials: true,
}));

//compress all response
app.use(compression());

//Middleware
app.use(bodyParser.json({limit:"20kb"}));


// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: 'Too many requests from this IP, please try again later',
});

// Apply the rate limiting middleware to all requests
app.use('/api', limiter);



// Middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp());



//It allows you to read, parse, and set cookies in a Node.js application.
app.use(cookieParser());



const storage = multer.diskStorage({
  //path to storage pic in client file
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload') // the place where we add the folder
  },

  // the name that used to storage inside upload file
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname) // to transform the name to uniquename when upload the same name use date
  }
})

//To storage the pic inside public file (upload) in client side
const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"),(req,res) => {
  const file = req.file;
  res.status(200).json(file.filename);
 })



app.use("/api/auth" , authRoutes)
app.use("/api/comments" , commentRoutes)
app.use("/api/likes" , likeRoutes)
app.use("/api/posts" , postRoutes)
app.use("/api/relationships" , relatioshipRoutes)
// app.use("/api/stories" , storyRoutes)
app.use("/api/users" , userRoutes)




app.listen(process.env.SERVER_PORT,() => {
  console.log(`Server Start .......... `);
});

export default app;

