module.exports = {
    post: {
        description: "User Login",
        operationId: "userLogin",
        requestBody: {
            description: "Details of the user trying to login",
            required: "true",
            content: {
                "application/json": {
                    schema: {
                        forceNumber: {
                            type: "string",
                            description: "Force number of the user",
                            example: "111UA00000"
                        },
                        password: {
                            type: "string",
                            description: "Password of the user",
                            example: "abc123"
                        }
                    }
                }
            }
        }
    },
    responses: {
        200: {
            description: "Login was successful",
            content: {
                "application/json": {
                    schema: {
                        message: {
                            type: "string",
                            description: "Successful login message",
                            example: "Login Successful!!"
                        },
                        forceNumber: {
                            type: "string",
                            description: "Force number of the user",
                            example: "111UA00000"
                        },
                        TOKEN: {
                            type: "JWT",
                            description: "JSON Web Token for the user"
                        }
                    }
                }
            }
        },
        400: {
            description: "Login was unsuccessful",
            content: {
                "application/json": {
                    schema: {
                        message: {
                            type: "string",
                            description: "Login unsuccessful message",
                            example: "User does not exist"
                        }
                    }
                }
            }
        }
    }
};