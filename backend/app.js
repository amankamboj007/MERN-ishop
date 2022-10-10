const cookieParser = require('cookie-parser')
const express = require('express')

const app = express()

app.use(express.json())
app.use(cookieParser())
//ROUTE 

const productRoutes = require('./routes/product.route')
const userRoutes = require("./routes/userRoutes")

app.use('/api/v1', productRoutes)
app.use('/api/v1/user', userRoutes)


module.exports = app