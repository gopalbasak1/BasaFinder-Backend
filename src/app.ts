import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

//parsers/middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['https://bike-stores.vercel.app', 'http://localhost:5173'],
    credentials: true,
  }),
);

//router connector
app.use('/api', router);

//server live
app.get('/', (req: Request, res: Response) => {
  res.send({
    status: true,
    message: 'Server on live 🏃🏾‍♀️‍➡️',
  });
});

//Error Handler
app.use(globalErrorHandler);
//Not Found
app.use(notFound);

export default app;
