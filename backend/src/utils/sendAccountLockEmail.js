const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "smtp.gmail.com",
      post: 587,
      secure: false,
      auth: {
        user: "utc2nckh@gmail.com",
        pass: "lacj gvrc tion qdie",
      },
    });

    // Nội dung email
    let mailOptions = {
      from: {
        name: "UTC2 Social",
        address: "utc2nckh@gmail.com",
      },
      to: email,
      subject: "Thông báo khóa tài khoản UTC2 Social",
      html: `
       <div style="font-family: Arial, sans-serif; display: inline-block; background-color: #f9f9f9; padding: 20px;">
        <div style="display: inline-block; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333333;">Thông báo khóa tài khoản</h2>
          <p style="color: #555555; font-size: 16px;">
            Tài khoản của bạn đã bị khóa do phát hiện hoạt động bất thường hoặc vi phạm chính sách của chúng tôi.
          </p>
          <p style="color: #555555; font-size: 16px;">
            Nếu bạn cho rằng đây là sự nhầm lẫn, vui lòng liên hệ với đội hỗ trợ để được hỗ trợ thêm.
          </p>
          <p style="color: #333333; font-size: 16px; font-weight: bold;">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </p>
        </div>
      </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
