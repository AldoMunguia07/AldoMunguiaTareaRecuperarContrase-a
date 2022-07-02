const express = require('express');
const router = express.Router();
const { jwtSingReset } = require('../../../../libs/security');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const Usuario = require('../../../../libs/usuarios');
const Mail = require('../../../../libs/mailer/index');
var {jwtVerifyRecovery} = require('../../../../libs/security');

const userDAO = new UsuarioDao();
const user = new Usuario(userDAO);
const mail = new Mail();
user.init();

router.post('/recovery', async (req,res) => {

    try {
        const {email} = req.body;

        if(!email || /^\s*$/.test(email))
        {
            return res.status(400).json({
                error: 'Se espera valor de Email'
            });
        }
        const userData = await user.getUsuarioByEmail({email});
        console.log(userData);

        if(userData)
        {
            const {password: passwordDb, created, updated, ...jwtUser} = userData;
            const codigo = jwtUser._id;
            const correo = jwtUser.email;
            const jwtToken = await jwtSingReset({codigo, email, generated: new Date().getTime()});
            const token = jwtToken;
            const resetToken = await user.UpdateToken({codigo, token});

            if(resetToken)
            {

                mail.sendMail(correo,token);

                return res.status(200).json('Revise su correo electronico');
            }

            return res.status(404).json('Ha ocurrido un error');
        }
        return res.status(400).json('Usuario no encontrado');

    } catch(ex)
    {
        console.error('security login: ', {ex});
        return res.status(500).json({"error":"No es posible procesar la solicitud."});
    }


});

router.put('/reset', async (req,res) => {


    try {
        const {token, password} = req.body;

        if(!password || /^\s*$/.test(password))
        {
            return res.status(400).json({
                error: 'Se espera valor de password'
            });
        }

        if(!token || /^\s*$/.test(token))
        {
            return res.status(400).json({
                error: 'Se espera valor de token'
            });
        }
        const userData = await user.getUsuarioByToken({token});
        const verify = await jwtVerifyRecovery(token);

        if(verify)
        {
            if(userData)
            {
                codigo = userData._id;
                const changePassword = await user.UpdatePassword({codigo, password});

                if(changePassword)
                {
                    return res.status(200).json('La contraseña ha sido cambiada');
                }
            }
            return res.status(401).json('Usuario con este token no existe');
        }

        return res.status(401).json('El token es invalido o ha expirado');



    } catch(ex)
    {
        console.error('security login: ', {ex});
        return res.status(500).json({"error":"No es posible procesar la solicitud."});
    }



});

module.exports = router;