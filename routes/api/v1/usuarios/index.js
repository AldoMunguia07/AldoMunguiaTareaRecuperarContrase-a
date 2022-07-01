const express = require('express');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const Usuario = require('../../../../libs/usuarios');
const router = express.Router();


const userDAO = new UsuarioDao();
const user = new Usuario(userDAO);

user.init();

router.get('/all', async (req, res) => {
    try
    {
        const users = await user.getUsuarios()

        if(!users)
        {
            return res.status(404).json({error: "usuarios no encontrados"});
        }
        return res.status(200).json(users);

    } catch (ex)
    {
        console.error('Error User', ex);
        return res.status(501).json({error: 'Error interno del servidor'});
    }
})

router.post('/new', async(req,res) => {
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


router.put('/update/:codigo', async(req,res) => {
    try {
        const {codigo} = req.params;
        const {nombreCompleto, email, estado, avatar, password, fechaIngreso} = req.body;

        if (!(/^(\d+)|([\da-f]{24})$/.test(codigo)))
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }

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


        const updUser = await user.updateUsuario({codigo, nombreCompleto, email, estado, avatar, password, fechaIngreso});
        return res.status(200).json(updUser);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({error:'Error al procesar solicitud'});

    }
});

router.delete('/delete/:codigo', async(req,res) => {
    try {
        const {codigo} = req.params;

        if (!(/^(\d+)|([\da-f]{24})$/.test(codigo)))
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }


        const delUser = await user.deleteUsuario({codigo});
        return res.status(200).json(delUser);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({error:'Error al procesar solicitud'});

    }
});

router.get('/one/:codigo', async(req,res) => {

    try
    {
        const{codigo} = req.params;

        if (!(/^(\d+)|([\da-f]{24})$/.test(codigo)))
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }

        const FoundUser = await user.getUsuarioByID({codigo});

        if(!FoundUser)
        {
            return res.status(404).json({error: "Usuario no encontrado"});
        }

        return res.status(200).json(FoundUser);
    } catch(ex )
    {
        console.error(ex);
        res.status(500).json({error:'Error al procesar solicitud.'})
    }
});


module.exports = router;