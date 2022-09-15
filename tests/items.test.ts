import { prisma } from "../src/database";
import app from "../src/app";
import supertest from "supertest";

import * as itemFactory from "./itemFactory";
import { items } from "@prisma/client";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE items RESTART IDENTITY`;
});

describe("Testa POST /items ", () => {
    it("Deve retornar 201, se cadastrado um item no formato correto", async () => {
        const item = itemFactory.item();

        const promisse = await supertest(app).post("/items").send(item);
        const createdItem = await prisma.items.findFirst({
            where: {
                title: item.title,
            },
        });

        expect(promisse.status).toBe(201);
        expect(createdItem).not.toBeNull;
    });

    it("Deve retornar 409, ao tentar cadastrar um item que exista", async () => {
        const item = itemFactory.item();

        await supertest(app).post("/items").send(item);
        const promisse = await supertest(app).post("/items").send(item);

        expect(promisse.status).toBe(409);
    });
});

describe("Testa GET /items ", () => {
    it("Deve retornar status 200 e o body no formato de Array", async () => {
        const response = await supertest(app).get("/items").send();

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});

describe("Testa GET /items/:id ", () => {
    it("Deve retornar status 200 e um objeto igual a o item cadastrado", async () => {
        const { title, url, description, amount } = itemFactory.item();
        const itemCreate = await prisma.items.create({
            data: {
                title,
                url,
                description,
                amount,
            },
        });
        const response = await supertest(app)
            .get(`/items/${itemCreate.id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body).toEqual(itemCreate);
    });

    it("Deve retornar status 404 caso não exista um item com esse id", async () => {
        const response = await supertest(app).get(`/items/1`).send();

        expect(response.status).toBe(404);
    });
});
