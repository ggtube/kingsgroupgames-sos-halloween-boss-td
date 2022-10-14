//Combining javascript logic

import fs 			from 'fs-extra';
import fs_path 		from 'path';
import _ 			from 'lodash';
import pako 		from 'pako';
import request 		from 'sync-request';
import jsonminify 	from "jsonminify";
import path_module	from 'path';

const __dirname = fs.realpathSync('.');

export default {

	//returns array of ad Settings objects (new not modified copy)
	getSettings() {

		const result = [];

		const setting_files = fs.readdirSync(__dirname + '/Settings');

		for (let i = 0; setting_files[i]; i++) {

			result.push(JSON.parse(jsonminify(fs.readFileSync(__dirname + '/Settings/' + setting_files[i]).toString())));

		}

		return result;

	},

	//Accept one settings object
	injectAssetsIntoSettings(settings) {

		const assets = settings.Assets;

		const assets_quality = settings["assets-quality"]["default"];

		_.each(assets, function(asset, asset_key) {

			let quality = asset["quality"] || assets_quality;

			if (asset["compress"] === false) quality = "high";

			if (asset.inject) {

				if (asset.type === 'atlas') {

					if (asset.url.indexOf('http') === 0) {

						//inject atlas json data from external source

					} else if (asset.json) {

						//This is ok - json already in settings

					} else {

						let target_url = __dirname + '/' + asset.url;

						if (quality === 'medium') target_url = target_url.replace('.json', '.medium.json');
						if (quality === 'low') target_url = target_url.replace('.json', '.low.json');

						let atlas_txt = fs.readFileSync(target_url).toString();

						asset.json = JSON.parse(atlas_txt);

						asset.image = asset.json.meta.image;

					}

				} else if (asset.type === 'json') {

					if (asset.url.indexOf('http') === 0) {

						//Can't inject asset json data from external source

					} else if (asset.json) {

						//This is ok - json already in settings

					} else {

						let target_url = __dirname + '/' + asset.url;

						let json_txt = fs.readFileSync(target_url).toString();

						asset.json = JSON.parse(json_txt);

					}

				} else if (asset.type === 'text') {

					if (asset.url.indexOf('http') === 0) {

						//Can't inject asset json data from external source

					} else if (asset.json) {

						//This is ok - json already in settings

					} else {

						let target_url = __dirname + '/' + asset.url;

						asset.text = fs.readFileSync(target_url).toString();

					}

				} else if (asset.type === 'web-font') {

					//TODO: Not worked

					if (asset.url.indexOf('http') === 0) {

						//Can't inject font css data from external source

					} else if (asset.url.indexOf('data:') === 0) {

						//This is ok - css already in settings

					} else {

						let target_url = __dirname + '/' + asset.url;

						let css_txt = fs.readFileSync(target_url).toString();

						asset.url = 'data:text/css;base64,' + Buffer.from(css_txt).toString('base64');

					}

				}

			}

		});

	},

	//Make base64 strings
	base64Settings(settings, is_force) {

		const assets = settings.Assets;

		_.each(assets, (asset, asset_key) => {

			const asset_release_settings = this.getAssetReleaseSettings(settings, asset);

			const asset_quality = this.getAssetQuality(settings, asset);

			if (is_force && asset_release_settings.skip) {

				delete settings.Assets[asset_key];

				return;

			}

			if (!is_force && (!asset.base64 || asset.base64 === "skip")) return;

			this.collapseRandomSettingsAsset(settings, asset);

			if (asset.url.indexOf('http') === 0 && asset.type !== 'web-font') {

				console.warn(colors.cyan("Can't make base64 data from external source: " + asset.url));

			} else if (asset.url.indexOf('data:') === 0) {

				//This is ok - already in base64

			} else {

				let target_url = __dirname + '/' + asset.url;

				if (asset.type === 'image') {

					if (_.endsWith(asset.url.toLowerCase(), '.jpg')) {

						if (asset_quality === 'medium') target_url = target_url.replace('.jpg', '.medium.jpg');
						if (asset_quality === 'low') target_url = target_url.replace('.jpg', '.low.jpg');

						settings.Assets[asset_key].url = 'data:image/jpeg;base64,' + fs.readFileSync(target_url).toString('base64');

					} else if (_.endsWith(asset.url.toLowerCase(), '.png')) {

						if (asset_quality === 'medium') target_url = target_url.replace('.png', '.medium.png');
						if (asset_quality === 'low') target_url = target_url.replace('.png', '.low.png');

						settings.Assets[asset_key].url = 'data:image/png;base64,' + fs.readFileSync(target_url).toString('base64');

					}

				} else if (asset.type === 'sound') {

					let format = "mp3";
					if (asset_release_settings && asset_release_settings.format) format = asset_release_settings.format;

					if (asset_quality === 'medium') target_url = target_url.replace('.{ogg,mp3}', '.64kbps.{ogg,mp3}').replace('.mp3', '.64kbps.mp3');
					if (asset_quality === 'low') target_url = target_url.replace('.{ogg,mp3}', '.32kbps.{ogg,mp3}').replace('.mp3', '.32kbps.mp3');

					settings.Assets[asset_key].url = 'data:audio/mpeg;base64,' + fs.readFileSync(target_url.replace('{ogg,mp3}', format)).toString('base64');

				} else if (asset.type === 'video') {

					let format = "mp4";
					if (asset_release_settings && asset_release_settings.format) format = asset_release_settings.format;
					else if (target_url.indexOf('.webm') > -1) format = 'webm';

					if (asset_quality === 'medium') target_url = target_url.replace('.mp4', '.medium.mp4').replace('.webm', '.medium.webm');
					if (asset_quality === 'low') target_url = target_url.replace('.mp4', '.low.mp4').replace('.webm', '.low.webm');

					let base64 = 'data:video/' + format + ';base64,' + fs.readFileSync(target_url).toString('base64');

					//TODO: make possibility to save some assets to compressed js file
					/*if (asset.base64 && asset.base64.saveTo === "game-code" && make_combined) {

						var game_code = fs.readFileSync(__dirname + '/Builds/' + config.name + '.min.js', 'utf8');

						game_code += `\nSettings.Assets["${asset_key}"]["url"] = "${base64}";`;

						fs.writeFileSync(__dirname + '/Builds/' + config.name + '.min.js', game_code, 'utf8');

					} else {*/

					settings.Assets[asset_key].url = base64;

					//}

				} else if (asset.type === 'json') {

					//Remove a lot of whitespaces using JSON parse / stringify
					settings.Assets[asset_key].pako = pako.deflate(JSON.stringify(JSON.parse(fs.readFileSync(target_url).toString())), { to: 'string' });

				} else if (asset.type === 'three-fbx' || asset.type === 'three-glb') {

					const data_base64 = 'data:application/octet-stream;base64,' + fs.readFileSync(target_url).toString('base64');

					settings.Assets[asset_key].pako = pako.deflate(data_base64, { to: 'string' });

				} else if (asset.type === 'web-font') {

					let css_txt;

					if (asset.url.indexOf('http') === 0 || asset.url.indexOf('http') === 1) {

						let response = request('GET', asset.url);

						css_txt = response.getBody('utf8');

					} else css_txt = fs.readFileSync(target_url).toString();

					let css_path = 'Fonts';

					const font_urls = _.map(css_txt.match(/url\(.*?\)/g), (font_url) => {

						return font_url.replace(/(url\(|\)|'|")/g,'');

					});

					_.each(font_urls, function(url) {

						url = url.replace(/(url\(|\)|'|")/g,'');

						if (url.indexOf('data:') === 0 || url.indexOf('data:') === 1) return;

						let font_base64 = '';

						if (url.indexOf('http') === 0 || url.indexOf('http') === 1) {

							let response = request('GET', url);

							font_base64 = 'data:application/octet-stream;base64,' + response.body.toString('base64');

						} else {

							font_base64 = 'data:application/octet-stream;base64,' + fs.readFileSync(__dirname + '/' + css_path + '/' + url).toString('base64');

						}

						if (_.endsWith(url.toLowerCase(), '.ttf')) {

							font_base64 = font_base64.replace('application/octet-stream', 'font/truetype;charset=utf-8');

						} else if (_.endsWith(url.toLowerCase(), '.otf')) {

							font_base64 = font_base64.replace('application/octet-stream', 'font/opentype;charset=utf-8');

						} else if (_.endsWith(url.toLowerCase(), '.woff')) {

							font_base64 = font_base64.replace('application/octet-stream', 'font/woff;charset=utf-8');

						} else if (_.endsWith(url.toLowerCase(), '.woff2')) {

							font_base64 = font_base64.replace('application/octet-stream', 'font/woff2;charset=utf-8');

						}

						css_txt = css_txt.replace(url, font_base64);

					});

					settings.Assets[asset_key].url = 'data:text/css;base64,' + Buffer.from(css_txt).toString('base64');

				} else if (asset.type === 'atlas') {

					if (asset_quality === 'medium') target_url = target_url.replace('.json', '.medium.json');
					if (asset_quality === 'low') target_url = target_url.replace('.json', '.low.json');

					let atlas_txt = fs.readFileSync(target_url).toString();

					let atlas_json = JSON.parse(atlas_txt);

					let atlas_path = asset.url.substr(0, asset.url.lastIndexOf('/'));

					let image_url = atlas_json.meta.image;

					let image_base64 = 'data:application/octet-stream;base64,' + fs.readFileSync(__dirname + '/' + atlas_path + '/' + image_url).toString('base64');

					if (_.endsWith(image_url.toLowerCase(), '.jpg')) image_base64 = image_base64.replace('application/octet-stream', 'image/jpeg');

					else if (_.endsWith(image_url.toLowerCase(), '.png')) image_base64 = image_base64.replace('application/octet-stream', 'image/png');

					settings.Assets[asset_key].image = image_base64;

					//Remove a lot of whitespaces using JSON parse / stringify
					settings.Assets[asset_key].pako = pako.deflate(JSON.stringify(atlas_json), { to: 'string' });

				}

			}

		});

		_.each(settings, function(value, key) {

			if (value.type === 'css') {

				if (!is_force && !settings[key].base64) return;

				_.each(settings[key]["default"], function(style_value, style_name) {

					if (style_value && style_value.match) {

						let url_match = style_value.match(/url\((.*?)\)/);

						if (url_match) {

							let image_url = style_value.match(/url\((.*?)\)/)[1].replace(/url('|")/g, '');

							if (fs.existsSync(__dirname + '/' + image_url)) {

								let image_base64 = 'data:application/octet-stream;base64,' + fs.readFileSync(__dirname + '/' + image_url).toString('base64');

								if (_.endsWith(image_url.toLowerCase(), '.jpg')) image_base64 = image_base64.replace('application/octet-stream', 'image/jpeg');

								else if (_.endsWith(image_url.toLowerCase(), '.png')) image_base64 = image_base64.replace('application/octet-stream', 'image/png');

								style_value = style_value.replace(/url\((.*?)\)/, 'url("' + image_base64 + '")');

								settings[key]["default"][style_name] = style_value;

							} else {

								settings[key]["default"][style_name] = '';

							}

						}

					}

				});

			}

		});

	},

	formatSettings(settings, options) {

		if (!options) options = {};

		if (!('offset' in options)) options["offset"] = '\t\t\t';

		const new_settings = {};

		_.each(settings, function(first_level_value, first_level_key) {

			if (_.includes(['Assets', 'Gameplay', 'Tutorial', 'CallToAction'], first_level_key)) {

				new_settings['$!1' + first_level_key] = {};

				_.each(first_level_value, function(second_level_value, second_level_key) {

					new_settings['$!1' + first_level_key]['$!2' + second_level_key] = second_level_value;

				});

				new_settings['$!1' + first_level_key]['$!e2'] = 1;

			} else if (!_.includes(['setting_file_path'], first_level_key)) {

				new_settings['$!1' + first_level_key] = first_level_value;

			}

		});

		new_settings['$!e1'] = 1;

		let string = JSON.stringify(new_settings);

		string = _.replace(string, /,"\$\!e1":1/g, "\r\n");
		string = _.replace(string, /"\$\!e1":1/g, "\r\n");

		string = _.replace(string, /,"\$\!e2":1/g, "\r\n\t");
		string = _.replace(string, /"\$\!e2":1/g, "\r\n\t");

		string = _.replace(string, /"\$\!1/g, "\r\n\t\"");
		string = _.replace(string, /"\$\!2/g, "\r\n\t\t\"");

		string = string.replace(/^/gm, options["offset"]);
		string = string.replace(/^    $/gm, '');

		return string;

	},

	createPath(path) {

		fs.ensureDirSync(fs_path.parse(path).dir);

	},

	createTags(release_path, template_file, settings_array) {

		_.each(settings, (settings) => {

			this.createTag(release_path, template_file, settings);

		});

	},

	createTag: function(release_path, template_file, settings, options) {

		if (!options) options = {};

		let html = this.processTag(template_file, settings, options);

		this.createPath(release_path + settings["name"] + '.html');

		fs.writeFileSync(release_path + (options.tagFileName || (settings["name"] + '.html')), html, 'utf8');

		if (options.txt) fs.writeFileSync(release_path + (options.tagFileName || (settings["name"] + '.html')).replace('.html', '.txt'), html, 'utf8');

	},

	copyScripts(release_path) {

		const game_name = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

		//Copy js files
		fs.copySync(`${__dirname}/Builds/${game_name}-loader.min.js`, `${release_path}/Builds/${game_name}-loader.min.js`);
		fs.copySync(`${__dirname}/Builds/${game_name}-code.min.js`, `${release_path}/Builds/${game_name}.min.js`);

	},

	copySettingsAssets(release_path, settings_array) {

		_.each(settings_array, (settings) => {

			this.copySettingAssets(release_path, settings);

		});

	},

	copySettingAssets(release_path, settings, qualities, options) {

		settings = _.cloneDeep(settings);

		if (!qualities) qualities = ['high', 'medium', 'low'];

		if (!options) options = {};

		let quality_postfix = {
			images: {high: '', medium: '.medium', low: '.low'},
			atlases: {high: '', medium: '.medium', low: '.low'},
			sounds: {high: '', medium: '.64kbps', low: '.32kbps'},
			videos: {high: '', medium: '.medium', low: '.low'}
		};

		/*### CSS IMAGES ###*/

		const css_images = [];

		_.each(["loading-background-styles", "loading-icon-styles", "loading-icon-publisher-styles", "close-button-styles", "loading-progress-styles", "bottom-banner-icon", "top-banner-icon", "bottom-banner-star", "top-banner-star"].filter(name => settings[name]), (el_name) => {

			_.each(settings[el_name]["default"], (style_value, style_property) => {

				if (typeof style_value === "string") {

					const match = style_value.match(/url\((.*)\)/);

					if (match) {

						if (options.normalizeName) {

							const image = {source: match[1], dest: ''};

							style_value = style_value.replace(/url\((.*)\)/, (str, p1) => `url(${options.normalizeName(p1)})`);

							image.dest = style_value.match(/url\((.*)\)/)[1];

							settings[el_name]["default"][style_property] = style_value;

							css_images.push(image);

						} else {

							css_images.push({source: match[1], dest: match[1]});

						}

					}

				}

			});

		});

		_.each(css_images, (image) => {

			if (!image) return;

			if (fs.existsSync(`${__dirname}/${image.source}`)) fs.copySync(`${__dirname}/${image.source}`, `${release_path}/${this.modifyTargetPath(image.dest, options)}`);

		});

		/*### COPY ASSET FILES ###*/

		this.expandRandomSettingsAssets(settings);

		for (let i = 0; i < qualities.length; i++) {

			let assets_quality = qualities[i];

			_.each(settings.Assets, (asset) => {

				const asset_release_settings = this.getAssetReleaseSettings(settings, asset, assets_quality);

				const asset_quality = this.getAssetQuality(settings, asset, assets_quality);

				//Skip base64 encoded assets
				if (asset.base64 === true) return;

				//Skip release specified files
				if (asset_release_settings.skip === true) return;

				if (asset.type === 'web-font') {

					if (asset.url.match(/^http(s?):\/\//)) return;

					let font_links = [];

					let font_link_temp;

					let regex = /url\('(.*?)'\)/g;

                    while ((font_link_temp = regex.exec(fs.readFileSync(`${__dirname}/${asset.url}`, {encoding: 'utf-8'}))) !== null) {

                    	if (font_link_temp.index === regex.lastIndex) regex.lastIndex++;

                        font_links.push({source: font_link_temp[1], dest: options.normalizeName ? options.normalizeName(font_link_temp[1]) : font_link_temp[1]});

                    }

					for (let i = 0; i < font_links.length; i++) {

						fs.copySync(`${__dirname}/Fonts/${font_links[i].source}`, `${release_path}/${this.modifyTargetPath((options.normalizeName ? options.normalizeName('Fonts/') : 'Fonts/') + font_links[i].dest, options)}`);

					}

                    let font_css_file = fs.readFileSync(`${__dirname}/${asset.url}`, {encoding: 'utf-8'});

					if (options.normalizeName) {

						font_css_file = font_css_file.replace(/url\('(.*?)'\)/g, (str, p1) => `url('${options.normalizeName(p1)}')`);

						asset.url = options.normalizeName(asset.url);

					}

                    fs.writeFileSync(`${release_path}${this.modifyTargetPath(options.normalizeName ? options.normalizeName(asset.url) : asset.url, options)}`, font_css_file);

				}

				if (asset.type === 'bitmap-font') {

					if (options.normalizeName) {

						fs.copySync(`${__dirname}/${asset.url}`, `${release_path}/${this.modifyTargetPath(options.normalizeName(asset.url), options)}`);

						fs.copySync(`${__dirname}/${asset.url.replace('.fnt', '.png')}`, `${release_path}/${this.modifyTargetPath(options.normalizeName(asset.url.replace('.fnt', '.png')), options)}`);

					} else {

						fs.copySync(`${__dirname}/${asset.url}`, `${release_path}/${this.modifyTargetPath(asset.url, options)}`);

						fs.copySync(`${__dirname}/${asset.url.replace('.fnt', '.png')}`, `${release_path}/${this.modifyTargetPath(asset.url.replace('.fnt', '.png'), options)}`);

					}

				}

				if (asset.type === 'image') {

					if (asset.url && !asset.url.match(/^http(s?):\/\//)) {

						let file_name = this.addFilePostfix(asset.url, quality_postfix.images[asset_quality]);

						let dest_file_name = file_name;

						if (options.normalizeName) {

							dest_file_name = options.normalizeName(dest_file_name);

							asset.url = options.normalizeName(asset.url);

						}

						fs.copySync(`${__dirname}/${file_name}`, `${release_path}/${this.modifyTargetPath(dest_file_name, options)}`);

					}

				}

				if (asset.type === 'video') {

					let asset_url = asset.url;

					if (asset.jsmpeg) asset_url = asset_url.replace('.mp4', '.ts');

					let file_name = this.addFilePostfix(asset_url, quality_postfix.videos[asset_quality]);

					let dest_file_name = file_name;

					if (options.normalizeName) {

						dest_file_name = options.normalizeName(dest_file_name);

						asset.url = options.normalizeName(asset.url);

					}

					fs.copySync(`${__dirname}/${file_name}`, `${release_path}/${this.modifyTargetPath(dest_file_name, options)}`);

				}

				if (asset.type === 'atlas') {

					let file_path = this.addFilePostfix(asset.url, quality_postfix.images[asset_quality]);

					let file_path_dest = file_path;

					let json = JSON.parse(fs.readFileSync(`${__dirname}/${file_path}`, {encoding: 'utf-8'}));

					let path = asset.url.split('/').slice(0, -1).join('/');

					let image_path = path + '/' + json.meta.image;

					let image_path_dest = image_path;

					if (options.normalizeName) {

						file_path_dest = options.normalizeName(file_path_dest);

						image_path_dest = options.normalizeName(image_path_dest);

						json.meta.image = options.normalizeName(json.meta.image);

						asset.url = options.normalizeName(asset.url);

					}

					fs.copySync(`${__dirname}/${image_path}`, `${release_path}/${this.modifyTargetPath(image_path_dest, options)}`);

					if (!asset.inject) fs.writeFileSync(`${release_path}/${this.modifyTargetPath(file_path_dest, options)}`, JSON.stringify(json));

				}

				if (asset.type === 'sound') {

					let extensions = asset.url.match(/{(.*)}$/);

					if (extensions) extensions = extensions[1].split(',');
					else extensions = [asset.url.match(/\.(\w*)$/)[1]];

					let sound_name = fs_path.parse(asset.url).dir + '/' + fs_path.parse(asset.url).name;

					if (options.normalizeName) {

						if (extensions.length > 1) asset.url = `${options.normalizeName(sound_name)}.{${extensions.join(',')}}`;
						else asset.url = `${options.normalizeName(sound_name)}.${extensions[0]}`;

					}

					_.each(extensions, (ext) => {

						let sound_url = this.addFilePostfix(sound_name + '.' + ext, quality_postfix.sounds[asset_quality]);

						if (!fs.existsSync(`${__dirname}/${sound_url}`)) throw new Error(`file ${sound_url} doesn't exists`);

						fs.copySync(`${__dirname}/${sound_url}`, `${release_path}/${this.modifyTargetPath(options.normalizeName ? options.normalizeName(sound_url) : sound_url, options)}`);

					});

				}

				if (asset.type === 'text' || asset.type === 'json') {

					if (!asset.inject) {

						if (!fs.existsSync(`${__dirname}/${asset.url}`)) throw new Error(`file ${asset.url} doesn't exists`);

						fs.copySync(`${__dirname}/${asset.url}`, `${release_path}/${this.modifyTargetPath(options.normalizeName ? options.normalizeName(asset.url) : asset.url, options)}`);

						if (options.normalizeName) asset.url = options.normalizeName(asset.url);

					}

				}

				if (asset.type === 'custom' || asset.type === "three-fbx" || asset.type === 'three-glb') {

					if (!fs.existsSync(`${__dirname}/${asset.url}`)) throw new Error(`file ${asset.url} doesn't exists`);

					fs.copySync(`${__dirname}/${asset.url}`, `${release_path}${options.normalizeName ? options.normalizeName(asset.url) : asset.url}`);

					if (options.normalizeName) asset.url = options.normalizeName(asset.url);

				}

			});

		}

	},

	expandRandomSettingsAssets(settings) {

		for (let name in settings.Assets) if (settings.Assets.hasOwnProperty(name)) {

			let asset = settings.Assets[name];

			if (asset["url"] && asset["url"].indexOf('?') > -1) {

				if (asset["values"]) {

					this.expandRandomSettingsAsset(settings, name, asset, asset["values"]);

				} else if (asset["valueFrom"]) {

					if (asset["valueFrom"] in settings) {

						this.expandRandomSettingsAsset(settings, name, asset, settings[asset["valueFrom"]]["values"]);

					} else if (asset["valueFrom"] in settings.Assets) {

						this.expandRandomSettingsAsset(settings, name, asset, settings.Assets[asset["valueFrom"]]["values"]);

					}

				}

				delete settings.Assets[name];

			}

		}

	},

	expandRandomSettingsAsset(settings, name, asset, values) {

		for (let i=0; i<values.length; i++) {

			let new_asset = _.cloneDeep(asset);

			new_asset["url"] = asset["url"].replace("?", values[i]);

			settings.Assets[name + '-' + values[i]] = new_asset;

		}

	},

	collapseRandomSettingsAssets(settings) {

		for (let name in settings.Assets) if (settings.Assets.hasOwnProperty(name)) {

			this.collapseRandomSettingsAsset(settings, settings.Assets[name], name);

		}

	},

	collapseRandomSettingsAsset(settings, asset, name) {

		if (asset["url"] && asset["url"].indexOf('?') > -1) {

			if (asset["values"]) {

				asset["randomValue"] = Math.floor(Math.random() * asset["values"].length);

				this.applyRandomSettingsAsset(settings, name, asset, asset["values"], asset["values"][asset["randomValue"]]);

			} else if (asset["valueFrom"]) {

				if (asset["valueFrom"] in settings) {

					if (settings[asset["valueFrom"]]["default"] === '#random') settings[asset["valueFrom"]]["default"] = settings[asset["valueFrom"]]["values"][Math.floor(Math.random() * settings[asset["valueFrom"]]["values"].length)];

					this.applyRandomSettingsAsset(settings, name, asset, settings[asset["valueFrom"]]["values"], settings[asset["valueFrom"]]["default"]);

				} else if (asset["valueFrom"] in settings.Assets) {

					if (!("randomValue" in settings.Assets[asset["valueFrom"]])) settings.Assets[asset["valueFrom"]]["randomValue"] = Math.floor(Math.random() * settings.Assets[asset["valueFrom"]]["values"].length);

					this.applyRandomSettingsAsset(settings, name, asset, settings.Assets[asset["valueFrom"]]["values"], settings.Assets[asset["valueFrom"]]["values"][settings.Assets[asset["valueFrom"]]["randomValue"]]);

				}

			}

		}

	},

	applyRandomSettingsAsset(settings, name, asset, values, chosen_value) {

		if (chosen_value === undefined || !_.includes(values, chosen_value)) chosen_value = values[Math.floor(Math.random() * values.length)];

		asset["url"] = asset["url"].replace("?", chosen_value);

	},

	modifyTargetPath(file_path, options) {

		let target_file_path = file_path;

		if (options.flatten) target_file_path = path_module.basename(target_file_path);

		return target_file_path;

	},

	calculateSettingAssetsSize(settings, assets_quality, dirname) {

		if (!dirname) dirname = __dirname;

		let size = 0;

		let quality_postfix = {
			images: {high: '', medium: '.medium', low: '.low'},
			atlases: {high: '', medium: '.medium', low: '.low'},
			sounds: {high: '', medium: '.64kbps', low: '.32kbps'},
			videos: {high: '', medium: '.medium', low: '.low'}
		};

		size += fs.statSync(`${dirname}/${settings['game-code-url']}`).size || 0;
		size += fs.statSync(`${dirname}/${settings['game-loader-url']}`).size || 0;

		/*### CSS IMAGES ###*/

		const css_images = [];

		if (settings["loading-background-styles"]["default"]["background"]) css_images.push(settings["loading-background-styles"]["default"]["background"].match(/url\((.*)\)/));
		if (settings["loading-icon-styles"]["default"]["background"]) css_images.push(settings["loading-icon-styles"]["default"]["background"].match(/url\((.*)\)/));
		if (settings["loading-icon-publisher-styles"]["default"]["background"]) css_images.push(settings["loading-icon-publisher-styles"]["default"]["background"].match(/url\((.*)\)/));
		if (settings["close-button-styles"]["default"]["backgroundImage"]) css_images.push(settings["close-button-styles"]["default"]["backgroundImage"].match(/url\((.*)\)/));
		if (settings["bottom-banner-icon"] && settings["bottom-banner-icon"]["default"]["backgroundImage"]) css_images.push(settings["bottom-banner-icon"]["default"]["backgroundImage"].match(/url\((.*)\)/));
		if (settings["top-banner-icon"] && settings["top-banner-icon"]["default"]["backgroundImage"]) css_images.push(settings["top-banner-icon"]["default"]["backgroundImage"].match(/url\((.*)\)/));
		if (settings["bottom-banner-star"] && settings["bottom-banner-star"]["default"]["backgroundImage"]) css_images.push(settings["bottom-banner-star"]["default"]["backgroundImage"].match(/url\((.*)\)/));
		if (settings["top-banner-star"] && settings["top-banner-star"]["default"]["backgroundImage"]) css_images.push(settings["top-banner-star"]["default"]["backgroundImage"].match(/url\((.*)\)/));

		_.each(css_images, (image) => {

			if (!image) return;

			let image_url = image[1];

			if (fs.existsSync(`${dirname}/${image_url}`)) size += fs.statSync(`${dirname}/${image_url}`).size || 0;

		});

		/*### ASSET FILES ###*/

		_.each(settings.Assets, (asset, name) => {

			//Base64 encoded assets
			if (asset.url && asset.url.indexOf('data:') === 0) {

				size += asset.url.length;

				return;

			}

			this.collapseRandomSettingsAsset(settings, asset, name);

			if (asset.type === 'web-font') {

				if (asset.url.match(/^http(s?):\/\//)) return;

				let font_links = [];

				let font_link_temp;

				let regex = /url\('(.*?)'\)/g;

				while ((font_link_temp = regex.exec(fs.readFileSync(`${dirname}/${asset.url}`, {encoding: 'utf-8'}))) !== null) {

					if (font_link_temp.index === regex.lastIndex) regex.lastIndex++;

					font_links.push(font_link_temp[1]);

				}

				size += fs.statSync(`${dirname}/${asset.url.substring(0, asset.url.lastIndexOf('/'))}/${font_links[0]}`).size || 0;

			}

			if (asset.type === 'image') {

				const asset_quality = this.getAssetQuality(settings, asset, assets_quality);

				let file_name = this.addFilePostfix(asset.url, quality_postfix.images[asset_quality]);

				size += fs.statSync(`${dirname}/${file_name}`).size || 0;

			}

			if (asset.type === 'atlas') {

				const asset_quality = this.getAssetQuality(settings, asset, assets_quality);

				let file_name = this.addFilePostfix(asset.url, quality_postfix.images[asset_quality]);

				let json = JSON.parse(fs.readFileSync(`${dirname}/${file_name}`, {encoding: 'utf-8'}));

				let path = asset.url.split('/').slice(0, -1).join('/');

				let image_name = path + '/' + json.meta.image;

				size += fs.statSync(`${dirname}/${file_name}`).size || 0;

				size += fs.statSync(`${dirname}/${image_name}`).size || 0;

			}

			if (asset.type === 'sound') {

				let extensions = asset.url.match(/{(.*)}$/);

				if (extensions) extensions = extensions[1].split(',');
				else extensions = [asset.url.match(/\.(\w*)$/)[1]];

				let sound_name = fs_path.parse(asset.url).dir + '/' + fs_path.parse(asset.url).name;

				_.each(extensions, (ext) => {

					let sound_url = this.addFilePostfix(sound_name + '.' + ext, quality_postfix.sounds[assets_quality]);

					if (!fs.existsSync(`${dirname}/${sound_url}`)) return;

					size += fs.statSync(`${dirname}/${sound_url}`).size || 0;

				});

			}

			if (asset.type === 'text' || asset.type === 'json' || asset.type === 'custom' || asset.type === 'three-fbx' || asset.type === 'three-glb') {

				if (!fs.existsSync(`${dirname}/${asset.url}`)) throw new Error(`file ${asset.url} doesn't exists`);

				size += fs.statSync(`${dirname}/${asset.url}`).size || 0;

			}

		});

		return size;

	},

	processTag(template_file, settings, options) {

		return _.template(fs.readFileSync(__dirname + "/Deploy/Tags/" + template_file))({
			settings: settings,
			options: options || {}
		});

	},

	addFilePostfix(path, postfix) {

		if (path) return path.replace(/(\.\w*)$/, postfix + '$1');
		else return path;

	},

	forEachQuality(fn) {

		const quality_postfixes = {
			low: {images: '.low', atlases: '.low', sounds: '.32kbps', videos: '.low'},
			medium: {images: '.medium', atlases: '.medium', sounds: '.64kbps', videos: '.medium'},
			high: {images: '', atlases: '', sounds: '', videos: ''}
		};

		_.each(['low', 'medium', 'high'], function(quality) {

			fn(quality, quality_postfixes[quality]);

		});

	},

	getAssetReleaseSettings(settings, asset, quality) {

		if (!quality) quality = settings["assets-quality"]["default"];

		let publisher = settings["publisher"];

		let asset_release_settings = null;

		if (asset["release"] && asset["release"][publisher]) asset_release_settings = asset["release"][publisher];

		if (!asset_release_settings) if (asset["release"] && asset["release"]['*']) asset_release_settings = asset["release"]['*'];

		if (!asset_release_settings) asset_release_settings = {};

		else if (asset_release_settings[quality]) asset_release_settings = asset_release_settings[quality];

		return asset_release_settings;

	},

	getAssetQuality(settings, asset, quality) {

		if (asset["compress"] === false || asset["type"] === "image" || asset["type"] === "sound") return "high";

		if (!quality) quality = settings["assets-quality"]["default"];

		let asset_release_settings = this.getAssetReleaseSettings(settings, asset);

		return asset_release_settings["quality"] || asset["quality"] || quality;

	}

}