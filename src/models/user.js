const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: [true, 'missing username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'missing password']
    }
})

userSchema.set('toObject', {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
    }
})

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
    }
})

userSchema.statics.hashPassword = password => {
    return bcrypt.hash(password, 10)
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)