var main = {
  navigation: [
    {icon: 'menu', label: '代理', scene: 'Home', title: 'Home'},
    {icon: 'explore', label: '发现', scene: 'Explore', title: 'Explore'},
    {icon: 'settings', label: '设置', scene: 'Setting', title: 'Setting'},
    {icon: 'account_circle', label: '关于', scene: 'About', title: 'About'}
  ],
  navigationItem: 0
}

module.exports = function (req, res) {
  var app     = req.app,
      context = app.context,
      about   = {},
      explore = [];

  ['author', 'version', 'organization', 'organizationUnit', 'project'].forEach(function(key){
    var value = context.config(key);

    about[key] = {
      key:  key,
      value: value
    }
  });

  about.moreMenuItem = [
    {text: '下载证书', value: 'Download'},
    {text: '帮助', value: 'Help'}
  ];

  explore = {
    components: [
      {title: '中间件', data: context.config('the components')}
    ]
  }

  main.about    = about;
  main.explore  = explore;
  main.socket   = context.config('socket')

  res.send(app.format('success', main));
}
