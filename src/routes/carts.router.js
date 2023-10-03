
import { deleteCartProduct, getCart, updateQuantity, emptyCart, addProductToCart, purchase, purchaseGreet } from "../controllers/cart.controller.js";
import MyRouter from "./router.js";

export default class cartRouter extends MyRouter {
    init() {

/**
* @swagger
* components:
*   schemas:
*     Cart:
*       type: object
*       properties:
*         _id:
*           type: string
*           description: Id generado por mongo
*         products:
*           type: array
*           description: array con los productos y sus cantidades
*           items:
*             type: object
*             properties:
*               product:
*                 type: string
*               quantity:
*                 type: number
*                 description: id y cantidad del producto
*       example:
*         _id: ObjectId(bdsfbb059025052b50fbsab)
*         products: [{ product: ObjectId(bsfb05099503b35b090b), quantity: 5 }] 
*
*   requestBodies:
*     addProduct:
*       type: string
*       description: id del producto a agregar
*       example: ObjectId(bdsfbb059025052b50fbsab)
*     updateQuantity:
*       type: object
*       properties:
*         qty: 
*           type: number
*           description: cantidad a actualizar
*       example:
*         qty: 3
 */

// SECTION - greet de la compra

this.get('/purchaseGreet', ["USER", "PREMIUM"], purchaseGreet)


// SECTION - realizar compra (con documentacion)

this.post('/:cid/purchase', ["USER", "PREMIUM"], purchase)

/** 
* @swagger
*   api/carts/{cid}/purchase:
*     post:
*       summary: realizar la compra
*       tags:
*         - Cart
*       parameters:
*       - name: cid
*         in: path
*         required: true
*         description: id del cart el cual se realizara la compra
*         schema:
*           $type: String
*       responses:
*         '200':
*           description: la compra fue hecha satisfactoriamente
*         '500':
*           description: error del servidor
*/


// SECTION - Obtener y renderizar productos del cart (con documentacion)

this.get('/:cid', ["USER", "PREMIUM"], getCart)

/**
 * @swagger
 * api/carts/{cid}:
 *   get:
 *     summary: Obtiene el cart del usuario (solo para users y users premium)
 *     tags:
 *       - Cart
 *     parameters:
 *     - name: cid
 *       in: path
 *       required: true
 *       description: id del cart del usuario actual
 *       schema:
 *         $type: String
 *     responses:
 *       '200':
 *         description: cart encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#components/schemas/Cart'
 *       '500':
 *         description: error del servidor
 */


// SECTION - Agregar producto al cart (con documentacion)

this.put('/:cid', ["USER", "PREMIUM"], addProductToCart)

/**
 * @swagger
 * api/carts/{cid}:
 *   put:
 *     summary: agrega un producto al cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/addProduct'
 *     parameters:
 *     - name: cid
 *       in: path
 *       required: true
 *       description: id del cart al cual se le agregara el producto
 *       schema:
 *         $type: String
 *     responses:
 *       '200':
 *         description: producto agregado satisfactoriamente
 *       '500':
 *         description: error del servidor
 */


// SECTION - actualizar quantity del producto (con documentacion)

this.put('/:cid/products/:pid', ["USER", "PREMIUM"], updateQuantity)

/**
 * @swagger
 * api/carts/{cid}/products/{pid}:
 *   put:
 *     summary: actualizar la cantidad del producto seleccionado
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/updateQuantity'
 *     parameters:
 *     - name: cid
 *       in: path
 *       required: true
 *       description: id del cart
 *       schema:
 *         $type: String
 *     - name: pid
 *       in: path
 *       required: true
 *       description: id del product
 *       schema:
 *         $type: String
 *     responses:
 *       '200':
 *         description: la compra fue hecha satisfactoriamente
 *       '500':
 *         description: error del servidor
 */

// SECTION - Borrar producto del cart (con documentacion)

this.delete('/:cid/products/:pid', ["USER", "PREMIUM"], deleteCartProduct)

/**
 * @swagger
 * api/carts/{cid}/products/{pid}:
 *   delete:
 *     summary: borra un producto seleccionado del cart
 *     tags:
 *       - Cart
 *     parameters:
 *     - name: cid
 *       in: path
 *       required: true
 *       description: id del cart
 *       schema:
 *         $type: String
 *     - name: pid
 *       in: path
 *       required: true
 *       description: id del product
 *       schema:
 *         $type: String
 *     responses:
 *       '200':
 *         description: producto eliminado satisfactoriamente
 *       '500':
 *         description: error del servidor
 */

// SECTION - vaciar el cart (con documentacion)

this.delete('/:cid', ["USER", "PREMIUM"], emptyCart)

/**
 * @swagger
 * api/carts/{cid}:
 *   delete:
 *     summary: eliminar todos los productos del carrito
 *     tags:
 *       - Cart
 *     parameters:
 *     - name: cid
 *       in: path
 *       required: true
 *       description: id del cart el cual se vaciará
 *       schema:
 *         $type: String
 *     responses:
 *       '200':
 *         description: carrito vaciado satisfactoriamente
 *       '500':
 *         description: error del servidor
 */
    }
}



