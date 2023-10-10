


async function updateUserRole(userId) {

        let role = document.getElementById('role').value
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role: role }),
        }
        const response = await fetch(`/api/users/premium/${userId}`, options)
        if (response.status === 200){
            Toastify({
                text: "Rol Cambiado",
                className: "info",
                style: {
                    background: "#3498db",
                }
            }).showToast();
        }

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
        const response = await fetch(`/api/users/restorePass`, options)
        if(response.status === 200){
            window.location.href = `/login`
        } else if(response.status === 400){
            const errorMsg = document.getElementById("errorPass")
            errorMsg.innerHTML = "no puedes introducir la misma contraseña!"
        }

}