import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import passport from 'passport';

import * as path from 'path';

import { configurePassport } from './passport/configurePassport';
import { configureRoutes } from './routes/routes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:6000/my_db';

mongoose.connect(dbUrl)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const whitelist = ['http://localhost:4200'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
  secret: 'testsecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureRoutes(passport, express.Router()));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
