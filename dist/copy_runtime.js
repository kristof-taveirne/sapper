'use strict';

var fs = require('fs');
var create_manifest_data = require('./create_manifest_data.js');
var path = require('path');
var fs_utils = require('./fs_utils.js');

function validate_bundler(bundler) {
    if (!bundler) {
        bundler = (fs.existsSync('rollup.config.js') || fs.existsSync('rollup.config.ts') ? 'rollup' :
            fs.existsSync('webpack.config.js') || fs.existsSync('webpack.config.ts') ? 'webpack' : null);
        if (!bundler) {
            // TODO remove in a future version
            deprecate_dir('rollup');
            deprecate_dir('webpack');
            throw new Error('Could not find a configuration file for rollup or webpack');
        }
    }
    if (bundler !== 'rollup' && bundler !== 'webpack') {
        throw new Error(`'${bundler}' is not a valid option for --bundler — must be either 'rollup' or 'webpack'`);
    }
    return bundler;
}
function deprecate_dir(bundler) {
    try {
        const stats = fs.statSync(bundler);
        if (!stats.isDirectory())
            return;
    }
    catch (err) {
        // do nothing
        return;
    }
    // TODO link to docs, once those docs exist
    throw new Error(`As of Sapper 0.21, build configuration should be placed in a single ${bundler}.config.js file`);
}

function copy_shimport(dest) {
    fs.writeFileSync(`${dest}/client/shimport@${create_manifest_data.version}.js`, fs.readFileSync(require.resolve('shimport/index.js')));
}

const runtime = [
    'index.d.ts',
    'app.mjs',
    'server.mjs',
    'internal/shared.mjs',
    'internal/layout.svelte',
    'internal/error.svelte'
].map(file => ({
    file,
    source: fs.readFileSync(path.join(__dirname, `../runtime/${file}`), 'utf-8')
}));
function copy_runtime(output) {
    runtime.forEach(({ file, source }) => {
        fs_utils.mkdirp(path.dirname(`${output}/${file}`));
        fs.writeFileSync(`${output}/${file}`, source);
    });
}

exports.copy_runtime = copy_runtime;
exports.copy_shimport = copy_shimport;
exports.validate_bundler = validate_bundler;
//# sourceMappingURL=copy_runtime.js.map
