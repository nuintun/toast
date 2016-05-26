/**
 * Created by nuintun on 2016/5/25.
 */

'use strict';

require('./css/toast.css');

var $ = require('./jquery');

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

function Toast(options){
  // 参数是字符串直接显示
  if ($.type(options) === 'string') {
    options = {
      message: arguments[0]
    };

    // 第二个参数是对象合并参数
    if ($.type(arguments[1]) === 'object') {
      options = $.extend(options, arguments[1]);
    }
  }

  options = $.extend({
    lock: false,
    type: 'loading',
    timeout: 3000,
    message: '言宜慢，心宜善。'
  }, options);

  this.toast = $(
    '<div class="ui-toast">' +
    '  <div>' +
    '    <div class="ui-toast-message ui-toast-type-' + options.type + '">' + options.message + '</div>' +
    '  </div>' +
    '</div>'
  );

  this.locked = false;
  this.options = options;
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
    this.options.lock && this.lock();
    this.toast.appendTo(document.body);

    return this;
  },
  hide: function (){
    this.unlock();
    this.toast.remove();

    return this;
  }
};

Toast.info = '';
Toast.ask = '';
Toast.warn = '';
Toast.success = '';
Toast.error = '';
Toast.loading = '';

new Toast().show().lock();

// 公开接口
module.exports = Toast;
