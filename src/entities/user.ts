import bcrypt from 'bcryptjs'
import { Entity, PrimaryKey, SerializedPrimaryKey, Property, Unique } from 'mikro-orm'
import { ObjectID } from 'mongodb'

@Entity({ tableName: 'users' })
export class User {

    @PrimaryKey()
    _id!: ObjectID

    @SerializedPrimaryKey()
    id!: string

    @Property()
    @Unique()
    username!: string

    @Property({ hidden: true })
    password!: string

    @Property()
    createdAt = new Date()

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date()

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
