const {Router} = require('express')
const bcrypt = require('bcryptjs') //**bdcrypt - cryptography module
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

//**Processing POST request
//** /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Is not correct email').isEmail,
        check('password', 'The minimum password length is 6 charasters').isLength({min: 6})
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }

        const {email, password} = req.body

        const candidate = await User.findOne({email})
        //**If such an email is registered in the database
        if (candidate){
            return res.status(400).json({message: 'Such a user already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        return res.status(201).json({message: 'User created'})

    } catch (e) {
        res.status(500)
            .json({message: "Error register routes"})
    }
})

//** /api/auth/register
router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})
        //**If such an email is registered in the database
        if (!user){
            return res.status(400).json({message: 'User not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch){
            return res.status(400).json({message: 'Invalid password, try again'})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id})
    } catch (e) {
        res.status(500)
            .json({message: "Error login routes"})
    }
})

module.exports = router