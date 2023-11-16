import express from "express";
import Environment from "./constant/environment";
import { ConnectDatabase } from "./config/database";
import { InitRoute } from "./modules/route";
import cors from "cors";

const setup = async () => {
  const app = express();
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
