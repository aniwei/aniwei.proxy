var socketTable = [],
    isReady     = false,
    slice       = socketTable.slice;

module.exports = function (namespace) {
  var socket = new Socket(namespace);

  if (!isReady) {
    socketTable.push(socket);
  }
  
  return socket;
};

module.exports.already = function (socket) {
  var soc;

  isReady = true;

  while(soc = socketTable.pop()) {
    soc.already(socket);
  }
}

function Socket (namespace) {
  this.namespace    = namespace + '/';
  this.messageTable = [];
  this.socket       = null;
}

Socket.prototype = {
  already: function (socket) {
    var ref,
        type;

    this.socket = socket;

    while (ref = this.messageTable.pop()) {
      switch (type = ref.type) {
        case 'on':
        case 'once':
        case 'off':
          this.socket[type](ref.namespace, ref.handle);  
          break;
        case 'emit':
          this.socket[type].apply(this.socket, ref.argv);  
          break;
      }
    }
  },

  once: function (name, handle) {
    var namespace = this.namespace + name;

    if (isReady) {
      this.socket.once(namespace, handle);

      return this;
    }

    this.messageTable.push({
      type:       'once',
      handle:     handle,
      namespace:  namespace
    });

    return this;
  },

  off: function (name, handle) {
    var namespace = this.namespace + name,
        table     = [];

    if (isReady) {
      this.socket.off(namespace, handle);

      return this;
    }

    this.messageTable.filter(function (object) {
      if (object.namespace == namespace) {
        if (handle === undefined) {
          return true;
        }

        if (object.handle === handle) {
          return true;
        }
      }

      table.push(object);
    });

    this.messageTable = table;

    return this;
  },

  on: function (name, handle) {
    var namespace = this.namespace + name;

    if (isReady) {
      this.socket.on(namespace, handle);

      return this;
    }

    this.messageTable.push({
      type:       'on',
      handle:     handle,
      namespace:  namespace
    });

    return this;
  },

  emit: function (name) {
    var namespace = this.namespace + name,
        argv      = slice.call(arguments, 1);

    if (isReady) {
      this.socket.emit.apply(this.socket, [namespace].concat(argv));

      return this;
    }

    this.messageTable.push({
      type:       'on',
      namespace:  namespace,
      argv:       argv
    });

    return this;
  }
}