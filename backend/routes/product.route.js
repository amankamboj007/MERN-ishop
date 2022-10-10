const { getAllproduct, addProduct, getProduct, updateProduct, deleteProduct } = require('../controller/product.controller')
const { isUserAuthenticated, authorizeRole } = require('../middleware/auth')

const router = require('express').Router()

router.post('/product', isUserAuthenticated, authorizeRole("admin"), addProduct)
router.get('/products', getAllproduct)
router.get('/product/:id', getProduct)
router.put('/product/:id', isUserAuthenticated, authorizeRole("admin"), updateProduct)
router.delete('/product/:id', isUserAuthenticated, authorizeRole("admin"), deleteProduct)


module.exports = router