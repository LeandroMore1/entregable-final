export const createUserErrorInfo = (user) => {
    return `
    error al intentar crear el usuario:
    Name > ${user.name} 
    Last Name> ${user.lastName} 
    E-mail> ${user.email}
    Age > ${user.age}
    password > ${user.pass}
    img > ${user.img}
    `.trim()
}

export const deleteProductErrorInfo =()=>{
    return 'error, solo los admin pueden borrar productos que no hayan sido creados por ellos'
}

export const userNotFoundErrorInfo = (user) => {
    return `
    Error, usuario no encontrado
    user > ${user}
    `
}

export const endpointErrorInfo = () =>{
    return `
    Error, el endpoint solicitado no es valido
    `
}


export const createProductErrorInfo = (product) => {
    return `
    Error al intentar crear el producto:
    title > ${product.titulo}
    description > ${product.descripcion}
    price > ${product.precio}
    code > ${product.codigo}
    thumbnail > ${product.img}
    stock > ${product.stockDisp}
    category > ${product.categoria}
    `
}