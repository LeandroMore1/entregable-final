// SECTION - eliminar users inactivos

async function deleteInactive() {

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  return await fetch(`http://localhost:4040/api/users/deleteInactive`, options)

}

// SECTION - actualizar el rol del usuario seleccionado

async function updateUserRoleAdmin(userId) {

  let role = document.getElementById('changeRoleAdmin').value
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: role }),
  }
  return await fetch(`http://localhost:4040/api/users/premium/${userId}`, options)

}

// SECTION - eliminar usuario

async function deleteUser(id) {

  const options = {
    method: 'DELETE',
  }
  window.location.href = "http://localhost:4040/admin"
  return await fetch(`http://localhost:4040/api/users/${id}`, options)

}