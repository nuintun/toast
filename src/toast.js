/**
 * Created by nuintun on 2016/5/25.
 */

'use strict';

require('./css/toast.css');

var $ = require('jquery');

var GUID = new Date().getTime();

var Mask = {
  // 遮罩分配
  alloc: [],
  // 遮罩节点
  node: $('<div class="ui-dialog-mask" tableindex="0"></div>'),
  /**
   * 显示遮罩
   * @param {HTMLElement} anchor 定位节点
   */
  show: function(anchor) {
    if ($.inArray(anchor, Mask.alloc) === -1) {
      Mask.alloc.push(anchor);
      Mask.node.insertBefore(anchor);
    }
  },
  /**
   * 隐藏遮罩
   * @param {HTMLElement} anchor 定位节点
   */
  hide: function(anchor) {
    Mask.alloc = $.grep(Mask.alloc, function(element) {
      return anchor !== element;
    });

    var length = Mask.alloc.length;

    if (length === 0) {
      Mask.node.remove();
    } else {
      Mask.node.insertBefore(Mask.alloc[length - 1]);
    }
  }
};

var Cache = {
  items: {},
  add: function(key, value) {
    Cache.items[key] = value;
  },
  remove: function(key) {
    delete Cache.items[key];
  },
  has: function(key) {
    return Cache.items.hasOwnProperty(key);
  },
  get: function(key) {
    return Cache.items[key];
  }
};

function emit(context, event, args) {
  [].unshift.call(args, event, event);

  context.emit.apply(context, args);
}

function Toast(message, options) {
  if (!(this instanceof Toast)) return new Toast(message, options);

  message = message || '言宜慢，心宜善。';
  options = $.extend({ id: GUID, lock: false, type: 'info', timeout: 3000 }, options);
  options.timeout = Math.abs(Number(options.timeout));
  options.timeout = isNaN(options.timeout) ? 3000 : options.timeout;

  if (Cache.has(options.id)) {
    Cache.get(options.id).hide('DUPLICATE');
  }

  this.events = {};
  this.locked = false;
  this.id = options.id;
  this.options = options;
  this.visibility = false;
  this.type = options.type;

  this.toast = $(
    '<div class="ui-toast ui-toast-type-' + options.type + '">' +
    '  <div>' +
    '    <div class="ui-toast-message">' + message + '</div>' +
    '  </div>' +
    '</div>'
  );

  this.show('INITIALIZE');

  Cache.add(options.id, this);
}

Toast.prototype = {
  lock: function() {
    Mask.show(this.toast);

    this.locked = true;

    emit(this, 'lock', arguments);

    return this;
  },
  unlock: function() {
    if (this.locked) {
      Mask.hide(this.toast);

      this.locked = false;

      emit(this, 'unlock', arguments);
    }

    return this;
  },
  show: function() {
    if (!this.visibility) {
      var context = this;

      this.toast.appendTo(document.body);
      this.options.lock && this.lock.apply(this, arguments);

      this.visibility = true;

      if (this.options.timeout > 0) {
        clearTimeout(this.timer);

        this.timer = setTimeout(function() {
          context.hide('TIMEOUT');
        }, this.options.timeout);
      }

      emit(this, 'show', arguments);
    }

    return this;
  },
  hide: function() {
    if (this.visibility) {
      this.unlock.apply(this, arguments);
      this.toast.remove();

      this.visibility = false;

      clearTimeout(this.timer);

      emit(this, 'hide', arguments);
    }

    return this;
  },
  on: function(event, handler) {
    this.events[event] = this.events[event] ||
      $.Callbacks('memory stopOnFalse');

    this.events[event].add(handler);

    return this;
  },
  off: function(event, handler) {
    switch (arguments.length) {
      case 0:
        this.events = {};
        break;
      case 1:
        delete this.events[event];
        break;
      default:
        this.events[event] && this.events[event].remove(handler);
        break;
    }

    return this;
  },
  emit: function(event) {
    var data = [].slice.call(arguments, 1);

    this.events[event] = this.events[event] ||
      $.Callbacks('memory stopOnFalse');

    this.events[event].fireWith(this, data);

    return this;
  }
};

Toast.query = Cache.get;

$.each(['info', 'ask', 'warn', 'success', 'error', 'loading'], function(index, type) {
  Toast[type] = function(message, options) {
    return new Toast(message, $.extend({}, options, { type: type }));
  };
});

// 公开接口
module.exports = Toast;
