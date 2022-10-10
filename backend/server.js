const app = require('./app')

const dotenv = require('dotenv')
const connect = require("./config/db.config")

dotenv.config()

connect()


app.listen(process.env.PORT, () => {
    console.log(`Server is up At ${process.env.PORT}`)
})

