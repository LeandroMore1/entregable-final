export default class userDTO{
    constructor(user){
        this.name = user.name
        this.lastName = user.lastName
        this.email = user.email
        this.age = user.age
        this.img = user.img
        this.role = user.role
        this.cart = user.cart
    }
}