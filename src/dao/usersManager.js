import { ManagerMongoose } from "./ManagerMongoose.js"

export const usersManager = new ManagerMongoose("user", {
        username: {type: String ,required: true, index: true},
        password: {type: String ,required: true}, 
})

