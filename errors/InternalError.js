class InternalError extends Error {
  constructor(message) {
    super(message);
    this.status = 500;
    this.message = message;
  }
}

module.exports = InternalError;
