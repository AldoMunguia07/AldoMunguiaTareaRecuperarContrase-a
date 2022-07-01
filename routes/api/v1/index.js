const express = require('express');
const router = express.Router();

const { authorizer } = require('./middlewares/authorizer');
const {jwtAuthorizer} = require('./middlewares/jwtAuthorizer');
const securityRoutes = require('./security');
const categoriesRoutes = require('./categorias')
const cashFlowsRoutes = require('./cashflow')
const userRoutes = require('./usuarios');

router.use('/categories', authorizer, jwtAuthorizer, categoriesRoutes);
router.use('/cashflow', authorizer, jwtAuthorizer, cashFlowsRoutes);
router.use('/users', userRoutes);
router.use('/security', securityRoutes);

module.exports = router;
