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
  node: $('<div role="tooltip" class="ui-toast-mask" tableindex="0"></div>'),
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
  var context = this;

  if (!(context instanceof Toast)) return new Toast(message, options);

  message = message || '言宜慢，心宜善。';
  options = $.extend({ id: GUID, lock: false, type: 'info', timeout: 3000 }, options);
  options.timeout = Math.abs(Number(options.timeout));
  options.timeout = isNaN(options.timeout) ? 3000 : options.timeout;

  if (Cache.has(options.id)) {
    Cache.get(options.id).hide('DUPLICATE');
  }

  context.events = {};
  context.locked = false;
  context.id = options.id;
  context.options = options;
  context.visibility = false;
  context.type = options.type;

  context.toast = $(
    '<div class="ui-toast ui-toast-type-' + options.type + '">' +
    '  <div>' +
    '    <div class="ui-toast-message">' + message + '</div>' +
    '  </div>' +
    '</div>'
  );

  context.show('INITIALIZE');

  Cache.add(options.id, context);
}

Toast.prototype = {
  lock: function() {
    var context = this;

    Mask.show(context.toast);

    context.locked = true;

    emit(context, 'lock', arguments);

    return context;
  },
  unlock: function() {
    var context = this;

    if (context.locked) {
      Mask.hide(context.toast);

      context.locked = false;

      emit(context, 'unlock', arguments);
    }

    return context;
  },
  show: function() {
    var context = this;

    if (!context.visibility) {
      context.toast.appendTo(document.body);
      context.options.lock && context.lock.apply(context, arguments);

      context.visibility = true;

      if (context.options.timeout > 0) {
        clearTimeout(context.timer);

        context.timer = setTimeout(function() {
          context.hide('TIMEOUT');
        }, context.options.timeout);
      }

      emit(context, 'show', arguments);
    }

    return context;
  },
  hide: function() {
    var context = this;

    if (context.visibility) {
      context.unlock.apply(context, arguments);
      context.toast.remove();

      context.visibility = false;

      clearTimeout(context.timer);

      emit(context, 'hide', arguments);
    }

    return context;
  },
  on: function(event, handler) {
    var context = this;

    context.events[event] = context.events[event] ||
      $.Callbacks('memory stopOnFalse');

    context.events[event].add(handler);

    return context;
  },
  off: function(event, handler) {
    var context = this;

    switch (arguments.length) {
      case 0:
        context.events = {};
        break;
      case 1:
        delete context.events[event];
        break;
      default:
        context.events[event] && context.events[event].remove(handler);
        break;
    }

    return context;
  },
  emit: function(event) {
    var context = this;
    var data = [].slice.call(arguments, 1);

    context.events[event] = context.events[event] ||
      $.Callbacks('memory stopOnFalse');

    context.events[event].fireWith(context, data);

    return context;
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
