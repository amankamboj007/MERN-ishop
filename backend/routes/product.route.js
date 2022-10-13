const { getAllproduct, addProduct, getProduct, updateProduct, deleteProduct, addReview, getProductReview, deleteReview } = require('../controller/product.controller')
const { isUserAuthenticated, authorizeRole } = require('../middleware/auth')

const router = require('express').Router()

router.post('/product', isUserAuthenticated, authorizeRole("admin"), addProduct)
router.get('/products', getAllproduct)
router.get('/product/:id', getProduct)
router.put('/product/:id', isUserAuthenticated, authorizeRole("admin"), updateProduct)
router.delete('/product/:id', isUserAuthenticated, authorizeRole("admin"), deleteProduct)


router.put("/addReview", isUserAuthenticated, addReview)
router.get("/getProductReview",getProductReview)
router.delete("/review",isUserAuthenticated,deleteReview)

module.exports = router