
import passport from "passport";
import { redirectToLogin, logout, auth, updateUserRole, sendRecoveryMail, restorePassword, getUsers, deleteInactiveUsers, deleteUser, uploadFile } from "../controllers/user.controller.js";
import MyRouter from "./router.js";
import {  uploadGeneric } from "../middlewares/multer.middleware.js";
import logger from "../utils/logger.js";

export default class userRouter extends MyRouter {
    init() {

        // SECTION - obtener usuarios

        this.get('/', ["ADMIN", "USER", "PREMIUM"], getUsers)

        // SECTION - registrar

        this.post("/", ["PUBLIC"], passport.authenticate('register'), redirectToLogin)

        // SECTION - cerrar sesion

        this.post('/logout', ["ADMIN", "USER", "PREMIUM"], logout)

        // SECTION - autenticarse

        this.post("/auth", ["PUBLIC"], passport.authenticate('login'), auth)

        // SECTION - actualizar rol de user

        this.put('/premium/:uid', ["ADMIN", "USER", "PREMIUM"], updateUserRole)

        // SECTION - enviar mail para restablecer contraseña

        this.post('/sendRecovery', ["PUBLIC"], sendRecoveryMail)

        // SECTION - restablecer contraseña

        this.post('/restorePass', ["PUBLIC"], restorePassword)

        // SECTION - eliminar usuarios inactivos

        this.delete('/deleteInactive', ['ADMIN'], deleteInactiveUsers)

        // SECTION - eliminar usuario

        this.delete('/:uid', ['ADMIN'], deleteUser)

        // SECTION - subir archivos

        this.post('/:uid/documents', ['ADMIN', 'USER', 'PREMIUM'],uploadGeneric.fields(
            [
                {name: 'profileImage', maxCount: 1},
                {name: 'productImage', maxCount: 1},
                {name: 'documentFile', maxCount: 1},
                {name: 'residenceFile', maxCount: 1},
                {name: 'accStatusFile', maxCount: 1},
            ]
        ) , uploadFile
        )

    }
}