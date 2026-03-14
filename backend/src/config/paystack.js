const axios = require("axios");

const verifyPayment = async (reference) => {
  const url = `https://api.paystack.co/transaction/verify/${reference}`;
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  });
  return data;
};

module.exports = verifyPayment;
