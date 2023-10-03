


async function updateUserRole(userId) {

        let role = document.getElementById('role').value
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: role }),
        }
        return await fetch(`http://localhost:4040/api/users/premium/${userId}`, options)

}


async function restorePassword(token) {

        let newPass = document.getElementById('newPass').value
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token, password: newPass }),
        }
        return await fetch(`http://localhost:4040/api/users/restorePass`, options)

}