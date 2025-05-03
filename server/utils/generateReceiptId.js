const generateReceiptId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    return `RCP-${timestamp}-${randomNum}`;
};

module.exports = generateReceiptId;
