var table;

table = {
  unknown: {
    code: 10000,
    message: 'unknown error'
  },
  success: {
    code: 0,
    message: 'success'
  }
}

module.exports = {
  table: table,
  set: function (key, code, description) {
    this.table[key] = {
      code: code,
      message: description
    }
  },
  get: function (key) {
    return this.table[key];
  }
}
