const nodeMailer = require("nodemailer")


const sendEmail = async (options) => {
    let transporter = nodeMailer.createTransport({
        service: SMTP_SERVICE,
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.FROM_EMAIL_PASS
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