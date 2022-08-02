const express = require('express');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://127.0.0.1:27017/authDemo')
    .then(() => {
        console.log('MONGO CONNECTION OPEN!!!');
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!");
        console.log(err)
    })

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }));

const requireLogin = (req, res, next) => {
    if(!req.session.user_id){
        return res.redirect('/login');
    } else {
        next();
    }
} 

app.get('/home', (req, res) => {
    res.send('This is home page!');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { password, username } = req.body;
    const user = new User({ username, password })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser){
        req.session.user_id = foundUser._id;
        res.redirect('/secret');
    } else {
        res.redirect ('/login');
    }
});

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    // req.session.destroy();
    res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret');
});

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('TOP SECRET!!!');
});

app.listen(3000, () => {
    console.log('SERVER CONNECT!!!');
});












// const bcrypt = require('bcrypt');
// // <- con la salt separada del hash ->
// // const hashPassword = async (pw) => {
// //     const salt = await bcrypt.genSalt(12);
// //     const hash = await bcrypt.hash(pw, salt);
// //     console.log(salt);
// //     console.log(hash);
// // }
// // <- con la salt junto al hash ->
// const hashPassword = async (pw) => {
//     const hash = await bcrypt.hash(pw, 12);
//     console.log(hash);
// }

// const login = async(pw, hashedPw) => {
//     const result = await bcrypt.compare(pw, hashedPw);
//     if (result) {
//         console.log("LOGGED YOU IN! SUCCESSFUL MATCH!")
//     } else {
//         console.log("Password Incorrect!")
//     }
// }

// // hashPassword('monkey');
// login('monkey', '$2b$12$zAwA70p1B923Ds5.b/alT.awuanNQp5Y/TeYffQHY9tOCh4ocNrMu');