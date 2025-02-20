'use strict';

var _commonjsHelpers = require('./_commonjsHelpers.js');
var fs = require('fs');
var path = require('path');
var minify_html = require('./minify_html.js');
var create_manifest_data = require('./create_manifest_data.js');
var copy_runtime = require('./copy_runtime.js');
var fs_utils = require('./fs_utils.js');
require('html-minifier');
require('module');
require('crypto');
require('util');
require('sourcemap-codec');
require('./index.js');
require('./env.js');

function read_template(dir) {
    try {
        return fs.readFileSync(`${dir}/template.html`, 'utf-8');
    }
    catch (err) {
        if (fs.existsSync('app/template.html')) {
            throw new Error(`As of Sapper 0.21, the default folder structure has been changed:
  app/    --> src/
  routes/ --> src/routes/
  assets/ --> static/`);
        }
        throw err;
    }
}

function build({ cwd, src = 'src', routes = 'src/routes', output = 'src/node_modules/@sapper', static: static_files = 'static', dest = '__sapper__/build', bundler = undefined, legacy = false, ext = undefined, oncompile = fs_utils.noop } = {}) {
    return _commonjsHelpers.__awaiter(this, void 0, void 0, function* () {
        bundler = copy_runtime.validate_bundler(bundler);
        cwd = path.resolve(cwd);
        src = path.resolve(cwd, src);
        dest = path.resolve(cwd, dest);
        routes = path.resolve(cwd, routes);
        output = path.resolve(cwd, output);
        static_files = path.resolve(cwd, static_files);
        if (legacy && bundler === 'webpack') {
            throw new Error('Legacy builds are not supported for projects using webpack');
        }
        fs_utils.rimraf(output);
        fs_utils.mkdirp(output);
        copy_runtime.copy_runtime(output);
        fs_utils.rimraf(dest);
        fs_utils.mkdirp(`${dest}/client`);
        copy_runtime.copy_shimport(dest);
        // minify src/template.html
        // TODO compile this to a function? could be quicker than str.replace(...).replace(...).replace(...)
        const template = read_template(src);
        fs.writeFileSync(`${dest}/template.html`, minify_html.minify_html(template));
        const manifest_data = create_manifest_data.create_manifest_data(routes, ext);
        // create src/node_modules/@sapper/app.mjs and server.mjs
        create_manifest_data.create_app({
            bundler,
            manifest_data,
            cwd,
            src,
            dest,
            routes,
            output,
            dev: false
        });
        const { client, server, serviceworker } = yield create_manifest_data.create_compilers(bundler, cwd, src, routes, dest, false);
        const client_result = yield client.compile();
        oncompile({
            type: 'client',
            result: client_result
        });
        const build_info = client_result.to_json(manifest_data, { src, routes, dest });
        if (legacy) {
            process.env.SAPPER_LEGACY_BUILD = 'true';
            const { client: legacy_client } = yield create_manifest_data.create_compilers(bundler, cwd, src, routes, dest, false);
            const legacy_client_result = yield legacy_client.compile();
            oncompile({
                type: 'client (legacy)',
                result: legacy_client_result
            });
            legacy_client_result.to_json(manifest_data, { src, routes, dest });
            build_info.legacy_assets = legacy_client_result.assets;
            delete process.env.SAPPER_LEGACY_BUILD;
        }
        fs.writeFileSync(path.join(dest, 'build.json'), JSON.stringify(build_info, null, '  '));
        const server_stats = yield server.compile();
        oncompile({
            type: 'server',
            result: server_stats
        });
        let serviceworker_stats;
        if (serviceworker) {
            const client_files = client_result.chunks
                .filter(chunk => !chunk.file.endsWith('.map')) // SW does not need to cache sourcemap files
                .map(chunk => `client/${chunk.file}`);
            create_manifest_data.create_serviceworker_manifest({
                manifest_data,
                output,
                client_files,
                static_files
            });
            serviceworker_stats = yield serviceworker.compile();
            oncompile({
                type: 'serviceworker',
                result: serviceworker_stats
            });
        }
    });
}

exports.build = build;
//# sourceMappingURL=build.js.map
