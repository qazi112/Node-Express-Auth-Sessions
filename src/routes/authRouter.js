const express = require("express")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const passport = require("passport")

const initializePassport = require("../../passport-config")


const authRouter = express.Router()
const users = []

// JOI Validation schema for user data
const userRegisterSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().max(12).min(6).required()
})

initializePassport(passport, (email) => {
    return users.find((user) => email === user.email)
},
(id) => users.find((user) => user.id === id) )


authRouter.route("/login")
    .get((req, res) => {
       res.render("login")
    })
    .post(passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/",
        failureFlash: true
    }))

authRouter.route("/register")
    .get((req, res) => {
        res.render("register")
    })
    .post(async (req, res) => {
        try {
            const result = await userRegisterSchema.validateAsync(req.body)
            console.log("Validated")
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            console.log(users)
            res.redirect("/auth/login")

        } catch (error) {
            res.redirect("/auth/register")
        }

    })

authRouter.route("/logout")
    .get(async (req, res) => {
        await req.session.destroy()
        console.log(req.session)
        console.log(req.user)
        res.redirect("/auth/login")
    })
module.exports = authRouter