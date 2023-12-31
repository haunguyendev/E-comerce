require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()


// console.log(process.env);


//init middlewares
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// console.log(`Process::`, process.env)
//test pub.sub redis
require('./tests/inventory.test.js')
const productTest = require('./tests/product.test.js')
productTest.purchaseProduct('product:001', 10)


//init db
require('./dbs/init.mongodb.js')
// const { checkOverload } = require('./helpers/check.connect.js')
// checkOverload()

//init routes
app.use('/', require('./routes/index.js'))

//handling error

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
}
)
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'

    })

})

module.exports = app