var timelinePrototype;


timelinePrototype = {
  begin: function () {
    this.current.begin = +new Date;
  },
  end: function () {
    var current = this.current;

    current.end     = +new Date;
    current.delay   = current.end - current.begin;
  },
  all: function () {
    return this.timelines;
  }
}

function createTimeline () {
  var line = function (keyName) {
    var tl = line.timelines[keyName];

    if (keyName === undefined) {
      return line;
    }

    if (!tl) {
      line.timelines[keyName] = tl = {begin: 0, end: 0, delay: 0};
    }

    line.current = tl;

    return line;
  }

  line.timelines = {};
  line.current   = null;

  line.__proto__ = timelinePrototype;

  return line;
}

module.exports = function () {
  return createTimeline()
}
