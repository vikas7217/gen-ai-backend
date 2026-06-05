exports.notificationBody = {
  otpNotificationTemplate: (email, otp, userName, attachments) => ({
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; overflow: hidden;">
                        
                        <tr>
                            <td style="background-color: #2563eb; color: white; text-align: center; padding: 20px;">
                                <h2>OTP Verification</h2>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 30px;">
                                <p>Hello ${userName},</p>

                                <p>
                                    We received a request to verify your account.
                                    Please use the following One-Time Password (OTP):
                                </p>

                                <div style="text-align: center; margin: 30px 0;">
                                    <span style="
                                        display: inline-block;
                                        padding: 15px 30px;
                                        font-size: 28px;
                                        font-weight: bold;
                                        letter-spacing: 5px;
                                        background-color: #f3f4f6;
                                        border-radius: 8px;
                                        color: #2563eb;
                                    ">
                                        ${otp}
                                    </span>
                                </div>

                                <p>
                                    This OTP is valid for <strong>5 minutes</strong>.
                                </p>

                                <p>
                                    If you did not request this OTP, please ignore this email.
                                </p>

                                <br>

                                <p>
                                    Regards,<br>
                                    <strong>Your Company Name</strong>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
                                © ${new Date().getFullYear()} Your Company Name. All rights reserved.
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `,
    attachments: attachments ? attachments : [],
  }),

  getForgotPasswordOtpTemplate: (email, otp, userName) => ({
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP is ${otp}. This OTP is valid for 5 minutes.`,
    html: `
      <h2>Password Reset OTP</h2>
      <p>Hello ${userName},</p>
      <p>Use the following OTP to reset your password:</p>

      <div style="
        text-align:center;
        font-size:32px;
        font-weight:bold;
        letter-spacing:5px;
        margin:20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `,
  }),

  getPasswordChangedTemplate: (email, userName) => ({
    to: email,
    subject: "Password Changed Successfully",
    text: `
Hello ${userName},

Your account password was changed successfully.

If you made this change, no further action is required.

If you did not change your password, please contact support immediately and secure your account.

Regards,
Your Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #16a34a;">
          Password Changed Successfully
        </h2>

        <p>Hello ${userName},</p>

        <p>
          This email confirms that your account password has been changed successfully.
        </p>

        <div style="
          background-color: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 15px;
          margin: 20px 0;
        ">
          <strong>✓ Password Updated</strong><br>
          Your new password is now active.
        </div>

        <p>
          If you made this change, you can safely ignore this email.
        </p>

        <p>
          If you did <strong>not</strong> change your password, your account may be at risk.
          Please contact support immediately and reset your password.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Your Team</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;">

        <p style="font-size: 12px; color: #666;">
          This is an automated security notification. Please do not reply to this email.
        </p>
      </div>
    `,
  }),
};
