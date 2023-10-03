import passport from "passport";
import local  from "passport-local";
import GitHubStrategy from 'passport-github2';
import config from "../env/config.js";
import { comparePassword , hashPassword } from "../utils/encrypt.util.js";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { userController } from "../service/user.service.js";
import { cartController } from "../service/cart.service.js";
import CustomErrors from "../utils/customErrors.js";
import EErros from "../utils/Errors.js";
import { createUserErrorInfo , userNotFoundErrorInfo } from "../utils/infoError.js";
import logger from "../utils/logger.js";
const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;
const LocalStrategy = local.Strategy


const inicializePassport = () => {

    // SECTION - registrarse

    passport.use('register', 
    new LocalStrategy(
        {usernameField: 'email', passReqToCallback: true },
        async (req, username,password,done) => {
            const {name , lastName, img, age} = req.body
            const email = username
            const pass = password
            if (!name|| !lastName|| !img|| !age || !username || !password){
                req.logger.warning('error al crear el usuario en la estrategia de passport')
                CustomErrors.createError("User creation error", createUserErrorInfo({name,lastName,img,age,email,pass}), "Error en los datos del usuario",EErros.INVALID_TYPE)
            }

            try{
                const user = await userController.getUserByEmail(username)
                if(user){
                    return done(null, false, {message: "user already exists"})
                }
                const hashedPass = hashPassword(password)
                const cart = await cartController.createCart()
                const role = username === config.ADMINMAIL && password === config.ADMINPASSWORD? "admin" : "user"
                const newUser = await userController.createUser({
                    name,
                    lastName,
                    email: username,
                    age,
                    password: hashedPass,
                    img,
                    cart: cart,
                    role: role
                })

                return done(null, newUser)
            } catch (err){
                logger.warning('error al intentar registrarse')
                done(err)
            }
        }
    ))

    // SECTION - ingresar con github

    passport.use('github',
    new GitHubStrategy({
        clientID: config.CLIENTID,
        clientSecret: config.CLIENTSECRET,
        callbackURL:
            'http://localhost:4040/api/sessions/githubcallback'
            },
            async (accessToken, refreshToken, profile, done) =>{
                try{
                    
                    let user = await userController.getUserByEmail(profile._json.email)
                    if(!user){
                        const newUser = {
                            name: profile._json.name,
                            age:"",
                            lastName: "",
                            email: profile._json.email,
                            password: "",
                            img: profile._json.avatar_url
                        }

                        

                        user = await userController.createUser(newUser)
                        done(null, user)

                    } else {
                        done(null, user)
                    }
                } catch (err){
                    logger.error('error al intentar iniciar sesion con GitHub')
                    done(err, false)
                }
            }
        )
    )   

    // SECTION - serializar el user

    passport.serializeUser((user,done) => {
        done(null, user._id)
    })

    // SECTION - deserializar el user

    passport.deserializeUser(async (id,done) => {
        try{
            const user = await userController.getUserById(id)
            done(null, user)
        } catch(err){
            logger.fatal(`error al serializar el user:
            ${err}`)
        }
        
    })

    // SECTION - inicio de sesion

    passport.use('login',
        new LocalStrategy(
            {usernameField: 'email'},
            async (username,password,done) =>{
                try{
                    const user = await userController.getUserByEmail(username)
                    
                    if (!user){
                        logger.warning('error, usuario no encontrado')
                        CustomErrors.createError("User login error", userNotFoundErrorInfo(user), "Error en los datos, no se encontró el usuario",EErros.INVALID_TYPE)
                    } 

                    if (!comparePassword(user,password)) return done(null,false, {message: 'invalid data'})

                    return done(null, user);

                } catch(err){
                    logger.fatal(err)
                    done(err)
                }
            }
        )
    )

    // SECTION - estrategia del JWT

	passport.use(
		'jwt',
		new jwtStrategy(
			{
				jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
				secretOrKey: config.PRIVATEKEY,
			},
			(payload, done) => {
				done(null, payload);
			}),
		async (jwt_payload, done) => {
			try {
				return done(null, jwt_payload);
			} catch (error) {
                logger.fatal(`error fatal en passport jwt: ${error}`)
				done(error);
			}
		}
	);

}

// SECTION - extraer la cookie para usar en el JWT

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

export default inicializePassport