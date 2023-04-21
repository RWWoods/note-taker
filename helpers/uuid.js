
// this provides a random set of four letters or numbers to use as a uuid for our notes.
module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);