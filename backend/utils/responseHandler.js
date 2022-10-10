let successResposne = (params, message, token) => {
    let response = {};
    if (token) {
        response.token = token
    }
    response.status = 200
    response.message = message
    response.success = "true"
    response.data = params ? params : {}
    return response
}
let errorResponse = (error, errorCode) => {
    let response = {}
    console.log(error, errorCode)
    response.message = error
    response.status = errorCode
    response.errorCode = errorCode
    response.success = "false"

    if (error.code && (error.code = 11000)) {
        response.message = `Duplicate ${Object.keys(error.keyPattern)} Entered`
    }
    if (error.message == "JsonWebTokenError") {
        response.message = "JWT is invalid, try again"
    }
    if (error.message == "TokenExpiredError") {
        response.message = "JWT is Expired, try again"
    }
    return response
}

let sendResposneWithCookie = (res, params, message, token) => {
    let response = {};
    if (token) {
        response.token = token
    }
    response.status = 200
    response.message = message
    response.success = "true"
    response.data = params ? params : {}

    let cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.cookie('token', token, cookieOptions)

    return response


}

module.exports = {
    successResposne,
    errorResponse,
    sendResposneWithCookie
}