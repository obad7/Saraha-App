
export const signUpHTML = (link , name) => 
`
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Template</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f9f9f9;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    background: #4CAF50;
                    color: white;
                    padding: 10px 0;
                    border-radius: 5px 5px 0 0;
                }
                .email-body {
                    margin: 20px 0;
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333333;
                }
                .email-body .activation-button {
                    display: inline-block;
                    padding: 10px 15px;
                    margin: 10px 0;
                    color: #ffffff;
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .email-footer {
                    text-align: center;
                    font-size: 12px;
                    color: #777777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Activate Your Account</h1>
                </div>
                <div class="email-body">
                    <h2>Hello ${name},</h2>
                    <p>Thank you for signing up with [Your Company Name]. To complete your registration and start using your account, please click the button below:</p>
                    <a href="${link}" class="activation-button">Activate My Account</a>
                    <p>If you did not sign up for this account, please ignore this email.</p>
                    <p>Best regards,<br>Sara7a Team</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 [Your Company Name]. All rights reserved.</p>
                    <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
                </div>
            </div>
        </body>
    </html>
`