import events from 'events';

export default function Socket (namespace, connection) {
  this.connection = connection;
  this.namespace  = namespace + '/';
}

Socket.prototype = {
  __proto__: events.EventEmitter.prototype,

  on: function (name, handle) {
    this.connection.on(`${this.namespace}${name}`, handle);

    return this;
  },

  off: function (name, handle) {
    this.connection.off(`${this.namespace}${name}`, handle);

    return this;
  },

  once: function (name, handle) {
    this.connection.once(`${this.namespace}${name}`, handle);

    return this;
  },

  emit: function () {
    this.connection.emit.apply(this.connection, arguments);

    return this;
  }
}