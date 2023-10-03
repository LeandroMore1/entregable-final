import MyRouter from "./router.js";
import { createProduct, deleteProduct } from "../controllers/product.controller.js";

export default class productsRouter extends MyRouter{
    init(){

/**
 * @swagger
*components:
*  requestBodies:
*    createProduct:
*      type: object
*      properties:
*        title:
*          type: string
*          description: Título del producto.
*        description:
*          type: string
*          description: Descripción del producto.
*        price:
*          type: number
*          description: Precio del producto.
*        code:
*          type: number
*          description: Código del producto.
*        stock:
*          type: number
*          description: Stock del producto.
*        thumbnail:
*          type: string
*          description: Dirección de imagen del producto
*        category:
*          type: string
*          description: Categoría del producto.
*        owner:
*          type: string
*          description: Creador del producto (email)
*      example:
*        title: guitarra eléctrica
*        description: guitarra stratocaster marca fender
*        price: 200000
*        thumbnail: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQgSDLvM3eeqxUFUW-1i9K0WQWA7v0OlHW8Q3RHcRVsUzOCfKWrThohgA_1JcAP1BX4o3-Jl7dedNC1pr2QlZUCk37QVGcmUBt82Ub_jMF_wy00yqAJH7dN&usqp=CAE"
*        code: 464
*        category: instruments
*        stock: 10
*        owner: fulano@detal.com
*    deleteProduct:
*      type: string
*      example: "id de mongo a eliminar"
 */


// SECTION - crear producto (con documentacion)

this.post('/create', ["ADMIN","PREMIUM"], createProduct)

/**
* @swagger
*
*   /api/products/create:
*    post:
*      summary: Crea un producto (solo para admins o users premium)
*      tags:
*        - Products
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/requestBodies/createProduct'
*      responses:
*        '200':
*          description: Producto creado satisfactoriamente
*        '500':
*          description: Error del servidor
*         
*/


// SECTION - eliminar producto (con documentacion)

this.delete('/delete', ["ADMIN","PREMIUM"], deleteProduct)

/**
 * @swagger
*  /api/products/delete:
*    delete:
*      summary: borra un producto (solo para admins o users premium)
*      tags:
*        - Products
*      requestBody:
*        required: true
*        content:
*          application/json:
*            schema:
*              $ref: '#/components/requestBodies/deleteProduct'
*      responses:
*        '200':
*          description: Producto eliminado satisfactoriamente
*        '500':
*          description: Error del servidor
 */

    }
}