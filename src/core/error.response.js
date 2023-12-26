'use strict';

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    OK: 200,
    CREATED: 201,
}
const ReasonStatusCode = {
    FORBIDDEN: "Bad Request Error",
    CONFLICT: "Conflict Error",
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;

    }

}
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }

}
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }

}

module.exports = {
    ConflictRequestError,
    BadRequestError
}