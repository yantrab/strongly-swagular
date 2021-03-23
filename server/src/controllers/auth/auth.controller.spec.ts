import { suite, test } from "@testdeck/jest";
import "reflect-metadata";
import { ServerFactory, mock } from "strongly";
import { AuthController } from "./auth.controller";
import { FastifyInstance } from "fastify";
import fastifyJwt from "fastify-jwt";
import fastifyCookie from "fastify-cookie";
import { UserService } from "../../services/user/user.service";
import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

@suite
class LoginTests {
  app: FastifyInstance;

  async before() {
    const url = await new MongoMemoryServer().getUri();
    const mongo = await new MongoClient(url);
    await mongo.connect();
    this.app = await ServerFactory.create({ controllers: [AuthController], providers: [{ provide: MongoClient, useValue: mongo }] });
    this.app.register(fastifyJwt, {
      secret: "supersecret",
      cookie: {
        cookieName: "token"
      }
    });
    this.app.register(fastifyCookie);
    this.app.addHook("onRequest", async request => {
      try {
        // just add user to the request
        await request.jwtVerify();
      } catch (err) {}
    });
  }

  @test("should add token to cookies")
  @mock(UserService, "validateAndGetUser", { fName: "lo", lName: "asbaba" })
  async login() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect((res.cookies[0] as any).name).toBe("token");
    expect(res.json()).toStrictEqual({ fName: "lo", lName: "asbaba" });
    return res.cookies;
  }

  @test("wrong user or password")
  @mock(UserService, "validateAndGetUser", undefined)
  async invalidLogin() {
    const res = await this.app.inject({ method: "POST", url: "/auth/login", body: { email: "a@b.c", password: "password" } } as any);
    expect(res.statusCode).toBe(401);
  }

  @test("should return 401 ")
  async getUserAuthenticated1() {
    const res = await this.app.inject({ method: "GET", url: "/auth/get-user-authenticated" });
    expect(res.statusCode).toBe(401);
  }

  @mock(UserService, "validateAndGetUser", { fName: "saba", lName: "baba" })
  @test("should return the user")
  async getUserAuthenticated2() {
    const cookies: any = await this.login();
    const res = await this.app.inject({
      method: "GET",
      url: "/auth/get-user-authenticated",
      cookies: { token: cookies[0].value } as any
    });
    expect(res.json()).toStrictEqual({ fName: "saba", lName: "baba" });
  }

  @test
  async setPassword() {
    const res = await this.app.inject({
      method: "POST",
      url: "/auth/set-password",
      body: { email: "a@b.c", password: "password", rePassword: "password" },
      headers: { token: "zjdnzltrzyab500git0zrwff0wuah0vvckey3c9jw9" }
    } as any);
    expect(res.statusCode).toStrictEqual(200);
  }
}
