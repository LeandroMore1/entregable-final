
import passport from "passport";
import { generateToken } from "../middlewares/jwt.middleware.js";
import MyRouter from "./router.js";

export default class sessionRouter extends MyRouter{
	init(){

		
		this.get('/github',["PUBLIC"], passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {});

		this.get('/githubcallback',["PUBLIC"],passport.authenticate('github', { failureRedirect: '/login' }),(req, res) => {
				const user = req.user;
				const token = generateToken(user)
				res.cookie('token', token, {
					httpOnly: true,
					maxAge: 300000,
				})
				res.redirect('/products');
			}
		)
	}
}
