class Unautorized extends Error {
  constructor(message) {
    super();

    this.message = message;
    this.status = ('401');
  }
}

module.exports = Unautorized;
