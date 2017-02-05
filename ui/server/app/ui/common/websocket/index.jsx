var Emitter = require('events').Emitter;

export default {
  __proto__: Emitter.prototype,
  connection: null,
  connect: function (uri) {
    var connection = new WebSocket(uri);

    connection 
  }
}