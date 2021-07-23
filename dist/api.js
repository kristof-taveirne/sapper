'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var dev = require('./dev.js');
var build = require('./build.js');
var _export = require('./export.js');
require('fs');
require('path');
var create_manifest_data = require('./create_manifest_data.js');
require('./_commonjsHelpers.js');
require('http');
require('child_process');
require('./Deferred.js');
require('net');
require('events');
require('./copy_runtime.js');
require('./fs_utils.js');
require('./minify_html.js');
require('html-minifier');
require('url');
require('util');
require('stream');
require('https');
require('zlib');
require('http-link-header');
require('module');
require('crypto');
require('sourcemap-codec');
require('./index.js');
require('./env.js');

function find_page(pathname, cwd = 'src/routes') {
    const { pages } = create_manifest_data.create_manifest_data(cwd);
    for (let i = 0; i < pages.length; i += 1) {
        const page = pages[i];
        if (page.pattern.test(pathname)) {
            return page.parts[page.parts.length - 1].component.file;
        }
    }
}

exports.dev = dev.dev;
exports.build = build.build;
exports.export = _export.export;
exports.find_page = find_page;
//# sourceMappingURL=api.js.map
