const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    role: { type: String, required: true },
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;