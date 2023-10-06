
const socket = io()

function render(data) {

    const html = data.map((elem, index) => {
        return `<div id="productCard">
            <div class="secondaryDiv">
            <h2>producto:</h2> 
            <p>${elem.title}</p>
            </div>
            <div class="secondaryDiv">
            <h2>precio:</h2>
            <p>${elem.price}</p>
            </div>
            <div class="secondaryDiv">
            <h2>descripcion:</h2>
            <p>${elem.description}</p>
            </div>
            <div class="secondaryDiv">
            <h2>stock disponible:</h2>
            <p>${elem.stock}</p>
            </div>
            <div class="secondaryDiv">
            <h2>id:</h2>
            <p>${elem.id}</p>
            </div>
            </div>`;
    })
        .join(' ')
    document.getElementById('productsList').innerHTML = html;
}

async function uploadProduct() {
    const titulo = document.getElementById('title').value
    const descripcion = document.getElementById('description').value
    const precio = parseInt(document.getElementById('price').value)
    const codigo = parseInt(document.getElementById('code').value)
    const stockDisp = parseInt(document.getElementById('stock').value)
    const img = document.getElementById('thumbnail').value
    const categoria = document.getElementById('category').value
    const prodToAdd = {
        title: titulo,
        description: descripcion,
        price: precio,
        code: codigo,
        stock: stockDisp,
        thumbnail: img,
        category: categoria
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(prodToAdd)
    }

    return await fetch(`/api/products/create`, options)

}

async function deleteProduct(){
        const prodToDel = document.getElementById('productToDeleteId').value
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({prodToDel:prodToDel})
        }

        return await fetch(`/api/products/delete`, options)
      }


socket.on('prodsList', async (data) => {
    render(await data)
})