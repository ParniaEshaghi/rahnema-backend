export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

export class NotFoundError extends HttpError {
    constructor() {
        super(404, 'Not Found');
    }
}
