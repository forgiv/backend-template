import bcrypt from 'bcryptjs'
import { Entity, PrimaryKey, SerializedPrimaryKey, Property } from 'mikro-orm'
import { ObjectID } from 'mongodb'

@Entity()
export class User {

    @PrimaryKey()
    _id: ObjectID

    @SerializedPrimaryKey()
    id: string

    @Property()
    username: string

    @Property()
    password: string

    constructor(username: string, password: string) {
        this.username = username
        this.password = User.hashPassword(password)
    }

    static hashPassword(password: string) {
        return bcrypt.hashSync(password, 10)
    }

    validatePassword(password: string) {
        return bcrypt.compare(password, this.password)
    }
}
