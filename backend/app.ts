import express from 'express';
import initServer from './utills/initServer';
import prepareServer from './utills/prepareServer';

const app = express();

const server = prepareServer(app);

initServer(server);
