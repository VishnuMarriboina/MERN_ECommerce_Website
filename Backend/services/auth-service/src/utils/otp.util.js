const generateOTP = (length = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) otp += Math.floor(Math.random() * 10);
  return otp;
};

const getOTPExpiry = (minutes = 10) => new Date(Date.now() + minutes * 60 * 1000);

module.exports = { generateOTP, getOTPExpiry };
