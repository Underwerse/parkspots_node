'use strict';
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const authRouter = require('./routes/authRouter');
const parkspotsRouter = require('./routes/parkspotsRouter');
const imagesRouter = require('./routes/imagesRouter');

const app = express();

app.enable('trust proxy');

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use('/thumbnails', express.static('thumbnails'));

app.use('/auth', authRouter);
app.use('/parkspots', parkspotsRouter);
app.use('/images', imagesRouter);

const start = () => {
  try {
    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else {
        const proxypath = process.env.PROXY_PASS || '';
        res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
      }
    });

    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
