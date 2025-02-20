'use strict';

var _commonjsHelpers = require('./_commonjsHelpers.js');
var fs = require('fs');
var path = require('path');

function toArr(any) {
	return any == null ? [] : Array.isArray(any) ? any : [any];
}

function toVal(out, key, val, opts) {
	var x, old=out[key], nxt=(
		!!~opts.string.indexOf(key) ? (val == null || val === true ? '' : String(val))
		: typeof val === 'boolean' ? val
		: !!~opts.boolean.indexOf(key) ? (val === 'false' ? false : val === 'true' || (out._.push((x = +val,x * 0 === 0) ? x : val),!!val))
		: (x = +val,x * 0 === 0) ? x : val
	);
	out[key] = old == null ? nxt : (Array.isArray(old) ? old.concat(nxt) : [old, nxt]);
}

function index (args, opts) {
	args = args || [];
	opts = opts || {};

	var k, arr, arg, name, val, out={ _:[] };
	var i=0, j=0, idx=0, len=args.length;

	const alibi = opts.alias !== void 0;
	const strict = opts.unknown !== void 0;
	const defaults = opts.default !== void 0;

	opts.alias = opts.alias || {};
	opts.string = toArr(opts.string);
	opts.boolean = toArr(opts.boolean);

	if (alibi) {
		for (k in opts.alias) {
			arr = opts.alias[k] = toArr(opts.alias[k]);
			for (i=0; i < arr.length; i++) {
				(opts.alias[arr[i]] = arr.concat(k)).splice(i, 1);
			}
		}
	}

	for (i=opts.boolean.length; i-- > 0;) {
		arr = opts.alias[opts.boolean[i]] || [];
		for (j=arr.length; j-- > 0;) opts.boolean.push(arr[j]);
	}

	for (i=opts.string.length; i-- > 0;) {
		arr = opts.alias[opts.string[i]] || [];
		for (j=arr.length; j-- > 0;) opts.string.push(arr[j]);
	}

	if (defaults) {
		for (k in opts.default) {
			name = typeof opts.default[k];
			arr = opts.alias[k] = opts.alias[k] || [];
			if (opts[name] !== void 0) {
				opts[name].push(k);
				for (i=0; i < arr.length; i++) {
					opts[name].push(arr[i]);
				}
			}
		}
	}

	const keys = strict ? Object.keys(opts.alias) : [];

	for (i=0; i < len; i++) {
		arg = args[i];

		if (arg === '--') {
			out._ = out._.concat(args.slice(++i));
			break;
		}

		for (j=0; j < arg.length; j++) {
			if (arg.charCodeAt(j) !== 45) break; // "-"
		}

		if (j === 0) {
			out._.push(arg);
		} else if (arg.substring(j, j + 3) === 'no-') {
			name = arg.substring(j + 3);
			if (strict && !~keys.indexOf(name)) {
				return opts.unknown(arg);
			}
			out[name] = false;
		} else {
			for (idx=j+1; idx < arg.length; idx++) {
				if (arg.charCodeAt(idx) === 61) break; // "="
			}

			name = arg.substring(j, idx);
			val = arg.substring(++idx) || (i+1 === len || (''+args[i+1]).charCodeAt(0) === 45 || args[++i]);
			arr = (j === 2 ? [name] : name);

			for (idx=0; idx < arr.length; idx++) {
				name = arr[idx];
				if (strict && !~keys.indexOf(name)) return opts.unknown('-'.repeat(j) + name);
				toVal(out, name, (idx + 1 < arr.length) || val, opts);
			}
		}
	}

	if (defaults) {
		for (k in opts.default) {
			if (out[k] === void 0) {
				out[k] = opts.default[k];
			}
		}
	}

	if (alibi) {
		for (k in out) {
			arr = opts.alias[k] || [];
			while (arr.length > 0) {
				out[arr.shift()] = out[k];
			}
		}
	}

	return out;
}

var lib$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	'default': index
});

const GAP = 4;
const __ = '  ';
const ALL$1 = '__all__';
const DEF$1 = '__default__';
const NL = '\n';

function format(arr) {
	if (!arr.length) return '';
	let len = maxLen( arr.map(x => x[0]) ) + GAP;
	let join = a => a[0] + ' '.repeat(len - a[0].length) + a[1] + (a[2] == null ? '' : `  (default ${a[2]})`);
	return arr.map(join);
}

function maxLen(arr) {
  let c=0, d=0, l=0, i=arr.length;
  if (i) while (i--) {
    d = arr[i].length;
    if (d > c) {
      l = i; c = d;
    }
  }
  return arr[l].length;
}

function noop(s) {
	return s;
}

function section(str, arr, fn) {
	if (!arr || !arr.length) return '';
	let i=0, out='';
	out += (NL + __ + str);
	for (; i < arr.length; i++) {
		out += (NL + __ + __ + fn(arr[i]));
	}
	return out + NL;
}

var help = function (bin, tree, key, single) {
	let out='', cmd=tree[key], pfx=`$ ${bin}`, all=tree[ALL$1];
	let prefix = s => `${pfx} ${s}`.replace(/\s+/g, ' ');

	// update ALL & CMD options
	let tail = [['-h, --help', 'Displays this message']];
	if (key === DEF$1) tail.unshift(['-v, --version', 'Displays current version']);
	cmd.options = (cmd.options || []).concat(all.options, tail);

	// write options placeholder
	if (cmd.options.length > 0) cmd.usage += ' [options]';

	// description ~> text only; usage ~> prefixed
	out += section('Description', cmd.describe, noop);
	out += section('Usage', [cmd.usage], prefix);

	if (!single && key === DEF$1) {
		let key, rgx=/^__/, help='', cmds=[];
		// General help :: print all non-(alias|internal) commands & their 1st line of helptext
		for (key in tree) {
			if (typeof tree[key] == 'string' || rgx.test(key)) continue;
			if (cmds.push([key, (tree[key].describe || [''])[0]]) < 3) {
				help += (NL + __ + __ + `${pfx} ${key} --help`);
			}
		}

		out += section('Available Commands', format(cmds), noop);
		out += (NL + __ + 'For more info, run any command with the `--help` flag') + help + NL;
	} else if (!single && key !== DEF$1) {
		// Command help :: print its aliases if any
		out += section('Aliases', cmd.alibi, prefix);
	}

	out += section('Options', format(cmd.options), noop);
	out += section('Examples', cmd.examples.map(prefix), noop);

	return out;
};

var error = function (bin, str, num=1) {
	let out = section('ERROR', [str], noop);
	out += (NL + __ + `Run \`$ ${bin} --help\` for more info.` + NL);
	console.error(out);
	process.exit(num);
};

// Strips leading `-|--` & extra space(s)
var parse = function (str) {
	return (str || '').split(/^-{1,2}|,|\s+-{1,2}|\s+/).filter(Boolean);
};

// @see https://stackoverflow.com/a/18914855/3577474
var sentences = function (str) {
	return (str || '').replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
};

var utils = {
	help: help,
	error: error,
	parse: parse,
	sentences: sentences
};

var mri = _commonjsHelpers.getCjsExportFromNamespace(lib$1);

const ALL = '__all__';
const DEF = '__default__';

class Sade {
	constructor(name, isOne) {
		let [bin, ...rest] = name.split(/\s+/);
		isOne = isOne || rest.length > 0;

		this.bin = bin;
		this.ver = '0.0.0';
		this.default = '';
		this.tree = {};
		// set internal shapes;
		this.command(ALL);
		this.command([DEF].concat(isOne ? rest : '<command>').join(' '));
		this.single = isOne;
		this.curr = ''; // reset
	}

	command(str, desc, opts={}) {
		if (this.single) {
			throw new Error('Disable "single" mode to add commands');
		}

		// All non-([|<) are commands
		let cmd=[], usage=[], rgx=/(\[|<)/;
		str.split(/\s+/).forEach(x => {
			(rgx.test(x.charAt(0)) ? usage : cmd).push(x);
		});

		// Back to string~!
		cmd = cmd.join(' ');

		if (cmd in this.tree) {
			throw new Error(`Command already exists: ${cmd}`);
		}

		// re-include `cmd` for commands
		cmd.includes('__') || usage.unshift(cmd);
		usage = usage.join(' '); // to string

		this.curr = cmd;
		if (opts.default) this.default=cmd;

		this.tree[cmd] = { usage, alibi:[], options:[], alias:{}, default:{}, examples:[] };
		if (opts.alias) this.alias(opts.alias);
		if (desc) this.describe(desc);

		return this;
	}

	describe(str) {
		this.tree[this.curr || DEF].describe = Array.isArray(str) ? str : utils.sentences(str);
		return this;
	}

	alias(...names) {
		if (this.single) throw new Error('Cannot call `alias()` in "single" mode');
		if (!this.curr) throw new Error('Cannot call `alias()` before defining a command');
		let arr = this.tree[this.curr].alibi = this.tree[this.curr].alibi.concat(...names);
		arr.forEach(key => this.tree[key] = this.curr);
		return this;
	}

	option(str, desc, val) {
		let cmd = this.tree[ this.curr || ALL ];

		let [flag, alias] = utils.parse(str);
		if (alias && alias.length > 1) [flag, alias]=[alias, flag];

		str = `--${flag}`;
		if (alias && alias.length > 0) {
			str = `-${alias}, ${str}`;
			let old = cmd.alias[alias];
			cmd.alias[alias] = (old || []).concat(flag);
		}

		let arr = [str, desc || ''];

		if (val !== void 0) {
			arr.push(val);
			cmd.default[flag] = val;
		} else if (!alias) {
			cmd.default[flag] = void 0;
		}

		cmd.options.push(arr);
		return this;
	}

	action(handler) {
		this.tree[ this.curr || DEF ].handler = handler;
		return this;
	}

	example(str) {
		this.tree[ this.curr || DEF ].examples.push(str);
		return this;
	}

	version(str) {
		this.ver = str;
		return this;
	}

	parse(arr, opts={}) {
		arr = arr.slice(); // copy
		let offset=2, tmp, idx, isVoid, cmd;
		let alias = { h:'help', v:'version' };
		let argv = mri(arr.slice(offset), { alias });
		let isSingle = this.single;
		let bin = this.bin;
		let name = '';

		if (isSingle) {
			cmd = this.tree[DEF];
		} else {
			// Loop thru possible command(s)
			let i=1, xyz, len=argv._.length + 1;
			for (; i < len; i++) {
				tmp = argv._.slice(0, i).join(' ');
				xyz = this.tree[tmp];
				if (typeof xyz === 'string') {
					idx = (name=xyz).split(' ');
					arr.splice(arr.indexOf(argv._[0]), i, ...idx);
					i += (idx.length - i);
				} else if (xyz) {
					name = tmp;
				} else if (name) {
					break;
				}
			}

			cmd = this.tree[name];
			isVoid = (cmd === void 0);

			if (isVoid) {
				if (this.default) {
					name = this.default;
					cmd = this.tree[name];
					arr.unshift(name);
					offset++;
				} else if (tmp) {
					return utils.error(bin, `Invalid command: ${tmp}`);
				} //=> else: cmd not specified, wait for now...
			}
		}

		// show main help if relied on "default" for multi-cmd
		if (argv.help) return this.help(!isSingle && !isVoid && name);
		if (argv.version) return this._version();

		if (!isSingle && cmd === void 0) {
			return utils.error(bin, 'No command specified.');
		}

		let all = this.tree[ALL];
		// merge all objects :: params > command > all
		opts.alias = Object.assign(all.alias, cmd.alias, opts.alias);
		opts.default = Object.assign(all.default, cmd.default, opts.default);

		tmp = name.split(' ');
		idx = arr.indexOf(tmp[0], 2);
		if (!!~idx) arr.splice(idx, tmp.length);

		let vals = mri(arr.slice(offset), opts);
		if (!vals || typeof vals === 'string') {
			return utils.error(bin, vals || 'Parsed unknown option flag(s)!');
		}

		let segs = cmd.usage.split(/\s+/);
		let reqs = segs.filter(x => x.charAt(0)==='<');
		let args = vals._.splice(0, reqs.length);

		if (args.length < reqs.length) {
			if (name) bin += ` ${name}`; // for help text
			return utils.error(bin, 'Insufficient arguments!');
		}

		segs.filter(x => x.charAt(0)==='[').forEach(_ => {
			args.push(vals._.shift()); // adds `undefined` per [slot] if no more
		});

		args.push(vals); // flags & co are last
		let handler = cmd.handler;
		return opts.lazy ? { args, name, handler } : handler.apply(null, args);
	}

	help(str) {
		console.log(
			utils.help(this.bin, this.tree, str || DEF, this.single)
		);
	}

	_version() {
		console.log(`${this.bin}, ${this.ver}`);
	}
}

var lib = (str, isOne) => new Sade(str, isOne);

var version = "0.29.2";

const prog = lib('sapper').version(version);
if (process.argv[2] === 'start') {
    // remove this in a future version
    console.error(_commonjsHelpers.$.bold().red('"sapper start" has been removed'));
    console.error('Use "node [build_dir]" instead');
    process.exit(1);
}
const start = Date.now();
prog.command('dev')
    .describe('Start a development server')
    .option('-p, --port', 'Specify a port')
    .option('-o, --open', 'Open a browser window')
    .option('--dev-port', 'Specify a port for development server')
    .option('--hot', 'Use hot module replacement (requires webpack)', true)
    .option('--live', 'Reload on changes if not using --hot', true)
    .option('--bundler', 'Specify a bundler (rollup or webpack)')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--static', 'Static files directory', 'static')
    .option('--output', 'Sapper intermediate file output directory', 'src/node_modules/@sapper')
    .option('--build-dir', 'Development build directory', '__sapper__/dev')
    .option('--ext', 'Custom Route Extension', '.svelte .html')
    .action((opts) => _commonjsHelpers.__awaiter(void 0, void 0, void 0, function* () {
    const { dev } = yield Promise.resolve().then(function () { return require('./dev.js'); });
    try {
        const watcher = dev({
            cwd: opts.cwd,
            src: opts.src,
            routes: opts.routes,
            static: opts.static,
            output: opts.output,
            dest: opts['build-dir'],
            port: opts.port,
            'dev-port': opts['dev-port'],
            live: opts.live,
            hot: opts.hot,
            bundler: opts.bundler,
            ext: opts.ext
        });
        let first = true;
        watcher.on('stdout', data => {
            process.stdout.write(data);
        });
        watcher.on('stderr', data => {
            process.stderr.write(data);
        });
        watcher.on('ready', (event) => _commonjsHelpers.__awaiter(void 0, void 0, void 0, function* () {
            if (first) {
                console.log(_commonjsHelpers.$.bold().cyan(`> Listening on http://localhost:${event.port}`));
                if (opts.open) {
                    const { exec } = yield Promise.resolve().then(function () { return require('child_process'); });
                    exec(`open http://localhost:${event.port}`);
                }
                first = false;
            }
        }));
        watcher.on('invalid', (event) => {
            const changed = event.changed.map(filename => path.relative(process.cwd(), filename)).join(', ');
            console.log(`\n${_commonjsHelpers.$.bold().cyan(changed)} changed. Rebuilding...`);
        });
        watcher.on('error', (event) => {
            const { type, error } = event;
            console.log(_commonjsHelpers.$.bold().red(`✗ ${type}`));
            if (error.loc && error.loc.file) {
                console.log(_commonjsHelpers.$.bold(`${path.relative(process.cwd(), error.loc.file)} (${error.loc.line}:${error.loc.column})`));
            }
            console.log(_commonjsHelpers.$.red(event.error.message));
            if (error.frame)
                console.log(error.frame);
        });
        watcher.on('fatal', (event) => {
            console.log(_commonjsHelpers.$.bold().red(`> ${event.message}`));
            if (event.log)
                console.log(event.log);
        });
        watcher.on('build', (event) => {
            if (event.errors.length) {
                console.log(_commonjsHelpers.$.bold().red(`✗ ${event.type}`));
                event.errors.filter(e => !e.duplicate).forEach(error => {
                    if (error.file)
                        console.log(_commonjsHelpers.$.bold(error.file));
                    console.log(error.message);
                });
                const hidden = event.errors.filter(e => e.duplicate).length;
                if (hidden > 0) {
                    console.log(`${hidden} duplicate ${hidden === 1 ? 'error' : 'errors'} hidden\n`);
                }
            }
            else if (event.warnings.length) {
                console.log(_commonjsHelpers.$.bold().yellow(`• ${event.type}`));
                event.warnings.filter(e => !e.duplicate).forEach(warning => {
                    if (warning.file)
                        console.log(_commonjsHelpers.$.bold(warning.file));
                    console.log(warning.message);
                });
                const hidden = event.warnings.filter(e => e.duplicate).length;
                if (hidden > 0) {
                    console.log(`${hidden} duplicate ${hidden === 1 ? 'warning' : 'warnings'} hidden\n`);
                }
            }
            else {
                console.log(`${_commonjsHelpers.$.bold().green(`✔ ${event.type}`)} ${_commonjsHelpers.$.gray(`(${_commonjsHelpers.format_milliseconds(event.duration)})`)}`);
            }
        });
    }
    catch (err) {
        console.log(_commonjsHelpers.$.bold().red(`> ${err.message}`));
        console.log(_commonjsHelpers.$.gray(err.stack));
        process.exit(1);
    }
}));
prog.command('build [dest]')
    .describe('Create a production-ready version of your app')
    .option('-p, --port', 'Default of process.env.PORT', '3000')
    .option('--bundler', 'Specify a bundler (rollup or webpack, blank for auto)')
    .option('--legacy', 'Create separate legacy build')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--output', 'Sapper intermediate file output directory', 'src/node_modules/@sapper')
    .option('--ext', 'Custom page route extensions (space separated)', '.svelte .html')
    .example('build custom-dir -p 4567')
    .action((dest = '__sapper__/build', opts) => _commonjsHelpers.__awaiter(void 0, void 0, void 0, function* () {
    console.log('> Building...');
    try {
        yield _build(opts.bundler, opts.legacy, opts.cwd, opts.src, opts.routes, opts.output, dest, opts.ext);
        const launcher = path.resolve(dest, 'index.js');
        fs.writeFileSync(launcher, `
				// generated by sapper build at ${new Date().toISOString()}
				process.env.NODE_ENV = process.env.NODE_ENV || 'production';
				process.env.PORT = process.env.PORT || ${opts.port || 3000};

				console.log('Starting server on port ' + process.env.PORT);
				require('./server/server.js');
			`.replace(/^\t+/gm, '').trim());
        console.log(`\n> Finished in ${_commonjsHelpers.elapsed(start)}. Type ${_commonjsHelpers.$.bold().cyan(`node ${dest}`)} to run the app.`);
    }
    catch (err) {
        console.log(`${_commonjsHelpers.$.bold().red(`> ${err.message}`)}`);
        console.log(_commonjsHelpers.$.gray(err.stack));
        process.exit(1);
    }
}));
prog.command('export [dest]')
    .describe('Export your app as static files (if possible)')
    .option('--build', '(Re)build app before exporting', true)
    .option('--basepath', 'Specify a base path')
    .option('--host', 'Host header to use when crawling site')
    .option('--concurrent', 'Concurrent requests', 8)
    .option('--timeout', 'Milliseconds to wait for a page (--no-timeout to disable)', 5000)
    .option('--legacy', 'Creates an additional build, served only to legacy browsers')
    .option('--bundler', 'Specify a bundler (rollup or webpack, blank for auto)')
    .option('--cwd', 'Current working directory', '.')
    .option('--src', 'Source directory', 'src')
    .option('--routes', 'Routes directory', 'src/routes')
    .option('--static', 'Static files directory', 'static')
    .option('--output', 'Sapper intermediate file output directory', 'src/node_modules/@sapper')
    .option('--build-dir', 'Intermediate build directory', '__sapper__/build')
    .option('--ext', 'Custom page route extensions (space separated)', '.svelte .html')
    .option('--entry', 'Custom entry points (space separated)', '/')
    .action((dest = '__sapper__/export', opts) => _commonjsHelpers.__awaiter(void 0, void 0, void 0, function* () {
    try {
        if (opts.build) {
            console.log('> Building...');
            yield _build(opts.bundler, opts.legacy, opts.cwd, opts.src, opts.routes, opts.output, opts['build-dir'], opts.ext);
            console.error(`\n> Built in ${_commonjsHelpers.elapsed(start)}`);
        }
        const { export: _export } = yield Promise.resolve().then(function () { return require('./export.js'); });
        const { default: pb } = yield Promise.resolve().then(function () { return require('./index.js'); }).then(function (n) { return n.index; });
        yield _export({
            cwd: opts.cwd,
            static: opts.static,
            build_dir: opts['build-dir'],
            export_dir: dest,
            basepath: opts.basepath,
            host_header: opts.host,
            timeout: opts.timeout,
            concurrent: opts.concurrent,
            entry: opts.entry,
            oninfo: event => {
                console.log(_commonjsHelpers.$.bold().cyan(`> ${event.message}`));
            },
            onfile: event => {
                const size_color = event.size > 150000 ? _commonjsHelpers.$.bold().red : event.size > 50000 ? _commonjsHelpers.$.bold().yellow : _commonjsHelpers.$.bold().gray;
                const size_label = size_color(_commonjsHelpers.left_pad(pb(event.size), 10));
                const file_label = event.status === 200
                    ? event.file
                    : _commonjsHelpers.$.bold()[event.status >= 400 ? 'red' : 'yellow'](`(${event.status}) ${event.file}`);
                console.log(`${size_label}   ${file_label}`);
            }
        });
        console.error(`\n> Finished in ${_commonjsHelpers.elapsed(start)}. Type ${_commonjsHelpers.$.bold().cyan(`npx serve ${dest}`)} to run the app.`);
    }
    catch (err) {
        console.error(_commonjsHelpers.$.bold().red(`> ${err.message}`));
        process.exit(1);
    }
}));
prog.parse(process.argv, { unknown: (arg) => `Unknown option: ${arg}` });
function _build(bundler, legacy, cwd, src, routes, output, dest, ext) {
    return _commonjsHelpers.__awaiter(this, void 0, void 0, function* () {
        const { build } = yield Promise.resolve().then(function () { return require('./build.js'); });
        yield build({
            bundler,
            legacy,
            cwd,
            src,
            routes,
            dest,
            ext,
            output,
            oncompile: event => {
                let banner = `built ${event.type}`;
                let c = (txt) => _commonjsHelpers.$.cyan(txt);
                const { warnings } = event.result;
                if (warnings.length > 0) {
                    banner += ` with ${warnings.length} ${warnings.length === 1 ? 'warning' : 'warnings'}`;
                    c = (txt) => _commonjsHelpers.$.cyan(txt);
                }
                console.log();
                console.log(c(`┌─${_commonjsHelpers.repeat('─', banner.length)}─┐`));
                console.log(c(`│ ${_commonjsHelpers.$.bold(banner)} │`));
                console.log(c(`└─${_commonjsHelpers.repeat('─', banner.length)}─┘`));
                console.log(event.result.print());
            }
        });
    });
}
//# sourceMappingURL=cli.js.map
