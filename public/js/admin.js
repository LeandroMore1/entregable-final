// SECTION - eliminar users inactivos


// SECTION - eliminar users inactivos

async function deleteInactive() {

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const response = await fetch(`/api/users/deleteInactive`, options)
  if (response.status === 200){
    Toastify({
      text: "Usuarios inactivos eliminados",
      className: "info",
      style: {
        background: "#3498db",
      }
    }).showToast();
  } else if(response.status === 400){
    Toastify({
      text: "No hay users inactivos!",
      className: "info",
      style: {
        background: "#3498db",
      }
    }).showToast();
  } else if (response.status === 500){
    Toastify({
      text: "Error en el servidor",
      style: {
        background: "#f1c40f",
      }
    }).showToast();
  }
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
  const response = await fetch(`/api/users/premium/${userId}`, options)
  if (response.status === 200){
    Toastify({
      text: "Rol cambiado",
      className: "info",
      style: {
        background: "#3498db",
      }
    }).showToast();
  } else if (response.status === 500){
    Toastify({
      text: "Error en el servidor",
      style: {
        background: "#f1c40f",
      }
    }).showToast();
  }

}

// SECTION - eliminar usuario

async function deleteUser(id) {

  const options = {
    method: 'DELETE',
  }
  
  const response = await fetch(`/api/users/${id}`, options)
  if (response.status === 200){
    Toastify({
      text: "Usuario eliminado",
      className: "info",
      style: {
        background: "#3498db",
      }
    }).showToast();
    window.location.href = "/admin"
  } else if (response.status === 500){
    Toastify({
      text: "Error en el servidor",
      style: {
        background: "#f1c40f",
      }
    }).showToast();
  }


}