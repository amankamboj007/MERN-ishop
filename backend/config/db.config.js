const mongoose = require('mongoose')


const connect = () => {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then((data) => {
        console.log(`Db connected`)
    }).catch((err) => {
        console.log(err)
    })

}


module.exports = connect