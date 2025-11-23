const Transaction = require('../models/Transaction');

const createTransaction = async (transactionData) => {
  try {
    const transaction = new Transaction({
      ...transactionData,
      userId: transactionData.userId
    });

    await transaction.save();
    return transaction.transactionId;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

module.exports = { createTransaction };

