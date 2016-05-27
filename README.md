
toast
===========

>A toast plugin

###Usage
```js
new Toast('言宜慢，心宜善。');

new Toast('言宜慢，心宜善。', { type: 'smile', lock: true });

function handler(){
  console.log('提示类型：', this.type, '>>>', '触发事件：', arguments[0], '>>>', '回调参数：', arguments[1]);
}

Toast.loading('正在加载数据...', { lock: true }).on('hide', function (){
  Toast.success('言宜慢，心宜善。')
    .on('show', handler)
    .on('hide', handler);
}).on('lock', handler).on('unlock', handler);
```

###API
#### new Toast(message, options) ```constructor```
#####  *message* ```String``` 消息文本
#####  *options* ```Object``` 配置提示框参数
- id ```Number | String```

  提示框身份标识，相同身份标识的提示框不能共存。

- lock ```Boolean```

  是否打开锁屏遮罩，默认 ```false```。

- type ```String```

  提示框类型，用以展示不同图标和主题，内置有
  ```info success warn error smile lock sad ask loading```。

- timeout ```Object```

  自动关闭提示框时间，默认 ```3000``` 毫秒，如果为 ```0``` 则不关闭提示框。

#### attribute & method ```attribute & method```
##### id ```attribute``` 提示框身份标识 ```readonly```
##### locked ```attribute``` 提示框锁定状态 ```readonly```
##### visibility ```attribute``` 提示框可见状态 ```readonly```
##### type ```attribute``` 提示框类型 ```readonly```
##### show ```method``` 显示提示框并触发 ```show``` 事件，参数可选
##### hide```method``` 隐藏提示框并触发 ```hide``` 事件，参数可选
##### lock```method``` 显示遮罩层并触发 ```lock``` 事件，参数可选
##### unlock ```method``` 隐藏遮罩层并触发 ```unlock``` 事件，参数可选
##### on```method``` 绑定事件监听
##### off ```method``` 移除事件监听
##### emit ```method``` 触发事件回调

#### static method ```method```
##### Toast.query```method``` 根据身份标识获取实例
##### Toast.success ```method``` 成功提示框
##### Toast.error ```method``` 错误提示框
##### Toast.info ```method``` 消息提示框
##### Toast.ask ```method``` 询问提示框
##### Toast.warn ```method``` 警告提示框
##### Toast.loading ```method``` 加载提示框

###Demo
####[在线实例](https://github.com/nuintun/toast/index.html)
