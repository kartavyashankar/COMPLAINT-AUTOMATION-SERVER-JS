const postRegister = require("./postRegister");
const postLogin = require("./postLogin");

module.exports = {
    paths: {
        "/register": {
            ...postRegister
        },
        "/login": {
            ...postLogin
        }
    }
};