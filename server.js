require("dotenv").config()
const debug = require("debug")("server")
const express = require("express")
const morgan = require("morgan")
const path = require("path")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")


const authRouter = require("./src/routes/authRouter")

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan("tiny"))
app.use(flash())

// Initialize the passport 
app.use(passport.initialize())
// Save the sessions acros the pages

app.use(session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false
}))

app.use(passport.session())
// Set the views path
app.set('views', path.join(__dirname, '/src/views/'))

// Set the view engine i.e. EJS
app.set('view engine', 'ejs')


// Routes
router.route("/")
    .get((req, res) => {
        console.log(req.session, req.user)
        if(req.user){
            res.render("index",{data: req.user.name})
        }else{
            res.redirect("/auth/login")
        }
    })


app.use(router)
app.use("/auth",authRouter)

app.listen(PORT, (error) => {
    debug("Server running at: "+PORT)
})