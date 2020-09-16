const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model("User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requireLogin = require('../middleware/requireLogin')
const { JWT_SECRET } = require('../keys')

// ================= SIGN UP ROUTE ===================
router.post('/signup', (req, res) => {
    const { name, email, password,pic } = req.body;
    if (!email || !password || !name) {
        return res.json({ error: "please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exist with that email" });
            }

            bcrypt.hash(password, 12)
                .then(hashedPassword => {

                    const user = new User({ name, email, password: hashedPassword, pic });

                    user.save()
                        .then(user => {
                            res.json({ message: "User saved successfully" });
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err);

        })

});

// ================= SIGN IN ROUTE ===================

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add Email or password" });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email or password" });
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //   return res.json({message: "Successfully Signed In"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
                        const {_id, name, email, followers ,following,pic} = savedUser
                        res.json({ token, user: {_id, name,email,followers,following,pic}});
                    } else {
                        return res.status(422).json({ error: "Invalid email or password" });
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
});
module.exports = router;
