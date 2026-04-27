import request from "supertest";
import app from "../../app"

describe("Rotas de Favoritos", ()=> {
    test("GET /favorites - Deve barrar acesso sem token (401)", async () => {
      const response = await request(app).get('/favorites')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe("Token não fornecido ou malformatado.")
    })
    
})