const jwt = require('./common/jwt');
const auth = require('./v1/auth');
const app = require("./app");
const supertest = require("supertest");

describe("COMMON jwt", () => {
    it("should validate a self made token", async () => {
        // verify jwt internally
        const secret = 'calebwashere';
        const payload = {
            iss: 'WeU Token Authoriser',
            sub: 'Steve or something idk',
            iat: 1234567890,
            jti: 1,
        };
        const tok = jwt.createJWT(payload, secret);
        expect(jwt.verifyJWT(tok, secret)).toBe(true);
        expect(jwt.extractPayload(tok)).toStrictEqual(payload);
    });
});


describe("api/v1/test", () => {
    it("should return a response", async () => {
        const response = await supertest(app).get("/api/v1/test");
        expect(response.status).toBe(200);
        expect(response.text).toBe("{\"response\":true}");
    });
});

describe("api/v1/register CUSTOMER", () => {
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

describe("api/v1/register SERVICE PROFESSIONAL", () => {
    it("should respond with 200", async () => {
        const response = await supertest(app)
            .post("/api/v1/user/register")
            .type('multipart/form-data')
            .field('email', 'professional@example.com')
            .field('firstName', 'Steve')
            .field('lastName', 'Example')
            .field('address', '1 example street Wollongong 2500')
            .field('phoneNumber', '0412 123 456')
            .field('license', '1234567890')
            .field('password', '1234')
            .field('type', 'PROFESSIONAL')
            .field('locationLat', '-35')
            .field('locationLong', '100');
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
        // get returned claim from the cookie
        const claim = response.headers['set-cookie'][0].split('; ')[0].split('=')[1];
        expect(response.status).toBe(200);
        // fix when i get home
        //expect(auth.verifyClaim(claim)).toBe();
    });
});