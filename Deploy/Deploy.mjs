import fs from 'fs';
import glob from "glob";

import gulp from 'gulp';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import babel from 'gulp-babel';
import _ from 'lodash';
import colors from 'colors/safe';
import zip from 'zip-folder';
import jsonminify from 'jsonminify';
import browserSync from 'browser-sync';

import https from 'https';

import tinify from "tinify";
tinify.key = "Fuv8_fZAA-I2oifPpDdQow4wUFDe9hl_";

import express from 'express';
import compression from 'compression';

import config from './../package.json';

const make_compress = _.includes(process.argv, '--compress');
const make_server = !_.includes(process.argv, '--noserver');
const make_combined = _.includes(process.argv, '--build');

import Utilits 		from "./Build/Deploy.Build";
import Compress 	from "./Build/Deploy.Compress";
import Showcase 	from "./Build/Deploy.Showcase";
import Tag 			from "./Tags/Tag";

const __dirname = fs.realpathSync('.');

export default {

	start: function() {

		const _this = this;

		let set_name = false;
		process.argv.forEach(item => { if (item.match(/set-name:(.*)/)) set_name = item.match(/set-name:(.*)/)[1] });

		let set_port = false;
		process.argv.forEach(item => { if (item.match(/set-port:(.*)/)) set_port = item.match(/set-port:(.*)/)[1] });

		if (set_name) {

			let prev_name = config.name;

			config.name = set_name;

			fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(config, null, '  '));

			fs.readdir(__dirname + '/Settings', function(err, files) {

				if (err) return;

				files.forEach(file => {

					let settings = fs.readFileSync(__dirname + '/Settings/' + file, {encoding: 'utf-8'});

					settings = settings.replace(new RegExp(prev_name, 'g'), set_name);

					let title_name = set_name.split('-').map(item => item.charAt(0).toUpperCase() + item.substr(1)).join(' ');

					settings = settings.replace(/"title":\s*"(.*)"/, '"title": "'+title_name+'"');

					fs.writeFileSync(__dirname + '/Settings/' + file, settings);

					fs.renameSync(__dirname + '/Settings/' + file, __dirname + '/Settings/' + file.replace(prev_name, set_name));

				});

			});

		}

		if (set_port) {

			let port = parseInt(set_port);

			if (isNaN(port)) throw new Error(`incorrect port: ${set_port}`);

			config.port = port;

			fs.writeFileSync(`${__dirname}/package.json`, JSON.stringify(config, null, '  '));

		}

		let loader = [
			'App/Libs/Broadcast/Broadcast.js',
			'App/Libs/Broadcast/Broadcast.Dom.js',
			'App/Libs/Pixi.Classes/Mraid.js',
			'App/Libs/Platform/platform.js',
			'App/Libs/WebFont/webfont.js',
			'App/Libs/Pixi.Classes/Loader.js'
		];

		if (fs.existsSync(`${__dirname}/App/Loader.js`)) loader.push('App/Loader.js');

		let files = [
			'App/Libs/Pixi/5.1.1-ga-ready/pixi-legacy.js',
			// 'App/Libs/Pixi/pixi-sound.js',
			'App/Libs/Howler/howler.min.js',
			'App/Libs/Pixi/5.1.1/pixi-spine.js',
			// 'App/Libs/Pixi/pixi-multistyle-text.umd.js',
			// 'App/Libs/Pixi/pixi-filters.js',
			// 'App/Libs/Pixi/pixi-projection.js',
			// 'App/Libs/Pixi/pixi-layers.js',
			// 'App/Libs/MatterJs/matter.min.js',
			'App/Libs/Underscore/underscore-min.js',
			// 'App/Libs/JSMpeg/jsmpeg.min.js',
			// 'App/Libs/Stats/stats.min.js',
			'App/Libs/GreenSock/1.20.4/TweenLite.js',
			// 'App/Libs/GreenSock/1.20.4/plugins/BezierPlugin.js',
			// 'App/Libs/GreenSock/1.20.4/plugins/ColorPropsPlugin.js',
			'App/Libs/GreenSock/1.20.4/easing/EasePack.js',
			// 'App/Libs/GreenSock/1.20.4/easing/CustomEase.js',
			// 'App/Libs/AmmoJS/ammo.js',
			// 'App/Libs/Three/three.min.js',
			// 'App/Libs/Three/threex.dynamictexture.js',
			// 'App/Libs/Three/OrbitControls.js',
			// 'App/Libs/Three/TrackballControls.js',
			// 'App/Libs/Three/FBXLoader.js',
			// 'App/Libs/Three/GLTFLoader.js',
			// 'App/Libs/Three/inflate.min.js',
			// 'App/Libs/Three/ThreeGUI.js',
			// 'App/Libs/Three/ThreeText.js',
			// 'App/Libs/Three/ThreeNineSlicePlane.js',
			// 'App/Libs/Three/AnimatedMap.js',
			// 'App/Libs/Three/AnimatedSpritePlane.js',
			// 'App/Libs/Three/Water.js',
			// 'App/Libs/Three/Reflector.js',
			// 'App/Libs/Three/Refractor.js',
			// 'App/Libs/Pixi.Classes/Pixi.TextChars.js',
			'App/Libs/Pixi.Classes/Class.js',
			'App/Libs/Pixi.Classes/Game.js',
			'App/Libs/Pixi.Classes/Game.Pixi.js',
			// 'App/Libs/Pixi.Classes/Game.Three.js',
			'App/Libs/Pixi.Classes/Screen.js',
			'App/Libs/Pixi.Classes/Screen.Pixi.js',
			'App/Libs/Pixi.Classes/Screen.Tween.js',
			'App/Libs/Pixi.Classes/Screen.Dom.js',
			'App/Libs/Pixi.Classes/Screen.Emitter.js',
			'App/Libs/Pixi.Classes/Screen.Text.js',
			// 'App/Libs/Pixi.Classes/Screen.Scene.js',
			// 'App/Libs/Pixi.Classes/Screen.Spriter.js',
			// 'App/Libs/Pixi.Classes/Screen.Three.js',
			// 'App/Libs/Pixi.Classes/Screen.VideoAd.js',
			'App/Libs/Pixi.Classes/Screen.VisualEffects.js',
			'App/Libs/Pixi.Classes/Screen.Underscore.js',
			// 'App/Libs/Pixi.Classes/Screen.Physics.js',
			// 'App/Libs/Pixi.Classes/Screen.Physics.MatterJS.js',
			// 'App/Libs/Pixi.Classes/Debug.js',
			// 'App/Libs/Pixi.Classes/Screen.CachedObjects.js',
			// 'App/Libs/Pixi.Classes/Service.js',
			// 'App/Libs/Pixi.Classes/Service.Request.js',
			// 'App/Libs/Pixi.Classes/Service.Socket.js',
			'App/Libs/Progressbar/progressbar.js',
			'App/App.js'
		];

		glob(__dirname + '/App/Screens/*.js', {}, function (er, list) {

			integration_tests();

			files = files.concat(list.map(function(item) {return item.substr(__dirname.length+1)}));

			glob(__dirname + '/App/Services/*.js', {}, function (er, list) {

				files = files.concat(list.map(function(item) {return item.substr(__dirname.length+1)}));

				fs.readdir(__dirname + '/Settings', function(err, settings) {

					gulp.task('code-js', function() {

						return gulp.src(files.map(function (item) {return (item.indexOf(__dirname) === 0) ? item : (__dirname + '/' + item);}))
							.pipe(sourcemaps.init())
							.pipe(babel({presets: [["es2015", { modules: false }]], plugins: ["transform-remove-strict-mode"], compact: true}))
							.pipe(concat(config.name + '.min.js'))
							.pipe(uglify())
							.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
							.pipe(sourcemaps.write('./'))
							.pipe(gulp.dest(__dirname + '/Builds'));

					});

					gulp.task('loader-js', function() {

						return gulp.src(loader.map(function (item) {return (item.indexOf(__dirname) === 0) ? item : (__dirname + '/' + item);}))
							.pipe(sourcemaps.init())
							.pipe(babel({presets: [["es2015", { modules: false }]], plugins: ["transform-remove-strict-mode"], compact: true}))
							.pipe(concat(config.name + '-loader.min.js'))
							.pipe(uglify())
							.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
							.pipe(sourcemaps.write('./'))
							.pipe(gulp.dest(__dirname + '/Builds'));

					});

					gulp.task('code-js-uncompressed', function() {

						return gulp.src(files.map(function (item) {return (item.indexOf(__dirname) === 0) ? item : (__dirname + '/' + item);}))
							.pipe(babel({presets: [["es2015", { modules: false }]], plugins: ["transform-remove-strict-mode"], compact: false}))
							.pipe(concat(config.name + '.js'))
							.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
							.pipe(gulp.dest(__dirname + '/Builds'));

					});

					gulp.task('loader-js-uncompressed', function() {

						return gulp.src(loader.map(function (item) {return (item.indexOf(__dirname) === 0) ? item : (__dirname + '/' + item);}))
							.pipe(babel({presets: [["es2015", { modules: false }]], plugins: ["transform-remove-strict-mode"], compact: false}))
							.pipe(concat(config.name + '-loader.js'))
							.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
							.pipe(gulp.dest(__dirname + '/Builds'));

					});

					let build_tasks = make_combined ? ['code-js', 'loader-js', 'code-js-uncompressed', 'loader-js-uncompressed'] : [];

					const settings_data = {};

					create_dev_html_files(settings, settings_data);

					gulp.task('watch', function () {

						watch([__dirname + '/Settings/*.json', __dirname + '/Textures/*.json', __dirname + '/App/**/*.js'], function() {

							watcher.apply(this, [arguments[0], settings, settings_data]);

							browserSync.reload();

						});

					});

					gulp.task('build', build_tasks);

					if (build_tasks.length > 0) console.log(colors.cyan('Build js files...'));

					gulp.start('build', function(err) {

						if (build_tasks.length > 0) console.log(colors.cyan('Build js files completed.'), err || '');

						if (make_compress) Compress.compressAssets(settings_data, step1);
						else step1();

						function step1() {

							_this.createRelease(settings_data, loader, files, () => {

								_this.deploy(() => {

									if (make_server) {

										const server = express();

										server.use(compression());

										server.use(function (req, res, next) {

											res.header("Access-Control-Allow-Origin", "*");
											res.header("Access-Control-Allow-Credentials", "true");
											res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
											res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

											next();

										});

										server.use(express.static(__dirname));

										server.listen(config.port, function () {

											console.log(colors.cyan('Server listening on port ' + config.port + '!'));

										});

										if (fs.existsSync(`${__dirname}/Deploy/Certificates/localhost.key`)) {

											const credentials = {
												key: fs.readFileSync(`${__dirname}/Deploy/Certificates/localhost.key`, 'utf8'),
												cert: fs.readFileSync(`${__dirname}/Deploy/Certificates/localhost.cer`, 'utf8')
											};

											const httpsServer = https.createServer(credentials, server);

											httpsServer.listen(config.port + 1000, function () {

												console.log(colors.cyan('Secure server listening on port ' + (config.port + 1000) + '!'));

											});

										}

										browserSync.init(null, {
											proxy: 'http://localhost:' + config.port,
											port: config.port
										});

										gulp.start('watch', function () {});

									} else {

										setTimeout(function () {

											//TODO wait all compressions and exit
											process.exit(0);

										}, 1000);

									}

								});

							});

						}

					});

				});

			});

		});

		const create_dev_html_files = function(settings, settings_data) {

			console.log(colors.cyan('Create dev html files...'));

			for (let i = 0; settings[i]; i++) {

				const setting = read_setting(settings_data, __dirname + '/Settings/' + settings[i]);

				if (fs.existsSync(setting.name + '.html')) fs.unlinkSync(setting.name + '.html');
				if (fs.existsSync(setting.name + '-preview.html')) fs.unlinkSync(setting.name + '-preview.html');

				Utilits.createTag('', '../../index.tpl', setting, {
					tagFileName: 'index.html'
				});

				Utilits.createTag('', '../../tag.tpl', setting, {
					tagFileName: setting.name + '.html',
					settingsString: Utilits.formatSettings(setting),
					files: loader.concat(files)
				});

				if (fs.existsSync('preview.tpl')) Utilits.createTag('', '../../preview.tpl', setting, {
					tagFileName: setting.name + '-preview.html',
					settingsString: Utilits.formatSettings(setting)
				});

			}

			console.log(colors.cyan('Create dev html files completed.'));

		};

		const read_setting = function(settings_data, path) {

			const setting = JSON.parse(jsonminify(fs.readFileSync(path).toString()));

			Utilits.injectAssetsIntoSettings(setting);

			settings_data[setting.name] = setting;

			settings_data[setting.name].setting_file_path = path;

			return setting;

		};

		const watcher = function(changed_file, settings, settings_data) {

			if (changed_file.path.indexOf('\\Settings\\') > 0 || changed_file.path.indexOf('/Settings/') > 0) {

				console.log('Setting file "' + changed_file.path.substr(changed_file.path.lastIndexOf('\\') + 1) + '" modified. Rebuild dev html files...');

				read_setting(settings_data, changed_file.path);

			} else if (changed_file.path.indexOf('\\Textures\\') > 0 || changed_file.path.indexOf('/Textures/') > 0) {

				//Due to TexturePacker behavior texture json file is not exist just after watcher detect it's first change.
				if (fs.existsSync(changed_file.path)) {

					console.log('Texture file "' + changed_file.path.substr(changed_file.path.lastIndexOf('\\') + 1) + '" modified. Rebuild tag files...');

					_.each(settings_data, function(setting_data) {

						read_setting(settings_data, setting_data.setting_file_path);

					});

				} else {

					return;

				}

			} else {

				console.log('Warning! Unknown file "' + changed_file.path.substr(changed_file.path.lastIndexOf('\\') + 1) + '" modified. Rebuild tag files...');

			}

			create_dev_html_files(settings, settings_data);

		};

		const integration_tests = function() {

			if (fs.existsSync(__dirname + '/App/Screens/Gameplay.js')) {

				const gameplay_txt = fs.readFileSync(__dirname + '/App/Screens/Gameplay.js').toString();

				if (gameplay_txt.indexOf('MRAID.markMeaningfulInteraction') === -1) console.log(colors.red('Warning!') + colors.gray(' MRAID integration issue: ') + colors.cyan('MRAID.markMeaningfulInteraction();') + colors.gray(' not found in Gameplay.js!'));

				if (gameplay_txt.indexOf('MRAID.track("Game Starts")') === -1 && gameplay_txt.indexOf('MRAID.track(\'Game Starts\')') === -1) console.log(colors.red('Warning!') + colors.gray(' MRAID integration issue: ') + colors.cyan('MRAID.track("Game Starts");') + colors.gray(' not found in Gameplay.js!'));

			}

			if (fs.existsSync(__dirname + '/App/Screens/CallToAction.js')) {

				const call_to_action_txt = fs.readFileSync(__dirname + '/App/Screens/CallToAction.js').toString();

				if (call_to_action_txt.indexOf('event: \'cta all\'') === -1) console.log(colors.red('Warning!') + colors.gray(' MRAID integration issue: ') + colors.cyan('"cta all" event') + colors.gray(' not found in CallToAction.js!'));

				if (call_to_action_txt.indexOf('button: \'cta\'') === -1 && call_to_action_txt.indexOf('button: "cta"') === -1) console.log(colors.red('Warning!') + colors.gray(' MRAID integration issue: ') + colors.cyan('"cta" button') + colors.gray(' not found in CallToAction.js!'));

			}

		};

	},

	createRelease(settings_data, loader_files, main_files, next) {

		if (!_.includes(process.argv, '--release')) return next();

		const game_name = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

		Tag.start(loader_files, main_files, function() {

			if (_.includes(process.argv, '--release-gzip')) {

				console.log(colors.cyan('Gziping release...'));

				zip(Tag.getReleasePath(), `${__dirname}/Releases/${game_name}-${Tag.getReleaseDir()}.tar.gz`, function (err) {

					console.log(colors.cyan('Release completed!'));

					if (next) next();

				});

			} else {

				console.log(colors.cyan('Release completed!'));

				if (next) next();

			}

		});

	},

	deploy(next) {

		if (!_.includes(process.argv, '--deploy')) return next();

		Showcase.updateShowcase(next);

	}

}
