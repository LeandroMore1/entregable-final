import { generateToken, setToken } from "../middlewares/jwt.middleware.js";
import { cartController } from "../service/cart.service.js";
import { userController } from "../service/user.service.js";
import { comparePassword, hashPassword } from "../utils/encrypt.util.js";
import jwt from "jsonwebtoken"
import mailService from "../config/mailing.config.js";
import config from "../env/config.js";
import logger from '../utils/logger.js'
import userDTO from "../dto/user.dto.js";
import usersDTO from "../dto/users.dto.js";
import { uploadGeneric } from "../middlewares/multer.middleware.js";

// SECTION - redirigir al login

export const redirectToLogin = async (req, res) => {
    try {
        res.redirect('/login')
    } catch (err) {
        logger.error(`error al intentar redireccionar al usuario en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}



// SECTION - cerrar sesion 

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token
        let user
        user = jwt.verify(token, config.PRIVATEKEY)
        const email = user.user.email
        user = await userController.getUserByEmail(email)
        user.last_connection = new Date()
        await userController.updateUser(user._id, user)

        req.user = null
        res.clearCookie('connect.sid')
        res.clearCookie('token')
        res.redirect("/login")
    } catch (err) {
        logger.warning(`error al intentar cerrar sesion en: ${req.url}:\n${err}`)
        res.status(500).send('internal server error')
    }

}

// SECTION - autenticarse

export const auth = async (req, res) => {
    try {
        if (!req.user) return res.status(404).send('User not found')
        req.user = new userDTO(req.user)
        const user = req.user;
        let finduser = await userController.getUserByEmail(user.email)
        finduser.last_connection = new Date()
        await userController.updateUser(finduser._id, finduser)
        const token = generateToken(user)
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 300000,
        })
        res.redirect("/products")
    } catch (err) {
        logger.warning(`error al autenticarse en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }


}

// SECTION - cambiar rol


export const updateUserRole = async (req, res) => {
    try {
        const token = req.cookies.token
        const id = req.params.uid
        let user
        if (token) {
            user = await userController.getUserById(id)
        }
        const role = req.body.role
        if (user.role === "admin") {
            logger.error('los admins no pueden cambiar su rol!')
            return res.status(400).send('Admin is not allowed to changed roles')
        } else if (role === "premium") {
            user.role = "premium"
            await userController.updateUser(user._id, user)
            return res.status(200).send('role updated successfully')
        } else if (role === "user") {
            user.role = "user"
            await userController.updateUser(user._id, user)
            return res.status(200).send('role updated successfully')
        }
    } catch (err) {
        logger.error(`error al intentar cambiar el rol del usuario en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}

// SECTION enviar mail para recuperar contraseña

export const sendRecoveryMail = async (req, res) => {
    try {
        const email = req.body.email
        const baseUrl = req.protocol + '://' + req.get('host');
        let user = await userController.getUserByEmail(email)
        if (!user) {
            req.logger.warning('el user no existe')
            return res.status(400).send('error, el mail ingresado no pertenece a ningun usuario')
        }

        const timer = 3600000


        const recovery = setToken(user._id)
        res.cookie('restoreToken', recovery, {
            httpOnly: true,
            maxAge: timer,
        })


        const mailOptions = {
            from: config.NODEMAILER_EMAIL,
            to: email.toString(),
            subject: 'Recuperación de contraseña',
            html: `<h1>Hola ${user.name}</h1>
            <p>para restablecer tu contraseña deberas ingresar <a href='${baseUrl}/restorePassword/${recovery}'>aqui</a></p>`

        }
        const mailer = new mailService()
        await mailer.sendMail(mailOptions)
        req.logger.info('mail enviado')
        res.status(200).send('email sent successfully')

    } catch (err) {
        logger.error(`error al intentar enviar el mail de recuperacion en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }
}

// SECTION restaurar contraseña

export const restorePassword = async (req, res) => {
    try {
        const { password, token } = req.body

        const user = jwt.verify(token, config.PRIVATEKEY)

        const findUser = await userController.getUserById(user.user)
        if (comparePassword(findUser, password)) {
            req.logger.warning('no puede tener la misma contraseña!')
            return res.status(400).send('no se puede introducir la contraseña anterior')
        }
        findUser.password = hashPassword(password)
        await userController.updateUser(findUser._id, findUser)
        res.clearCookie("restoreToken")
        req.logger.info("contraseña cambiada satisfactoriamente")
        return res.status(200).send("password restored successfully!")
    } catch (err) {
        logger.error(`error al intentar restaurar la contraseña del usuario en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }
}

// SECTION obtener usuarios

export const getUsers = async (req, res) => {
    try {
        let users = await userController.getUsers()
        let user = req.user
        users = new usersDTO(users)
        res.render('users', { users: users.users, user })
    } catch (err) {
        logger.error(`error al intentar obtener los usuarios en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}

// SECTION - eliminar usuarios inactivos

export const deleteInactiveUsers = async (req, res) => {
    try {
        const expiringTime = 48 * 60 * 60 * 1000
        let users = await userController.getUsers()
        users = users.filter(el => {
            let lastConnection = new Date(el.last_connection).getTime()
            return Date.now() - lastConnection > expiringTime && el.role !== "admin"
        })
        if (users.length === 0) {
            logger.info('no hay usuarios inactivos por el momento!')
            return res.status(400).send('no inactive users found')
        } else {
            users.forEach(async element => {
                const mailOptions = {
                    from: config.NODEMAILER_EMAIL,
                    to: element.email,
                    subject: 'Cuenta eliminada',
                    html: `<h1>Hola ${element.name}</h1>
                        <p>lamentamos informarte que tu cuenta ha sido eliminada debido a inactividad</p>`
                }
                const mailer = new mailService()
                await mailer.sendMail(mailOptions)
                logger.debug('email sent')
                await cartController.deleteCart(element.cart)
                await userController.deleteUserById(element._id)
            })
        }
        logger.debug(JSON.stringify(users))
        res.status(200).send('success')
    } catch (err) {
        logger.error(`error al intentar eliminar los usuarios expirados en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }
}

// SECTION - eliminar usuario

export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid
        const user = await userController.getUserById(userId)
        await cartController.deleteCart(user.cart)
        await userController.deleteUserById(userId)
        const deletedUser = await userController.getUserById(userId)
        if (!deletedUser) {
            logger.info('usuario eliminado satisfactoriamente')
            return res.status(200).send('user deleted')
        } else {
            throw new Error('error')
        }
    } catch (err) {
        logger.error(`error al intentar eliminar el usuario en: ${req.url}:\n${err}`)
        return res.status(500).send('internal server error')
    }

}

export const uploadFile = async (req, res) => {
    try {
        setTimeout(async () => {
            const user = req.user
            const findUser = await userController.getUserById(user._id)
            const baseUrl = req.protocol + '://' + req.get('host')+'/'
            const files = req.files
            const fileName = files.profileImage[0]

            const documents = []
            for (const file in files) {
                if (file !== 'profileImage' && file !== 'productImage') {
                    const filesToUpload = files[file];
                    filesToUpload.forEach(file => {
                        documents.push({
                            file: file.fieldname,
                            reference: file.path
                        });
                    });
                }
            }
            const pathImg = fileName.destination
            findUser.img = `${baseUrl}${pathImg.replace('public/', '')}/${fileName.filename}`
            await userController.updateUser(user._id, findUser)
            res.redirect("/profile")
        }, 2000)


    } catch (err) {
        logger.error(err)
    }
}

