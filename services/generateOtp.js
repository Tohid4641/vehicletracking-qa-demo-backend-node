// Generate OTP (replace this with your own OTP generation code)
exports.generateOtp = () => {
    // Generate OTP logic goes here
    // Replace this with your own OTP generation code
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}