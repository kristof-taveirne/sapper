'use strict';

var _commonjsHelpers = require('./_commonjsHelpers.js');
var path = require('path');
var fs = require('fs');
var http = require('http');
var child_process = require('child_process');
var Deferred = require('./Deferred.js');
var EventEmitter = require('events');
var create_manifest_data = require('./create_manifest_data.js');
var copy_runtime = require('./copy_runtime.js');
var fs_utils = require('./fs_utils.js');
require('net');
require('module');
require('crypto');
require('util');
require('sourcemap-codec');
require('./index.js');
require('./env.js');

function dev(opts) {
    return new Watcher(opts);
}
class Watcher extends EventEmitter.EventEmitter {
    constructor({ cwd = '.', src = 'src', routes = 'src/routes', output = 'src/node_modules/@sapper', static: static_files = 'static', dest = '__sapper__/dev', 'dev-port': dev_port, live, hot, 'devtools-port': devtools_port, bundler, port = +process.env.PORT, ext }) {
        super();
        cwd = path.resolve(cwd);
        this.bundler = copy_runtime.validate_bundler(bundler);
        this.dirs = {
            cwd,
            src: path.resolve(cwd, src),
            dest: path.resolve(cwd, dest),
            routes: path.resolve(cwd, routes),
            output: path.resolve(cwd, output),
            static: path.resolve(cwd, static_files)
        };
        this.ext = ext;
        this.port = port;
        this.closed = false;
        this.dev_port = dev_port;
        this.live = live;
        this.hot = hot;
        this.devtools_port = devtools_port;
        this.filewatchers = [];
        this.current_build = {
            changed: new Set(),
            rebuilding: new Set(),
            unique_errors: new Set(),
            unique_warnings: new Set()
        };
        process.env.NODE_ENV = 'development';
        process.on('exit', () => {
            this.close();
        });
        this.init();
    }
    init() {
        return _commonjsHelpers.__awaiter(this, void 0, void 0, function* () {
            if (this.port) {
                if (!(yield Deferred.check(this.port))) {
                    this.emit('fatal', {
                        message: `Port ${this.port} is unavailable`
                    });
                    return;
                }
            }
            else {
                this.port = yield Deferred.find(3000);
            }
            const { cwd, src, dest, routes, output, static: static_files } = this.dirs;
            fs_utils.rimraf(output);
            fs_utils.mkdirp(output);
            copy_runtime.copy_runtime(output);
            fs_utils.rimraf(dest);
            fs_utils.mkdirp(`${dest}/client`);
            if (this.bundler === 'rollup')
                copy_runtime.copy_shimport(dest);
            if (!this.dev_port)
                this.dev_port = yield Deferred.find(10000);
            // Chrome looks for debugging targets on ports 9222 and 9229 by default
            if (!this.devtools_port)
                this.devtools_port = yield Deferred.find(9222);
            let manifest_data;
            try {
                manifest_data = create_manifest_data.create_manifest_data(routes, this.ext);
                create_manifest_data.create_app({
                    bundler: this.bundler,
                    manifest_data,
                    dev: true,
                    dev_port: this.dev_port,
                    cwd, src, dest, routes, output
                });
            }
            catch (err) {
                this.emit('fatal', {
                    message: err.message
                });
                return;
            }
            this.dev_server = new DevServer(this.dev_port);
            this.filewatchers.push(watch_dir(routes, ({ path: file, stats }) => {
                if (stats.isDirectory()) {
                    return path.basename(file)[0] !== '_';
                }
                return true;
            }, () => {
                try {
                    manifest_data = create_manifest_data.create_manifest_data(routes, this.ext);
                    create_manifest_data.create_app({
                        bundler: this.bundler,
                        manifest_data,
                        dev: true,
                        dev_port: this.dev_port,
                        cwd, src, dest, routes, output
                    });
                }
                catch (error) {
                    this.emit('error', {
                        type: 'manifest',
                        error
                    });
                }
            }));
            if (this.live) {
                this.filewatchers.push(fs.watch(`${src}/template.html`, () => {
                    this.dev_server.send({
                        action: 'reload'
                    });
                }));
            }
            let deferred = new Deferred.Deferred();
            // TODO watch the configs themselves?
            const compilers = yield create_manifest_data.create_compilers(this.bundler, cwd, src, routes, dest, true);
            const emitFatal = () => {
                this.emit('fatal', {
                    message: 'Server crashed'
                });
                this.crashed = true;
                this.proc = null;
            };
            this.watch(compilers.server, {
                name: 'server',
                invalid: filename => {
                    this.restart(filename, 'server');
                },
                handle_result: (result) => {
                    deferred.promise.then(() => {
                        const restart = () => {
                            this.crashed = false;
                            return Deferred.wait(this.port)
                                .then((() => {
                                this.emit('ready', {
                                    port: this.port,
                                    process: this.proc
                                });
                                if (this.hot && this.bundler === 'webpack') {
                                    this.dev_server.send({
                                        status: 'completed'
                                    });
                                }
                                else if (this.live) {
                                    this.dev_server.send({
                                        action: 'reload'
                                    });
                                }
                            }))
                                .catch(err => {
                                if (this.crashed)
                                    return;
                                this.emit('fatal', {
                                    message: `Server is not listening on port ${this.port}`
                                });
                            });
                        };
                        const start_server = () => {
                            // we need to give the child process its own DevTools port,
                            // otherwise Node will try to use the parent's (and fail)
                            const debugArgRegex = /--inspect(?:-brk|-port)?|--debug-port/;
                            const execArgv = process.execArgv.slice();
                            if (execArgv.some((arg) => !!arg.match(debugArgRegex))) {
                                execArgv.push(`--inspect-port=${this.devtools_port}`);
                            }
                            this.proc = child_process.fork(`${dest}/server/server.js`, [], {
                                cwd: process.cwd(),
                                env: Object.assign({
                                    PORT: this.port
                                }, process.env),
                                stdio: ['ipc'],
                                execArgv
                            });
                            this.proc.stdout.on('data', chunk => {
                                this.emit('stdout', chunk);
                            });
                            this.proc.stderr.on('data', chunk => {
                                this.emit('stderr', chunk);
                            });
                            this.proc.on('message', message => {
                                if (message.__sapper__ && message.event === 'basepath') {
                                    this.emit('basepath', {
                                        basepath: message.basepath
                                    });
                                }
                            });
                            this.proc.on('exit', emitFatal);
                        };
                        if (this.proc) {
                            if (this.restarting)
                                return;
                            this.restarting = true;
                            this.proc.removeListener('exit', emitFatal);
                            this.proc.kill();
                            this.proc.on('exit', () => _commonjsHelpers.__awaiter(this, void 0, void 0, function* () {
                                start_server();
                                yield restart();
                                this.restarting = false;
                            }));
                        }
                        else {
                            start_server();
                            restart();
                        }
                    });
                }
            });
            this.watch(compilers.client, {
                name: 'client',
                invalid: filename => {
                    this.restart(filename, 'client');
                    deferred = new Deferred.Deferred();
                    // TODO we should delete old assets. due to a webpack bug
                    // i don't even begin to comprehend, this is apparently
                    // quite difficult
                },
                handle_result: (result) => {
                    fs.writeFileSync(path.join(dest, 'build.json'), JSON.stringify(result.to_json(manifest_data, this.dirs), null, '  '));
                    const client_files = result.chunks.map(chunk => `client/${chunk.file}`);
                    create_manifest_data.create_serviceworker_manifest({
                        manifest_data,
                        output,
                        client_files,
                        static_files
                    });
                    deferred.fulfil();
                    // we need to wait a beat before watching the service
                    // worker, because of some webpack nonsense
                    setTimeout(watch_serviceworker, 100);
                }
            });
            let watch_serviceworker = compilers.serviceworker
                ? () => {
                    watch_serviceworker = fs_utils.noop;
                    this.watch(compilers.serviceworker, {
                        name: 'service worker'
                    });
                }
                : fs_utils.noop;
        });
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        if (this.dev_server)
            this.dev_server.close();
        if (this.proc)
            this.proc.kill();
        this.filewatchers.forEach(watcher => {
            watcher.close();
        });
    }
    restart(filename, type) {
        if (this.restarting) {
            this.current_build.changed.add(filename);
            this.current_build.rebuilding.add(type);
        }
        else {
            this.restarting = true;
            this.current_build = {
                changed: new Set([filename]),
                rebuilding: new Set([type]),
                unique_warnings: new Set(),
                unique_errors: new Set()
            };
            process.nextTick(() => {
                this.emit('invalid', {
                    changed: Array.from(this.current_build.changed),
                    invalid: {
                        server: this.current_build.rebuilding.has('server'),
                        client: this.current_build.rebuilding.has('client'),
                        serviceworker: this.current_build.rebuilding.has('serviceworker')
                    }
                });
                this.restarting = false;
            });
        }
    }
    watch(compiler, { name, invalid = fs_utils.noop, handle_result = fs_utils.noop }) {
        compiler.oninvalid(invalid);
        compiler.watch((error, result) => {
            if (error) {
                this.emit('error', {
                    type: name,
                    error
                });
            }
            else {
                this.emit('build', {
                    type: name,
                    duration: result.duration,
                    errors: result.errors,
                    warnings: result.warnings
                });
                handle_result(result);
            }
        });
    }
}
const INTERVAL = 10000;
class DevServer {
    constructor(port, interval = 10000) {
        this.clients = new Set();
        this._ = http.createServer((req, res) => {
            if (req.url !== '/__sapper__')
                return;
            req.socket.setKeepAlive(true);
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control',
                'Content-Type': 'text/event-stream;charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
                Connection: 'keep-alive',
                // While behind nginx, event stream should not be buffered:
                // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
                'X-Accel-Buffering': 'no'
            });
            res.write('\n');
            this.clients.add(res);
            req.on('close', () => {
                this.clients.delete(res);
            });
        });
        this._.listen(port);
        this.interval = setInterval(() => {
            this.send(null);
        }, INTERVAL);
    }
    close() {
        this._.close();
        clearInterval(this.interval);
    }
    send(data) {
        this.clients.forEach(client => {
            client.write(`data: ${JSON.stringify(data)}\n\n`);
        });
    }
}
function watch_dir(dir, filter, callback) {
    let watch;
    let closed = false;
    Promise.resolve().then(function () { return require('./CheapWatch.esm.js'); }).then(({ default: CheapWatch }) => {
        if (closed)
            return;
        watch = new CheapWatch({ dir, filter, debounce: 50 });
        watch.on('+', callback);
        watch.on('-', callback);
        watch.init();
    });
    return {
        close: () => {
            if (watch)
                watch.close();
            closed = true;
        }
    };
}

exports.dev = dev;
//# sourceMappingURL=dev.js.map
