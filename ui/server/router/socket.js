module.exports = function (req, res) {
  var app     = req.app,
      context = app.context;

  res.send(app.format('success', context.config('socket')))
}
