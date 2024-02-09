const express = require('express')
const handlebars = require('express-handlebars')

const { connectDb } = require('./config/config.js')

const mongoStore = require('connect-mongo')

const session = require('express-session')
const passport = require('passport')
const { initializePassport } = require('./passport-jwt/passport.config.js')

const appRouter = require('./routes/general.router.js')

const cookie = require('cookie-parser')
const configureSocketIO = require('./helpers/socketIO.js')

const handlebarsHelpers = require('handlebars-helpers')()
const eq = handlebarsHelpers.eq

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public'))
app.use(cookie())
app.use(session({
  store: mongoStore.create({
    mongoUrl: 'mongodb+srv://melanybolivarf:Artilleros1917@cluster0.jmxy9aq.mongodb.net/ecommerce?retryWrites=true&w=majority', 
    mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    ttl: 15000000000,
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(appRouter)

initializePassport()
app.use(session({
  secret: 'secret'
}))
app.use(passport.initialize())
//app.use(passport.session())

/* The code `app.engine('handlebars', handlebars.engine())` sets the template engine for the
application to Handlebars. It tells Express to use Handlebars as the view engine. */
app.engine('hbs', handlebars.engine({
  extname: '.hbs',
  helpers: {
    eq: eq
  }
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')


const serverHttp = app.listen(8080, () => {
  console.log(`ejemplo escuchando el puerto 8080`)
})

//connection to data base
connectDb()

const io = configureSocketIO(serverHttp)
module.exports = io



module.exports = app;