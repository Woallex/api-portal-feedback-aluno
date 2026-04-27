import request from "supertest";
import app from "../../app";
import prisma from "../../libs/prisma";

describe("Testes de Autenticação (Login e Register)", () => {
  
  afterAll(async () => {
    try {
      await prisma.user.deleteMany({
        where: {
          login: {
            startsWith: "teste_",
          },
        },
      });
      await prisma.$disconnect();
    } catch (error) {
      console.error("Erro ao limpar dados de teste:", error);
      await prisma.$disconnect();
    }
  });

  test("POST /auth/register - Deve registrar um novo usuário com sucesso", async () => {
    const anyEmail = `teste_${Date.now()}@ifce.edu.br`;
    
    const response = await request(app)
      .post("/auth/register")
      .send({
        login: anyEmail,
        password: "123",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Usuário registrado.");
    expect(response.body.data).toHaveProperty("id");
  });

  test("POST /auth/register - Deve impedir o registro de um login já existente", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        login: "woallex@ifce.edu.br",
        password: "alex1390alex",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Usuário já existe");
  });

  test("POST /auth/login - Deve retornar status 200 e o token ao logar", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        login: "woallex@ifce.edu.br",
        password: "alex1390alex",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login realizado com sucesso");
    expect(response.body.data).toHaveProperty("token");
  });

  test("POST /auth/login - Deve retornar 401 para credenciais incorretas", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        login: "teste_inexistente@ifce.edu.br",
        password: "senha_errada",
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Credenciais inválidas");
  });
});