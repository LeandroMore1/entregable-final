
import passport from "passport";
import { redirectToLogin , logout , auth , updateUserRole, sendRecoveryMail, restorePassword, getUsers, deleteInactiveUsers,deleteUser} from "../controllers/user.controller.js";
import MyRouter from "./router.js";


export default class userRouter extends MyRouter{
    init(){

        // SECTION - obtener usuarios

        this.get('/', ["ADMIN","USER","PREMIUM"],getUsers)

        // SECTION - registrar

        this.post("/",["PUBLIC"],passport.authenticate('register'),redirectToLogin)

        // SECTION - cerrar sesion
        
        this.post('/logout', ["PUBLIC"],logout)

        // SECTION - autenticarse

        this.post("/auth",["PUBLIC"], passport.authenticate('login' ) ,auth)

        // SECTION - actualizar rol de user

        this.put('/premium/:uid', ["ADMIN","USER","PREMIUM"], updateUserRole)

        // SECTION - enviar mail para restablecer contraseña

        this.post('/sendRecovery', ["PUBLIC"], sendRecoveryMail)

        // SECTION - restablecer contraseña

        this.post('/restorePass', ["PUBLIC"], restorePassword)

        // SECTION - eliminar usuarios inactivos

        this.delete('/deleteInactive', ['ADMIN'], deleteInactiveUsers)

        // SECTION - eliminar usuario

        this.delete('/:uid', ['ADMIN'],deleteUser)

    }
}