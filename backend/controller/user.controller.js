const userModel = require("../models/userModel");
const { successResposne, errorResponse, sendResposneWithCookie } = require("../utils/responseHandler");
const { sendEmail } = require("../utils/email")
const crypto = require('crypto')

exports.registerUser = async (req, res) => {
    let resp;
    try {
        let { name, email, password } = req.body
        let user = {
            name,
            email,
            password,
            avatar: {
                public_id: "Sample id",
                url: "Sample url"
            }
        }
        let userCreated = await userModel.create(user)
        const token = userCreated.getJWTToken()
        resp = successResposne({}, "User created successfully", token)
    } catch (error) {
        console.log(error)
        resp = errorResponse(error, 400)
    }
    res.send(resp).status(resp.status)
}

exports.login = async (req, res) => {
    let resp;
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw ("Email and Password should be entered")
        }
        const user = await userModel.findOne({ email: email }).select("+password")
        if (!user) {
            throw ("Email or password invalid")
        }
        const isPasswordMatched = await user.comparePassword(password)
        if (!isPasswordMatched) {
            throw ("Email or password invalid")
        }
        const token = user.getJWTToken()

        resp = sendResposneWithCookie(res, user, "User logged in", token)
    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 401)
    }
    res.status(resp.status).send(resp)
}

exports.logout = (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now()), httpOnly: true })
    res.send(successResposne({}, "Logged Out")).status(200)
}

exports.forgotPassword = async (req, res) => {
    let resp;
    try {
        let user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            throw ("User does not exists")
        }
        let resetToken = user.createResetPasswordToken()
        await user.save({ validateBeforeSave: false })

        let resetUrl = `${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`

        const message = `Your password token is : ${resetUrl} valid for 15 mins, if not requested please ignore `
        await sendEmail({
            email: user.email,
            title: "Forgot password link",
            message,
        })
        resp = successResposne({}, "Mail sent successfully")
    } catch (error) {
        //     user.resetPasswordToken = null;
        //     user.resetPasswordExpire = null;
        // await user.save({ validateBeforeSave: fasle })
        resp = errorResponse(error || error.message, 400)
    }
    res.status(resp.status).send(resp)
}

exports.resetPassword = async (req, res) => {
    let resp;
    try {
        let resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        let user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!user) {
            throw ("Reset Password Token can be invalid or exprired")
        }

        if (req.body.password !== req.body.confirmPassword) {
            throw ("Password does not matched")
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined
        user.save()

        let token = user.getJWTToken()

        resp = sendResposneWithCookie(res, user, "Password changed successfully", token)

    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

exports.myProfile = async (req, res) => {
    let resp;
    try {
        let userDetail = await userModel.findOne({ _id: req.user.id })
        resp = successResposne(userDetail, "profile fetched")
    } catch (error) {
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}

exports.updatePassword = async (req, res) => {
    let resp;
    try {
        let user = await userModel.findOne({ _id: req.user.id }).select("+password")
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword)
        if (!isPasswordMatched) {
            throw ("Password entered incorrect ")
        }
        if (req.body.password != req.body.confirmPassword) {
            throw ("password not matched")
        }

        user.password = req.body.password
        user.save()

        let token = user.getJWTToken()

        resp = sendResposneWithCookie(res, user, "Password updated", token)

    } catch (error) {
        console.log(error)
        resp = errorResponse(error || error.message, 400)
    }
    res.send(resp).status(resp.status)
}