import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';    

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) // form bhara to data liya
app.use(express.urlencoded({extended: true})) // urls se data liya
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRouter from './routes/user.routes.js';
// mount user router
app.use('/api/v1/users', userRouter);


export default app;