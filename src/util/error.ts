export class Error {
    message: string
    status: number

    constructor(message: string, status: number) {
        this.message = message
        this.status = status
    }
}
