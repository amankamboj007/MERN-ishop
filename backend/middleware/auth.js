const { errorResponse } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


exports.isUserAuthenticated = async (req, res, next) => {
    try {
        let { token } = req.cookies;
        if (!token) {
            throw ("Please Login before accessing it")
        }
        console.log(token)

        let decodedData = jwt.verify(token, process.env.JWT_SECRET)

        let user = await userModel.findOne({ _id: decodedData.id })
        if (!user) {
            throw ("User Not found")
        }
        req.user = user
        next()
    } catch (error) {
        let response = errorResponse(error, 401)
        res.status(response.status).send(response)
    }
}

exports.authorizeRole = (...roles) => (req, res, next) => {
    try {
        if (!roles.includes(req.user.role)) {
            throw ("Role is not authorized ")
        }
        next()
    } catch (error) {
        let response = errorResponse(error || error.message, 401)
        res.status(response.status).send(response)
    }


}