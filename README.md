# hexo-dom-modify

In hexo, you may need to replace some dom elements in batches.

This plugin can be replaced by simple configuration after generating the html file.

## Installation

``` bash
$ npm install @kur4ge/hexo-dom-modify --save
```

## Usage

### Setting up the configuration in _config.ymal
```
dom_modify:
  enable: true
  rules:
    -
      selector: link[rel=stylesheet]
      attribute: 
        name: href
        search: /^\/([^/].*\.css)(\?.*)?$/i
        replace: https://example.com/$1
    -
      selector: script[src]
      attribute: 
        name: src
        search: /^\/([^/].*\.js)(\?.*)?$/i
        replace: https://example.com/$1
    -
      selector: h1
      innerHtml:
        search: /Hello World/g
        replace: 你好世界
```
