import cors from "cors";
import express from "express";
import multer from 'multer';
import { ConnectDatabase } from "./config/database";
import Environment from "./constant/environment";
import { InitRoute } from "./modules/route";

const upload = multer();

const setup = async () => {
  const app = express();
  app.use(upload.any())
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  await ConnectDatabase();
  await InitRoute(app);

  app.listen(Environment.AppPort, () => {
    console.log("Api gateway is listen on port: ", Environment.AppPort);
  });
};

setup();
