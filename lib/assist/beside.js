module.exports = function (altname) {
  var beside = this.config('besideAltnames')

  if (!beside) {
    //inset midway
    this.config({
      key:    'besideAltnames',
      value:  beside = [],
      text:   '过滤域名'
    })
  }

  beside.push(altname)
}
