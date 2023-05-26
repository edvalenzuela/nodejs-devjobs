require('./config/db');

const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const router = require('./routes')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bodyParse = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('./config/passport')

require('dotenv').config({path: 'variables.env'})

const app = express()

//habilitar body-parser
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: true}))

//validación de campos con express validator
app.use(expressValidator())

//habilitar handlebars como view
app.engine('handlebars', 
  exphbs.engine({
    defaultLayout: 'layout',
    helpers: require('./helpers/handlebars')
  })
)

app.set('view engine','handlebars')

app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser())
app.use(session({
  secret: process.env.SECRETO,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE
  })
}))

// iniciarlizar passport
app.use(passport.initialize())
app.use(passport.session())

//alertas y flash messages
app.use(flash())

// crear nuestro middleware
app.use((req, res, next) => {
  res.locals.mensajes = req.flash()
  next()
})

app.use('/', router())

app.listen(process.env.PUERTO, ()=> {
  console.log(`Corriendo en el puerto ${process.env.PUERTO}`)
})