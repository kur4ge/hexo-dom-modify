'use strict';

var path = require('path');
var url = require('url');
var soup = require('soup');
var _ = require('underscore');
const chalk = require('chalk');

var log = hexo.log || log.log;

hexo.extend.filter.register('after_render:html', function (str, env) {
    var domModifyConfig = hexo.config.dom_modify;
    var log = this.log;
    if (!domModifyConfig || !domModifyConfig.enable || !(domModifyConfig.rules && domModifyConfig.rules.length)) {
        return str; // do nothing
    }
    let rules = buildRules(domModifyConfig);
    var htmlSoup = new soup(str);
    rules.map((rule) => {
        if (rule.attribute) {
            htmlSoup.setAttribute(rule.selector, rule.attribute.name, (data) => {
                if (!data) {
                    return data;
                }
                let newData = rule.attribute.compiledReplace(data);
                if (newData != data) {
                    log.info(chalk.green(`/${env.path}`), `${rule.selector}.${rule.attribute.name}`, data, '=>', newData);
                }
                return newData;
            });
        }
        if (rule.innerHtml) {
            htmlSoup.setInnerHTML(rule.selector, (data) => {
                if (!data) {
                    return data;
                }
                let newData = rule.innerHtml.compiledReplace(data);
                if (newData != data) {
                    log.info(chalk.green(`/${env.path}`), rule.selector, chalk.cyan('InnerHTML'), '\n' + data + '\n=>\n' + newData);
                }
                return newData;
            })
        }
    });
    return htmlSoup.toString();
});

function CompileReplace(rule) {
    let match = rule.search.match(/^\/(.*)\/(.*)$/);
    if (!match) {
        return null;
    }
    let replace = rule.replace || '';
    let regex = new RegExp(match[1], match[2]);

    return (data) => {
        return data.replace(regex, replace);
    }
}

function buildRules(domModifyConfig) {
    return domModifyConfig.rules.map((rule) => {
        if (!rule.selector) {
            throw new Error("Rule need selector");
        }
        if (rule.attribute && !rule.attribute.compiledReplace) {
            if (!rule.attribute.name) {
                throw new Error("Rule need attribute.name");
            }
            if (!rule.attribute.search) {
                throw new Error("Rule need attribute.search");
            }
            rule.attribute.compiledReplace = CompileReplace(rule.attribute);
            if (!rule.attribute.compiledReplace) {
                throw new Error("Rule build regex failed");
            }
        }
        if (rule.innerHtml && !rule.innerHtml.compiledReplace) {
            if (!rule.innerHtml.search) {
                throw new Error("Rule need innerHtml.search");
            }
            rule.innerHtml.compiledReplace = CompileReplace(rule.innerHtml);
            if (!rule.innerHtml.compiledReplace) {
                throw new Error("Rule build regex failed");
            }
        }
        return rule;
    });
}
