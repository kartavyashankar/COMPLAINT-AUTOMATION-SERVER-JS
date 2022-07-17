const request = require("supertest");
const server = require("../../main/js/server");

describe("Healthcheck", () => {
    it("Checks whether service is up and running", (done) =>{
        request(server).get("/healthcheck")
            .expect(200)
            .expect(/UP/, done);
    });
});

describe("Swagger Redirect", () => {
    it("Redirects to Sweagger Docs", (done) => {
        request(server).get("/")
            .expect(302)
            .expect('Location', /\/api-docs/, () => {
                request(server).get("/api-docs")
                    .expect(301, done);
            });
    });
});
