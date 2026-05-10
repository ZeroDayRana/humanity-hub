const Brevo = require("@getbrevo/brevo");

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

const sendForgotPasswordMail = async (toEmail, resetLink) => {
    try {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.sender = { name: "Mohit", email: "xyz123@example.com" };
        sendSmtpEmail.to = [{ email: toEmail }];
        sendSmtpEmail.subject = "Password Reset Request";
        sendSmtpEmail.htmlContent = `
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}">Reset Password</a>
        `;
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return response;
    }
    catch (e) {
        console.log(e);
        throw new Error("Failed to send password reset email");
    }
};

module.exports = { sendForgotPasswordMail };