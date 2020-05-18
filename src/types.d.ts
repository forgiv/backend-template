export {}

// This is for accessing the user that gets injected into request by passport
// Update this interface to match whatever public properties your user entity has
declare global {
    namespace Express {
        interface User {
            id: string,
            username: string,
            createdAt: Date,
            updatedAt: Date,
        }
    }
}