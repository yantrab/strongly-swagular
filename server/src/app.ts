import { ServerFactory } from "strongly";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
import fastifyCors from "fastify-cors";
import { MongoClient } from "mongodb";
import { ConfigService } from "./services/config/config.service";
import { MongoMemoryServer } from "mongodb-memory-server";
const config = new ConfigService().config;
const start = async () => {
  const url = config.mongoUrl || (await new MongoMemoryServer().getUri());
  const mongo = await new MongoClient(url);
  await mongo.connect();
  ServerFactory.create({
    providers: [{ provide: MongoClient, useValue: mongo }],
    logger: true
  }).then(app => {
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
  });
};
start();
