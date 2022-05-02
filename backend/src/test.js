const app = require("./app");
const supertest = require("supertest");

describe("api/v1/test", () => {
    it("should return a response", async () => {
        const response = await supertest(app).get("/api/v1/test");
        expect(response.status).toBe(200);
        expect(response.text).toBe("{\"jwtverify\":true}");
    });
});

describe("api/v1/register", () => {
    it("should respond with 200", async () => {
        const response = await supertest(app)
            .post("/api/v1/user/register")
            .type('multipart/form-data')
            .field('email', 'customer@example.com')
            .field('firstName', 'Steve')
            .field('lastName', 'Example')
            .field('address', '1 example street Wollongong 2500')
            .field('phoneNumber', '0412 123 456')
            .field('license', '1234567890')
            .field('password', '1234')
            .field('type', 'CUSTOMER');
        expect(response.status).toBe(200);
    });
});

describe("api/v1/user/login", () => {
    it("should give a valid login token", async () => {
        const response = await supertest(app)
            .post("/api/v1/user/login")
            .type('multipart/form-data')
            .field('email', 'customer@example.com')
            .field('password', '1234');
        expect(response.status).toBe(200);
    });
});