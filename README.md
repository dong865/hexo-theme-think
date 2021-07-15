
[在线演示](http://www.lurenx.cn/)

[git地址](https://github.com/dong865/hexo-theme-think/)

[码云地址](https://gitee.com/dongdonging/hexo-theme-think/)

## 安装
进入项目根目录
```
npm i hexo-theme-think
```

## 使用
打开根目录的`__config.yml`文件，将`theme`字段设为`lite`
```
theme: think
```

## 依赖
```
hexo-generator-search
```

## 配置
### 代码高亮
先关闭根目录`_config.yml`文件中，hexo自带的代码高亮
```
highlight:
  enable: false
```
再开启主题目录下`_config.yml`文件中代码高亮

### 搜索
打开根目录的`__config.yml`文件，键入下面的代码
```
search:
  path: search.json
  field: post
  format: html
  limit: 10000
  content: true
```
打开主题目录的`_config.yml`，启用搜索
```
search:
  enable: true
```