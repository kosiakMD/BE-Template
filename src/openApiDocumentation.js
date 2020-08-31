module.exports = {
    openapi: '3.0.1',
    info: {
        version: '1.3.0',
        title: 'DEEL',
        description: 'DEEL API',
    },
    servers: [
        {
            url: 'http://localhost:3001/',
            description: 'Local server'
        }
    ],
    tags: [{
        "name": "Api",
        "description": "DEEL BACKEND TASK",
    }],
    paths: {
        "/contracts/{id}": {
            get: {
                tags: ["Api"],
                summary: "",
                description: "This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!",
                operationId: "signin",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "header",
                    name: "profile_id",
                    required: true,
                    type: "string",
                }, {
                    in: "path",
                    name: "id",
                    required: true,
                    type: "string"
                }],
                responses: {}
            }
        },
        "/contracts": {
            get: {
                tags: ["Api"],
                summary: "",
                description: "Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.",
                operationId: "signup",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "header",
                    name: "profile_id",
                    required: true,
                    type: "string",
                }],
                responses: {}
            }
        },
        "/jobs/unpaid": {
            get: {
                tags: ["Api"],
                summary: "",
                description: "Get all unpaid jobs for a user (either a client or contractor), for active contracts only.",
                operationId: "resend",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "header",
                    name: "profile_id",
                    required: true,
                    type: "string",
                }],
                responses: {
                }
            }
        },
        "/jobs/{job_id}/pay": {
            post: {
                tags: ["Api"],
                summary: "",
                description: "",
                operationId: "confirm/token",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "header",
                    name: "profile_id",
                    required: true,
                    type: "string",
                }, {
                    in: "path",
                    name: "job_id",
                    required: true,
                    type: "string"
                }],
                responses: {
                },
            }
        },
        "/balances/deposit/{userId}": {
            post: {
                tags: ["Api"],
                summary: "",
                description: "",
                operationId: "forgot",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "path",
                    name: "userId",
                    required: true,
                    type: "string"
                }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/definitions/balances'
                            }
                        }
                    },
                    required: true
                },
                responses: {
                },
            }
        },
        "/admin/best-profession": {
            get: {
                tags: ["Api"],
                summary: "",
                description: "",
                operationId: "reset",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "query",
                    name: "start",
                    required: true,
                    type: "string"
                }, {
                    in: "query",
                    name: "end",
                    required: true,
                    type: "string"
                }],
                responses: {
                },
            }
        },
        "/admin/best-clients": {
            get: {
                tags: ["Api"],
                summary: "",
                description: "",
                operationId: "reset/token",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [{
                    in: "query",
                    name: "start",
                    required: true,
                    type: "string"
                }, {
                    in: "query",
                    name: "end",
                    required: true,
                    type: "string"
                }, {
                    in: "query",
                    name: "limit",
                    required: true,
                    type: "integer",
                    format: "int64"
                }],
                responses: {
                },
            }
        }
    },

    definitions: {
        balances: {
            type: "object",
            properties: {
                amount: {
                    type: "integer",
                    format: "int64"
                },
            }
        },
    },
};