const nodeMailer = require("nodemailer")


const sendEmail = async (options) => {
    let transporter = nodeMailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "ishop.mern@gmail.com",
            pass: "nmxcblbrgmhlmkqq"
        }

    })
    let mailConfig = {
        from: "ishop.mern@gmail.com",
        to: options.email,
        subject: options.title,
        text: options.message
    }

    await transporter.sendMail(mailConfig)

}

module.exports = {
    sendEmail
}