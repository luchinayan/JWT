const express = require('express');
const mongoose = require('mongoose');
const router = require("./routes/authRouter");
const cookieParser = require('cookie-parser')
const {requireAuth, checkUser} = require("./middleware/authMiddleware");
const app = express();
const PORT = process.env.PORT || 3000
// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
// view engine
app.set('view engine', 'ejs');

// database connection

const start = async () => {
    try {
        const dbURI = 'mongodb+srv://JWT:JSONWT@cluster0.ajb3p.mongodb.net/JWT';
        await mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        app.listen(PORT, () => {
            console.log(`listen on port ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
}
start()
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    // some other closing procedures go here
    process.exit(1);
});
// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/shop', requireAuth, (req, res) => res.render('shop'));


app.use(router)






