module.exports = (phone, amount) => {
  if (amount > 50000) {
    console.log(` Alert: Monthly expense exceeded for ${phone}. Total: ₹${amount}`);
  }
};