    

    // SECTION - comprar producto

    async function buy(cid){
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({cid: cid})
      }
    
      const response = await fetch(`/api/carts/${cid}/purchase`, options)
      if (response.status === 200) {
        window.location.href = `/api/carts/purchaseGreet`;
    } else if(response.status === 400){
      const msg = document.getElementById('warningMsg')
      msg.innerHTML = 'no hay suficiente stock para el/los productos que deseas comprar!'
  }
}
    // SECTION - funcion agregar producto


  async function addProduct(endpoint,prodId) {

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({prodId: prodId})
      }
    
      const response = await fetch(`/api/carts/${endpoint}`, options)
      if (response.status === 200){
        Toastify({

          text: "Producto agregado exitosamente!",
          style: {
            background: "#07bc0c",
          },
          duration: 3000
          
          }).showToast();
      } else if (response.status === 400){
          Toastify({
            text: "No puedes agregar un producto que creaste",
            style: {
              background: "#f1c40f",
            },
            duration: 3000
            
            }).showToast();
      }else if (response.status === 403){
        Toastify({
          text: "El admin no puede agregar productos",
          style: {
            background: "#f1c40f",
          },
          duration: 3000
          
          }).showToast();
    }
    }


    // SECTION - funcion borrar un producto



    async function deleteSingleProduct(endpoint,prodId){
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({prodId: prodId, cartId: endpoint})
      }

      const row = document.getElementById(`${prodId}`)
      row.innerHTML = ""
      totalPrice()
      return await fetch(`/api/carts/${endpoint}/products/${prodId}`, options)
    }



    // SECTION - funcion vaciar el carrito



    async function deleteProducts(cartId){
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
      const msg = document.getElementById('warningMsg')
      const message = document.getElementById('emptyMessage')
      const cart = document.getElementById('cartItems')
      const deleteButton = document.getElementById('empty')

      cart.innerHTML = ""
      deleteButton.innerHTML = ""
      msg.innerHTML = ""
      message.innerHTML= `<p>El carrito esta vacio!</p>`
      let totalPriceDisplay = document.getElementById('totalPrice');
    totalPriceDisplay.textContent = ""
      return await fetch(`/api/carts/${cartId}`, options)
    }



      // SECTION - funcion actualizar cantidad



      async function updateProductQty(endpoint,prodId, actVal){
        const msg = document.getElementById('warningMsg')
        const inputVal = document.querySelector(`input[data-product-id="${prodId}"]`).value
        const quantityRendered = document.querySelector(`[data-product-id="${prodId}"].productQty`)
        
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({cartId: endpoint, prodId: prodId, qty: inputVal, actVal: actVal})
        }

        if( inputVal <= 0 ){
          msg.innerHTML = 'debes poner al menos una cantidad valida!'
        } else{
          quantityRendered.innerHTML = inputVal;
          msg.innerHTML = ''
          totalPrice()
          return await fetch(`/api/carts/${endpoint}/products/${prodId}`, options)
        }

        
      }
function totalPrice(){

  let totalPrice = 0;
  let elements = document.querySelectorAll('td.price');
  elements.forEach(function(el) {
  
    let productId = el.dataset.productId;
    let getPrice = document.querySelector(`td.price[data-product-id="${productId}"]`);
    let productPrice = parseInt(getPrice.textContent);
    let getQty = document.querySelector(`td.productQty[data-product-id="${productId}"]`);
    let productQuantity = parseInt(getQty.textContent);
  
    let subtotal = productPrice * productQuantity;
  
    totalPrice += subtotal;
  });
  
  let totalPriceDisplay = document.getElementById('totalPrice');
  totalPriceDisplay.textContent = 'Total: $' + totalPrice
}
totalPrice()