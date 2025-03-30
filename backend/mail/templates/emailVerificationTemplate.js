const { eventNames } = require("../../models/section");

const otpTemplate = (otp, name) => {
	return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>OTP Verification Email</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            background-color: #f5f7fa;
            font-family: 'Poppins', sans-serif;
            line-height: 1.6;
            color: #4a4a4a;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            padding: 0;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .header {
            background: linear-gradient(135deg, #6e8efb, #a777e3);
            padding: 30px 0;
            text-align: center;
            color: white;
        }

        .logo {
            max-width: 180px;
            margin-bottom: 15px;
        }

        .content {
            padding: 30px;
        }

        h1 {
            font-size: 24px;
            font-weight: 600;
            margin: 0 0 20px;
            color: #2d3748;
        }

        p {
            margin: 0 0 15px;
            font-size: 15px;
            color: #4a5568;
        }

        .otp-container {
            margin: 30px 0;
            text-align: center;
        }

        .otp-code {
            display: inline-block;
            padding: 15px 30px;
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
            background: #f0f4f8;
            border-radius: 8px;
            letter-spacing: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .note {
            font-size: 14px;
            color: #718096;
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #a777e3;
        }

        .footer {
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #a0aec0;
            background: #f8fafc;
        }

        .support-link {
            color: #6e8efb;
            text-decoration: none;
            font-weight: 500;
        }

        .divider {
            height: 1px;
            background: #e2e8f0;
            margin: 25px 0;
        }

        .greeting {
            font-size: 16px;
            color: #4a5568;
            margin-bottom: 25px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        
        <div class="content">
            <p class="greeting">Hi ${name},</p>
            <p>Thank you for registering with StudyNotion. To complete your registration, please use the following One-Time Password (OTP) to verify your account:</p>
            
            <div class="otp-container">
                <div class="otp-code">${otp}</div>
            </div>
            
            <p class="note">This OTP is valid for 3 minutes. Please do not share this code with anyone for security reasons.</p>
            
            <div class="divider"></div>
            
            <p>If you didn't request this verification, you can safely ignore this email. Someone might have entered your email address by mistake.</p>
        </div>
        
        <div class="footer">
            Need help? Contact our support team at <a href="mailto:temp.everyplace040703@gmail.com" class="support-link">temp.everyplace040703@gmail.com</a>
            <p>© ${new Date().getFullYear()} StudyNotion. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
module.exports = otpTemplate;