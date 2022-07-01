const express = require('express');
const { jwtsing } = require('../../../../libs/security');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const Usuario = require('../../../../libs/usuarios');
const router = express.Router();

const userDAO = new UsuarioDao();
const user = new Usuario(userDAO);

user.init();

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await user.getUsuarioByEmail({email});
        console.log(userData);
        if(!user.comparePasswords(password, userData.password) )
        {
            console.error('security login: ', {error:`Credenciales para usuario ${userData._id} ${userData.email} incorrectas.`});
            return res.status(403).json({ "error": "Credenciales no Válidas" });
        }

        const {password: passwordDb, created, updated, ...jwtUser} = userData;
        const jwtToken = await jwtsing({jwtUser, email, generated: new Date().getTime()});
        return res.status(200).json({token: jwtToken});

    } catch(ex)
    {
        console.error('security login: ', {ex});
        return res.status(500).json({"error":"No es posible procesar la solicitud."});
    }

});

router.post('/sigin', async(req,res) => {
    try {
        const {nombreCompleto, email, estado, avatar, password, fechaIngreso} = req.body;

        if(!nombreCompleto || /^\s*$/.test(nombreCompleto))
        {
            return res.status(400).json({
                error: 'Se espera valor de nombre'
            });
        }

        if(!email || /^\s*$/.test(email))
        {
            return res.status(400).json({
                error: 'Se espera valor de email'
            });
        }

        if (!estado || !(/^(ACT)|(INA)$/.test(estado)))
        {
            return res.status(400).json({
                error: 'Se espera valor de estado en ACT o INA'
            });
        }

        if(!avatar || /^\s*$/.test(avatar))
        {
            return res.status(400).json({
                error: 'Se espera valor de avatar'
            });
        }

        if(!password || /^\s*$/.test(password))
        {
            return res.status(400).json({
                error: 'Se espera valor de password'
            });
        }


        const newUser = await user.addUsuario({nombreCompleto, email, estado, avatar,password, fechaIngreso});
        
        return res.status(200).json(newUser);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({error:'Error al procesar solicitud'});

    }
});

module.exports = router;

