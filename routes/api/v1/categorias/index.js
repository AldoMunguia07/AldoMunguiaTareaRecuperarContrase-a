const express = require('express');
const CategoryDao = require('../../../../dao/mongodb/models/CategoryDao');
const Category = require('../../../../libs/categorias');

const router = express.Router();

const catDao = new CategoryDao();
//const catDao2 = new CategoryDao();
const cat = new Category(catDao)
cat.init()

router.get('/', async (req, res) => {
    //extraer y validar datos del request
    //devolver la ejecución el controlador de esta ruta

    try
    {
        const versionData = await getCategoryVersion();
        return res.status(200).json(versionData);
    } catch (ex)
    {
        console.error('Error Category', ex);
        return res.status(502).json({'error': 'Error interno del servidor'});
    }
    // manejar el error que pueda tirar el controlador

}); // get

router.get('/all', async (req, res) => {
    try
    {
        const categories = await cat.getCategories()
        return res.status(200).json(categories);

    } catch (ex)
    {
        console.error('Error Category', ex);
        return res.status(501).json({error: 'Error interno del servidor'});
    }
})

router.get('/byid/:codigo', async (req, res) =>{
    try {
        const {codigo} = req.params;
        if(!(/^(\d+)|([\da-f]{24})$/.test(codigo))) 
        {
            return res.status(400).json({
                error: 'Se espera un valor númerico'
            });
        }

        const registro = await cat.getCategoryByID({codigo});
        return res.status(200).json(registro);

    } catch (error) {
        console.log(error);
        return res.status(501).json({error: "Error al procesar la solicitud"});

    }
});



router.post('/new', async(req,res) => {
    try {
        const {categoria, estado} = req.body;
        console.log(estado);
        if(!categoria || /^\s*$/.test(categoria))
        {
            return res.status(400).json({
                error: 'Se espera valor de categoria'
            });
        }
        if (!estado || !(/^(ACT)|(INA)$/.test(estado)))
        {
            return res.status(400).json({
                error: 'Se espera valor de estado en ACT o INA'
            });
        }

        //const newCategory = await addCategory({categoria,estado});
        const newCategory = await cat.addCategory({categoria,estado});
        return res.status(200).json(newCategory);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({error:'Error al procesar solicitud'});

    }
});

router.put('/update/:codigo', async(req,res) => {

    try
    {
        const{codigo} = req.params;

        if(!(/^(\d+)|([\da-f]{24})$/.test(codigo))) 
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }
        const {categoria, estado} = req.body;

        if(!categoria || /^\s*$/.test(categoria))
        {
            return res.status(400).json({
                error: 'Se espera valor de categoria'
            });
        }

        if (!estado || !(/^(ACT)|(INA)$/.test(estado)))
        {
            return res.status(400).json({
                error: 'Se espera valor de estado en ACT o INA'
            });
        }

        const updateResult = await cat.updateCategory({codigo, categoria, estado})

        if(!updateResult)
        {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        return res.status(200).json({updateCategory:updateResult});

    } catch(ex )
    {
        console.error(ex);
        res.status(500).json({error:'Error al procesar solicitud.'})
    }

});

router.delete('/delete/:codigo', async(req,res) => {

    try
    {
        const{codigo} = req.params;

        if(!(/^(\d+)|([\da-f]{24})$/.test(codigo))) 
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }

        const deletedCategory = await cat.deleteCategory({codigo})

        if(!deletedCategory)
        {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        return res.status(200).json({deleteCategory:deletedCategory});

    } catch(ex )
    {
        console.error(ex);
        res.status(500).json({error:'Error al procesar solicitud.'})
    }

});

router.get('/one/:codigo', async(req,res) => {

    try
    {
        const{codigo} = req.params;

        if(!(/^\d+$/.test(codigo)))
        {
            return res.status(400).json({error: 'El código debe ser un dígito válido'})
        }

        const FoundCategory = await getCategoryByID({codigo:parseInt(codigo)});

        if(!FoundCategory)
        {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        return res.status(200).json(FoundCategory);
    } catch(ex )
    {
        console.error(ex);
        res.status(500).json({error:'Error al procesar solicitud.'})
    }
});


module.exports = router;