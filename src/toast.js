/**
 * Created by nuintun on 2016/5/25.
 */

'use strict';

require('./css/toast.css');

var $ = require('./jquery');

var mask = $('<div class="ui-toast-mask"></div>');

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
    type: 'info',
    lock: false,
    message: 'Hello Toast !',
    timeout: 3,
    position: ''
  }, options);

  this.toast = $(
    '<div class="ui-toast">' +
    '  <div>' +
    '    <div class="ui-toast-content">' +
    '      <i class="ui-toast-' + options.type + '"></i>' +
    '      <div class="ui-toast-message">' + options.message + '</div>' +
    '    </div>' +
    '  </div>' +
    '</div>'
  );

  this.toast.appendTo(document.body);

  this.lock();
}

Toast.prototype = {
  lock: function (){
    mask.appendTo(document.body);
  },
  unlock: function (){
    mask.remove();
  },
  show: function (){

  },
  hide: function (){

  }
};

Toast.info = '';
Toast.ask = '';
Toast.warn = '';
Toast.success = '';
Toast.error = '';
Toast.loading = '';

new Toast();

// 公开接口
module.exports = Toast;
