import { ServerFactory } from "strongly";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import { MongoClient } from "mongodb";
import { ConfigService } from "./services/config/config.service";
import { MongoMemoryServer } from "mongodb-memory-server";
import { LoggerService } from "./services/loggerService";
import { DbService } from "./services/db/db.service";
import { WebSocketService } from "./services/sokcet/socket.service";
const config = new ConfigService().config;
export const app = async (path?) => {
  const url = config.mongoUrl || (await MongoMemoryServer.create()).getUri();
  const mongo = await new MongoClient(url, { ignoreUndefined: true });
  console.log(mongo);
  await mongo.connect();
  const dbService = new DbService(mongo);
  const webSocketService = new WebSocketService();
  const logService = new LoggerService(dbService, webSocketService);
  const app = await ServerFactory.create({
    controllers: path,
    providers: [
      { provide: DbService, useValue: dbService },
      { provide: WebSocketService, useValue: webSocketService },
      { provide: LoggerService, useValue: logService }
    ],
    logger: { stream: logService }
  });

  app.register(fastifyJwt, config.jwt);
  app.register(fastifyCookie);
  app.register(fastifyCors, config.corsOptions);
  app.addHook("onRequest", async (request, reply) => {
    try {
      await request.jwtVerify();
      reply.setCookie("token", request.cookies.token, {
        path: "/",
        secure: false,
        httpOnly: true,
        sameSite: false,
        maxAge: 3600
      });
    } catch (err) {}
  });

  app.listen(3000, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
  });
  return app;
};
