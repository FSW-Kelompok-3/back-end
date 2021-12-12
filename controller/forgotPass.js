const jwt = require('jsonwebtoken')
const { user_games, user_game_biodata } = require('../models');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer')

const encrypt = (password) => {
    return bcrypt.hashSync(password, 10);
}

const JWT_SECRET = 'ini rahasia'

const getFrogotP = async(req, res, next) => {
    res.render('forgot-password')
}

const forgotP = async(req, res, next) => {
    const { email } = req.body
    
    try {
         user_game_biodata.findOne({
            where: { email }
        })
        .then((data) => {
            console.log(data)
            if(data) {
                const { email } = req.body
                const secret = JWT_SECRET
                const payload = {
                    email
                }
            
                const token = jwt.sign(payload, secret, { expiresIn: '15m'})
                const link = `https://client-kel3.herokuapp.com/reset-password/${data.id}/${token}`
                
                const smtpConfig = {
                    host: "smtp.Gmail.com",
                    port: 465,
                    secure: true,
                    auth:{
                        user: "renaris97@gmail.com",
                        pass: "babehlo123",
                    }
                }
                const transporter = nodemailer.createTransport(smtpConfig)

                const mailOptions = {
                    from: "renaris97@gmail.com",
                    to: email,
                    subject:'Link Reset Password',
                    text: "Berikut ini adalah link untuk merubah password kamu:  " + link
                }

                transporter.sendMail(mailOptions,function(err,info){
                    if(err){
                        console.log(err)
                    }
                    console.log(info)
                })
                
                // console.log(link);
                return res.status(202).json('Link reset password sudah di kirim')
            }
            if(!data) {
                return res.status(406).json("E-mail not found" )
            }
        })
    }

    catch(err) {
        return res.status(400).json(err)
    }
}

const getResetP = async (req, res, next) => {
    user_games.findOne({
        where: { id: req.params.id }
    })
    .then((data) => {
        res.render({data})
    })
}

const resetP = async (req, res, next) => {
    const { id, token } = req.params
    
    try {
        user_games.findOne ({
           where: {id: req.params.id} 
        })
        .then((data) => {
            console.log(data)
            if(!data) {
                return res.stats(406).json("Id tidak ada")
            }
            if (data) {
                const secret = JWT_SECRET 
                const payload = jwt.verify(token, secret)
                const { password, confirmP } = req.body
                const encryptedPassword = encrypt(password);
                if(password !== confirmP) {
                    return res.status(406).json("password tidak sama")
                }
                if(password == confirmP) {
                    user_games.update({
                        password: encryptedPassword,
                    }, {where: {id: req.params.id}})
                    .then(() => {
                        return res.status(202).json("berhasil ganti password")
                    })
                }
            }
        })
        
    }

    catch (err) {
        return res.stats(400).json(err)
    }
}


module.exports = {
    getFrogotP,
    forgotP,
    getResetP,
    resetP
}