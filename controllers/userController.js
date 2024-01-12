const User = require('../models/userModel');
const bcrypt = require("bcrypt");


// For Password Encryption

const securePassword = async (password) => {
    try {

        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}
// Password Encryption end

const loadmainHome = async(req,res)=>{
    try {
        res.render('mainHome');
        
    } catch (error) {
        console.log(error.message);
    }
}

// Load signup Form

const loadRegister = async (req, res) => {
    try {
        res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
}
// Load Signup FOrm end

// Insert user data in database

const insertUser = async (req, res) => {

    try {
        const secureHashPassword = await securePassword(req.body.password)
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: secureHashPassword,
            is_admin: 0


        });

        const userData = await user.save();

        if (userData) {

            res.render('registration', { message: " Your Signup is Successfull." });

        }
        else {
            res.render('registration', { message: " Your Signup is Failed" });

        }

    } catch (error) {
        console.log(error.message);
    }
}

// insert user data end

// Login User methods started

const loginLoad = async (req, res) => {
    try {

        res.render('login');

    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {

    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (passwordMatch) {

                req.session.user_id = userData._id;

                res.redirect('/home');

            } else {
                res.render('login', { message: "email and password is inncorrect" });
            }
        }
        else {
            res.render('login', { message: "email and password is inncorrect" });
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async (req, res) => {
    try {
        const userAllData = await User.findById({ _id: req.session.user_id });
        res.render('home', { user: userAllData });

    } catch (error) {
        console.log(error.message);
    }
}

const userLogout = async (req, res) => {
    try {

        req.session.destroy();
        res.redirect('/login');

    } catch (error) {
        console.log(error.message);
    }
}

// User Profile Edit & Update

const editLoad = async (req, res) => {
    try {

        const id = req.query.id;

        const userData = await User.findById({ _id: id });

        if (userData) {

            res.render('edit', { user: userData })
        }
        else {
            res.redirect('/home')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {

        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, image: req.file.filename } });

        } else {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } });
        }
        res.redirect('/home');
    } catch (error) {
        console.log(error.message);
    }
}

// const deleteUser = async(req,res)=>{

//     try {
//         const id = req.query.id;
//         await User.deleteOne({_id:id});
//         res.redirect('/signup');
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }

module.exports = {
    loadmainHome,
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile

}