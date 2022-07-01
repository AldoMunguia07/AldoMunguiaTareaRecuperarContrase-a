const express = require('express');
const CashFlowDao = require('../../../../dao/mongodb/models/CashFlowDao');
const CashFlow = require('../../../../libs/cashflow');

const router = express.Router();
const cashFlowDao = new CashFlowDao();
const cash = new CashFlow(cashFlowDao)

cash.init()

router.get('/all', async (req, res) => {
    try
    {
        console.log("CashFlow all: ", {user: req.user});
        console.log("Codigo: ", req.user.jwtUser._id);

        const cashflows = await cash.getCashFlows(req.user.jwtUser._id);
        return res.status(200).json(cashflows);

    } catch (ex)
    {
        console.error('Error Category', ex);
        return res.status(501).json({error: 'Error interno del servidor'});
    }
});

router.get('/page/:page/:limit', async (req, res) => {
    try
    {
        const {page, limit} = req.params;
        const _page = parseInt(page);
        const _limit = parseInt(limit);

        const cashflows = await cash.getPagedCashFlows(_page, _limit);
        return res.status(200).json(cashflows);

    } catch (ex)
    {
        console.error('Error Category', ex);
        return res.status(501).json({error: 'Error interno del servidor'});
    }
});

router.get('/summary', async (req, res) => {
    try
    {
        const cashflows = await cash.getCashFlowGroupedByType();
        return res.status(200).json(cashflows);

    } catch (ex)
    {
        console.error('Error', ex);
        return res.status(501).json({error: 'Error interno del servidor'});
    }
});

router.get('/byid/:codigo', async (req, res) =>{
    try {
        const {codigo} = req.params;
        if(!(/^(\d+)|([\da-f]{24})$/.test(codigo))) 
        {
            return res.status(400).json({
                error: 'Se espera un valor númerico'
            });
        }

        const registro = await cash.getCashFlowByID({codigo});
        return res.status(200).json(registro);

    } catch (error) {
        console.log(error);
        return res.status(501).json({error: "Error al procesar la solicitud"});

    }
});



router.post('/new', async(req,res) => {
    try {
        const {description, date, type, category, amount} = req.body;

        /*if(!categoria || /^\s*$/.test(categoria))
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
        }*/

        const newCashFlow = await cash.addCashFlow({description, date, type, category, amount});
        return res.status(200).json(newCashFlow);
    } catch (ex) {
        console.error(ex);
        return res.status(502).json({error:'Error al procesar solicitud'});

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

        const deletedCashFlow = await cash.deleteCashFlow({codigo})

        if(!deletedCashFlow)
        {
            return res.status(404).json({error: "Categoria no encontrada"});
        }

        return res.status(200).json({deleteCashFlow:deletedCashFlow});

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

        const FoundCashFlow = await cash.getCashFlowByIDD({codigo:parseInt(codigo)});

        if(!FoundCashFlow)
        {
            return res.status(404).json({error: "Cash Flow no encontrado"});
        }

        return res.status(200).json(FoundCashFlow);
    } catch(ex )
    {
        console.error(ex);
        res.status(500).json({error:'Error al procesar solicitud.'})
    }
});


module.exports = router;