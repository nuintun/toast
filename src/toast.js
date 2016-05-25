/**
 * Created by nuintun on 2016/5/25.
 */

'use strict';

require('./toast.css');

var $ = require('jquery');

var mask; // 锁屏
var wrap; // 提示条外层包裹
var inner; // 内容包裹
var timer; // 计时器id
var instance = null; // 实例堆栈

// 接口
function Toast(config){
  // 默认参数
  var defaults = {
    msg: '',
    time: 3,
    theme: 'prompt',
    zIndex: 999999,
    lock: false,
    escape: true,
    opacity: 0.65,
    backgroundColor: '#333',
    onClosed: $.noop
  };

  // 参数是字符串直接显示
  if ($.type(config) === 'string') {
    config = {
      msg: config
    };

    // 第二个参数是对象合并参数
    if ($.type(arguments[1]) === 'object') {
      config = $.extend(config, arguments[1]);
    }
  }

  // 模仿静态方法，不需要用new初始化
  if (!(this instanceof Toast)) return new Toast(config);
  this.config = $.extend({}, defaults, config);
  this.config.time = $.isNumeric(this.config.time) ? this.config.time * 1000 : 3000;

  this._initialize();

  return this;
}

// 原型方法
Toast.prototype = {
  // 初始化函数
  _initialize: function (){
    if (this.config.msg === '') return;

    clearTimeout(timer);

    instance !== null && instance !== this && instance.config.onClosed();
    instance = this;
    wrap = wrap || $(
        '<div class="ui-toast">'
        + '<div class="ui-toast-center"></div>'
        + '</div>'
      ).appendTo(document.body);
    inner = inner || wrap.find('div.ui-toast-center').first();
    mask = mask || $('<div class="ui-toast-mask"></div>').appendTo(document.body);

    wrap.css('z-index', this.config.zIndex);
    mask.css({
      zIndex: this.config.zIndex - 1,
      opacity: this.config.opacity,
      backgroundColor: this.config.backgroundColor
    });

    // 显示
    this._show();
  },
  // 锁屏
  _lock: function (){
    mask.show();
  },
  // 关闭锁屏
  _unlock: function (){
    mask.hide();
  },
  // 提示条显示
  _show: function (){
    this[this.config.lock ? '_lock' : '_unlock']();
    inner.html(this._getMessage(this.config.theme, this.config.msg));
    wrap.show();
    this._autoClose();
  },
  // 提示条隐藏
  _hide: function (){
    // 保证只有当前实例才能执行关闭操作
    if (instance !== this) return;

    wrap.hide();
    this._unlock();

    instance = null;

    $.isFunction(this.config.onClosed) && this.config.onClosed();
  },
  // 自动关闭
  _autoClose: function (){
    var that = this;
    timer = setTimeout(function (){
      that._hide();
    }, this.config.time);
  },
  // 格式化消息
  _getMessage: function (theme, message){
    var ico = '<i class="iconfont">';
    switch (theme) {
      case 'success':
        theme = 'success';
        ico += '&#xe002;';
        break;
      case 'error':
        theme = 'error';
        ico += '&#xe006;';
        break;
      case 'warning':
        theme = 'warning';
        ico += '&#xe004;';
        break;
      case 'question':
        theme = 'question';
        ico += '&#xe005;';
        break;
      default:
        theme = 'prompt';
        ico += '&#xe003;';
    }

    return '<div class="ui-toast-content ' + theme + ' fn-clear">'
      + ico + '</i><div class="ui-toast-msg">'
      + message + '</div></div>';
  },
  // 关闭接口
  close: function (){
    this._hide();
  }
};

function themeToastCreator(theme){
  return function (message, config){
    message = $.type(message) === 'string' ? message : '';
    config = $.extend({}, config, { theme: theme });

    return new Toast(message, config);
  };
}

Toast.success = themeToastCreator('success');
Toast.warn = themeToastCreator('warning');
Toast.error = themeToastCreator('error');
Toast.question = themeToastCreator('question');
Toast.prompt = themeToastCreator('prompt');

// 公开接口
module.exports = Toast;