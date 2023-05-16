require('./config/db');

const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const router = require('./routes')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bodyParse = require('body-parser')

require('dotenv').config({path: 'variables.env'})

const app = express()

//habilitar body-parser
app.use(bodyParse.json())
app.use(bodyParse.urlencoded({extended: true}))

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

app.use('/', router())

app.listen(process.env.PUERTO, ()=> {
  console.log(`Corriendo en el puerto ${process.env.PUERTO}`)
})