module.exports = class CustomError {
  constructor(status, message) {
    return { status, message };
  }
};
