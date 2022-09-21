require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const logger = require('./logger')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const Users = require('./models/users')
const Products = require('./models/products')
const { encrypt, compare } = require('./bcrypt')
const cors = require('cors')
let productos;



// Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(cors())

// Passport
passport.use('login', new LocalStrategy(
    (username, password, done) => {
        Users.findOne({username}, async (err, user) => {

            if(err) {
                logger.error(err)
                return done(err)   
            }
            if(!user) {
                logger.warn(`Ningun usuario con el nombre ${username} fue encontrado`)
                return done(null, false)
            }

            const checkPassword = await compare(password, user.password)

            if(!checkPassword) {
                logger.warn('Datos incorrectos')
                return done(null, false)
            }
            return done(null, user)
        })
}))

passport.use('signup', new LocalStrategy({
    passReqToCallback: true
}, (req, username, password, done) => {
    Users.findOne({username}, async (err, user) => {
        if(err) {
            logger.error(err)
            return done(err)
        }
        if(user) {
            logger.warn('El usuario ya existe')
            return done(null, false)
        }

        const passwordHash = await encrypt(password)

        const newUser = {
            username,
            img: req.body.img,
            email: req.body.email,
            password: passwordHash,
            adress: req.body.adress,
            age: req.body.age,
            phone: req.body.phone
        }
        Users.create(newUser, (err, userWithID) => {
            if(err) {
                logger.error(err)
                return done(err)
            }
            logger.info(userWithID)
            return done(null, userWithID)
        })
    })
}))

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((id, done) => {
    Users.findById(id, done)
})

// Session
app.use(session({
    secret: 'secretito',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax'
    }
}))

app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get('/', checkAuthentication, async (req, res) => {
    const usuario = await req.user
    res.render('index', {productos, usuario})
})
app.post('/', (req, res) => {
    Users.findByIdAndUpdate(
        {_id: req.user._id},
        {$push: {cart: req.body}},
        (error, success) => {
            if(error) logger.error(error)
            else logger.info(success)
        }
    )
})

app.get('/carrito', async (req, res) => {
    const usuario = await req.user
    res.render('cart', {usuario})
})
app.delete('/carrito', async (req, res) => {
    const userID = await req.user._id
    await Users.updateOne(
        {_id: userID},
        {$set: {cart: []}}
    )
})
app.delete('/carrito/:prod', async (req, res) => {
    const userID = await req.user._id
    const prod = await req.params.prod
    await Users.findByIdAndUpdate(
        {_id: userID},
        {$pull: {cart: {id: prod}}}
    )
    res.send('Producto eliminado')
})
app.get('/succes', async (req, res) => {
    const usuario = await req.user
    res.render('compra', {usuario})
})

app.get('/login', (req, res) => {
    if(req.isAuthenticated()) {
        res.redirect('/')
    } else {
        res.render('login')
    }
})
app.post('/login', passport.authenticate('login'), (req, res) => {
    logger.info(req.user)
    res.redirect('/')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})
app.post('/signup', passport.authenticate('signup', {failureRedirect: '/error'}), (req, res) => {
    console.log(req.user)
    res.redirect('/login')
})

app.get('/logout', (req, res) => {
    req.logout(err => {
        if(err) return next(err)
        res.redirect('/login')
    })
})

app.get('/error', (req, res) => {
    res.send(`<h1>Algo salio mal</h1><hr><a href="/login">Volver</a>`)
})

function checkAuthentication(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
}

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        logger.info('Base de datos conectada');
        (async () => {
            productos = await Products.find({})
        })()
    })
    .then(() => {
        app.listen(app.get('port'), () => {
            logger.info(`Server listening on port ${app.get('port')}...`)
        })
    })
    .catch(e => logger.error('Error al conectar la base de datos..', e))