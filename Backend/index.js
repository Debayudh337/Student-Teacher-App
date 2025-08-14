import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authRouter } from './Routes/authRoutes.js'; 

dotenv.config();
const allowedOrigins=['http://localhost:5173']
const app = express();

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter); // register your routes




app.get('/',(req,res)=>{
  res.send("API running")
})
app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
