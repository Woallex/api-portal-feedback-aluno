import request from "supertest";
import app from "../../app";

describe("Rotas de Publicação", () => {
  test("GET /publications - Deve listar publicações e retornar status 200", async () => {
    const response = await request(app).get("/publications");

    if (response.status === 403) {
      expect(response.body.message).toBe(
        "Acesso permitido apenas em dias úteis.",
      );
    } else {
      expect(response.status).toBe(200);
    }
  });
});
