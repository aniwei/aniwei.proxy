var main = {
  navigation: [
    {icon: 'menu', label: '代理', scene: 'Home', title: 'Home'},
    {icon: 'explore', label: '发现', scene: 'Explore', title: 'Explore'},
    {icon: 'settings', label: '设置', scene: 'Setting', title: 'Setting'},
    {icon: 'account_circle', label: '关于', scene: 'About', title: 'About'}
  ],
  navigationItem: 0,
  home: {}
}

module.exports = function (req, res) {
  var app     = req.app,
      context = app.context,
      about   = {},
      explore = [],
      headers = req.headers,
      agent   = JSON.parse(req.query.agent || ''),
      angle   = agent.orientation,
      height,
      width;

  ['author', 'version', 'organization', 'organizationUnit', 'project'].forEach(function(key){
    var value = context.config(key);

    about[key] = {
      key:  key,
      value: value
    }
  });

  if (angle == 0 || angle == 180 || angle == -180) {
    width   = agent.width;
    height  = agent.height;
  } else {
    width   = agent.hegiht;
    height  = agent.height; 
  }

  if (width > 768) {
    main.width      = 768;
    main.home.table = ['ID', 'STATUS','URL', 'HOST', 'IP' ];
  } else {
    main.width = width;
    main.home.table = ['ID', 'STATUS','URL'];
  }

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
