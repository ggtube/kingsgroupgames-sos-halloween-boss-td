import utilits 		from '../Build/Deploy.Build.mjs';
import _ 			from 'lodash';
import colors 		from 'colors/safe';
import fs 			from 'fs';
import fse 			from 'fs-extra';

const __dirname = fse.realpathSync('.');

export default {

	getMraidReleasePath(global_release_path) {

		return global_release_path + "/mraid/";

	},

	start(global_release_path, options = {}) {

		return new Promise((resolve) => {

			if (!_.includes(process.argv, '--release-mraid') && !_.includes(process.argv, '--deploy-mraid')) return resolve();

			console.log(colors.cyan('Create Mraid release...'));

			this.mraidReleasePath = options.path || this.getMraidReleasePath(global_release_path);

			this.gameName = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

			utilits.createPath(this.mraidReleasePath);

			this.build(options, () => {

				console.log(colors.cyan('Mraid release created!'));

				resolve();

			});

		});

	},

	build(options, next) {

		const settings_array = utilits.getSettings();

		this.modifySettings(settings_array, options);

		this.createScript(this.mraidReleasePath);

		_.each(settings_array, (settings) => {

			utilits.injectAssetsIntoSettings(settings);

			utilits.base64Settings(settings);

			const assets_str = JSON.stringify(settings.Assets);

			this.clearAssets(settings);

			utilits.createTag(this.mraidReleasePath, 'Tag.Mraid.tpl', settings, {
				injectMraidJs: _.includes(["sega"], settings["publisher"]),
				settingsString: utilits.formatSettings(settings)
			});

			utilits.createTag(this.mraidReleasePath, 'Tag.Mraid.tpl', settings, {
				tagFileName: settings["name"] + "-mraid-tag.txt",
				injectMraidJs: _.includes(["sega"], settings["publisher"]),
				settingsString: utilits.formatSettings(settings)
			});

			utilits.createTag(this.mraidReleasePath, 'Tag.Mraid.tpl', settings, {
				tagFileName: settings["name"] + '-mraid-tag-minimal.txt',
				injectMraidJs: _.includes(["sega"], settings["publisher"]),
				loaderScript: 'Builds/' + this.getLoaderWithSettingsScriptName(this.mraidReleasePath, settings)
			});

			fse.copySync(`${__dirname}/${settings.name}-preview.html`, `${this.mraidReleasePath}/${settings.name}-preview.html`);

			utilits.copySettingAssets(this.mraidReleasePath, settings);

			this.createLoaderWithSettings(this.mraidReleasePath, settings);

			this.createScriptWithAssets(this.mraidReleasePath, settings, assets_str);

			//this.checkSize(settings, 5000000);

		});

		if (next) next();

	},

	modifySettings(settings_array, options = {}) {

		_.each(settings_array, (settings) => {

			settings["version"] += "." + Date.now();
			settings["assets-quality"]["default"] = "high";

			settings.Assets = _.pickBy(settings.Assets, function(o) {return !(o["mraid-release"] === "skip")});

			if (options.assetsPath) settings["assets-path"]["default"] = options.assetsPath;

		});

	},

	clearAssets(settings) {

		_.each(settings.Assets, function(asset) {

			if (asset.url && asset.url.length > 100) delete asset.url;

			if (asset.json && asset.json.length > 100) delete asset.json;

			if (asset.text && asset.text.length > 100) delete asset.text;

		});

	},

	createScript(release_path) {

		fse.copySync(`${__dirname}/Builds/${this.gameName}.min.js`, `${release_path}/Builds/${this.gameName}.min.js`);
		fse.copySync(`${__dirname}/Builds/${this.gameName}-loader.min.js`, `${release_path}/Builds/${this.gameName}-loader.min.js`);

		fse.copySync(`${__dirname}/CreativePreview`, `${release_path}/CreativePreview`);
		fse.copySync(`${__dirname}/index.html`, `${release_path}/index.html`);

	},

	createScriptWithAssets(release_path, settings, assets_str) {

		const script = fse.readFileSync(`${__dirname}/Builds/${this.gameName}.min.js`);

		assets_str = 'Settings.Assets = ' + assets_str + ';\r\n\r\n';

		fse.writeFileSync(release_path + 'Builds/' + this.getScriptWithAssetsScriptName(release_path, settings), assets_str + script, 'utf8');

	},

	createLoaderWithSettings(release_path, settings) {

		const loader = fse.readFileSync(`${__dirname}/Builds/${this.gameName}-loader.min.js`);

		const if_settings_str = 'if (window.Settings) window.SettingsValues = window.Settings;\r\n\r\n';

		const settings_str = 'Settings = ' + utilits.formatSettings(settings, {offset: ''}) + ';\r\n\r\n';

		fse.writeFileSync(release_path + 'Builds/' + this.getLoaderWithSettingsScriptName(release_path, settings), if_settings_str + settings_str + loader, 'utf8');

	},

	getScriptWithAssetsScriptName(release_path, settings) {

		return this.gameName + '-with-assets-' + settings["name"] + '.min.js';

	},

	getLoaderWithSettingsScriptName(release_path, settings) {

		return this.gameName + '-loader-with-settings-' + settings["name"] + '.min.js';

	},

	checkSize: function(settings, limit) {

		utilits.forEachQuality((quality) => {

			const size = utilits.calculateSettingAssetsSize(settings, quality, this.mraidReleasePath);

			const size_txt = Math.round(size / 10000) / 100;

			if (size <= limit) console.log(colors.green(`Mraid: '${settings.name}' -> ${quality}; Size: ${size_txt} megabytes`));
			else console.log(colors.gray(`Mraid: '${settings.name}' -> ${quality}; Size: ${size_txt} megabytes`));

		});

	}

}