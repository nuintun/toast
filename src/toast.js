/**
 * Created by nuintun on 2016/5/25.
 */

'use strict';

require('./css/toast.css');

var $ = require('./jquery');
var GUID = new Date().getTime();

var Mask = {
  reference: 0,
  mask: $('<div class="ui-toast-mask"></div>'),
  show: function (){
    if (Mask.reference === 0) {
      Mask.mask.appendTo(document.body);
    }

    Mask.reference++;
  },
  hide: function (){
    Mask.reference--;

    if (Mask.reference === 0) {
      Mask.mask.remove();
    }
  }
};

var Cache = {
  cache: {},
  key: function (key){
    return 'Toast-ID-' + key;
  },
  add: function (key, value){
    key = Cache.key(key);

    Cache.cache[key] = value;
  },
  remove: function (key){
    key = Cache.key(key);

    delete Cache.cache[key];
  },
  has: function (key){
    key = Cache.key(key);

    return Cache.cache.hasOwnProperty(key);
  },
  get: function (key){
    key = Cache.key(key);

    return Cache.cache[key]
  }
};

function Toast(message, options){
  message = message || '言宜慢，心宜善。';
  options = $.extend({ id: GUID, lock: false, type: 'info', timeout: 3000 }, options);
  options.timeout = Math.abs(options.timeout) >>> 0;

  if (Cache.has(options.id)) {
    Cache.get(options.id).hide();
  }

  this.events = {};
  this.locked = false;
  this.id = options.id;
  this.options = options;
  this.visibility = false;

  this.toast = $(
    '<div class="ui-toast">' +
    '  <div>' +
    '    <div class="ui-toast-message ui-toast-type-' + options.type + '">' + message + '</div>' +
    '  </div>' +
    '</div>'
  );

  this.show('INITIALIZE');

  Cache.add(options.id, this);
}

Toast.prototype = {
  lock: function (){
    Mask.show();

    this.locked = true;

    return this;
  },
  unlock: function (){
    if (this.locked) {
      Mask.hide();

      this.locked = false;
    }

    return this;
  },
  show: function (){
    if (!this.visibility) {
      var context = this;

      this.options.lock && this.lock();
      this.toast.appendTo(document.body);

      this.visibility = true;

      if (this.options.timeout > 0) {
        clearTimeout(this.timer);

        this.timer = setTimeout(function (){
          context.hide('TIMEOUT');
        }, this.options.timeout);
      }

      var args = [].slice.call(arguments, 0);

      args.unshift('show');

      this.emit.apply(this, args);
    }

    return this;
  },
  hide: function (){
    if (this.visibility) {
      this.unlock();
      this.toast.remove();

      this.visibility = false;

      clearTimeout(this.timer);

      var args = [].slice.call(arguments, 0);

      args.unshift('hide');

      this.emit.apply(this, args);
    }

    return this;
  },
  on: function (event, handler){
    this.events[event] = this.events[event]
      || $.Callbacks('memory stopOnFalse');

    this.events[event].add(handler);

    return this;
  },
  off: function (event, handler){
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
  emit: function (event){
    var data = [].slice.call(arguments, 1);

    this.events[event] = this.events[event]
      || $.Callbacks('memory stopOnFalse');

    this.events[event].fireWith(this, data);

    return this;
  }
};

Toast.query = function (id){
  return Cache.get(id);
};

Toast.info = '';
Toast.ask = '';
Toast.warn = '';
Toast.success = '';
Toast.error = '';
Toast.loading = '';

new Toast('正在加载数据...', { lock: true, type: 'loading' }).on('hide', function (){
  new Toast('言宜慢，心宜善。', { type: 'success' }).on('show', function (){
    console.log('显示：', '言宜慢，心宜善。', '>>>', '触发对象：', arguments[0]);
  }).on('hide', function (){
    console.log('隐藏：', '言宜慢，心宜善。', '>>>', '触发对象：', arguments[0]);
  });
});

// 公开接口
module.exports = Toast;
