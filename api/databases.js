const mongoose = require("mongoose")

const Schema = mongoose.Schema

const ObjectId = Schema.ObjectId

const User = new Schema({
    email: {type: String , unique: true},
    name: String,
    password: String,
})

const Tasks = new Schema({
    userId: ObjectId,
    tasks: String,
    done: Boolean
})

const UserModel = mongoose.model("user",User)
const TaskModel = mongoose.model("tasks",Tasks)

module.exports = {
    UserModel,
    TaskModel
}