// In-memory coupons for demo. In production store in DB.
const coupons = [
{ code: 'SAVE10', type: 'flat', amount: 10 },
{ code: 'PERC20', type: 'percent', amount: 20 }
];


function validateCoupon(code) {
if (!code) return null;
const c = coupons.find(x => x.code === code.toUpperCase());
if (!c) return null;
return c;
}


module.exports = { validateCoupon };