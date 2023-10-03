export default class usersDTO {
    constructor(users) {
        this.users = users.map(user => ({
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            role: user.role,
            _id: user._id
        }));
    }
}