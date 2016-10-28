

module.exports = function (req, res) {
  var context = req.context,
      data;

  data = {
    author: context.config('author'),
    version: context.config('version'),
    origanization: context.config('origanization'),
    origanizationUnit: context.config('origanizationUnit')
  }

  res.writeHead(200);

  res.send(app.format('success', data))
}
