import passport from 'passport';
import { UserModel } from '../Dao/models/login.models.js';
import fetch from 'node-fetch';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';

dotenv.config();

export function iniPassport() {
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: process.env.GITHUB_CALLBACK_URL,
            },
        async (accesToken, _, profile, done) => {
            try {
            const res = await fetch('https://api.github.com/user/emails', {
                headers: {
                Accept: 'application/vnd.github+json',
                Authorization: 'Bearer ' + accesToken,
                'X-Github-Api-Version': '2022-11-28',
                },
            });
            const emails = await res.json();
            const emailDetail = emails.find((email) => email.verified == true);

            if (!emailDetail) {
                return done(new Error('cannot get a valid email for this user'));
            }
            profile.email = emailDetail.email;

            let user = await UserModel.findOne({ email: profile.email });
            if (!user) {
                const newUser = {
                    email: profile.email,
                    firstName: profile._json.name || profile._json.login || 'noname',
                    lastName: 'nolast',
                    isAdmin: false,
                    password: 'nopass',
                    age: 18,
                };
                let userCreated = await UserModel.create(newUser);
                console.log('User Registration succesful');
                return done(null, userCreated);
            } else {
                console.log('User already exists');
                return done(null, user);
            }
            } catch (e) {
            console.log('Error en auth github');
            console.log(e);
            return done(e);
            }
        }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}