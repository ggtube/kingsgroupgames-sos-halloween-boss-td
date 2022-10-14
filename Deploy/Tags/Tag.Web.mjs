import utilits 		from '../Build/Deploy.Build.mjs';
import _ 			from 'lodash';
import colors 		from 'colors/safe';
import fs 			from 'fs';
import fse 			from 'fs-extra';

const __dirname = fse.realpathSync('.');

export default {

	getWebReleasePath(global_release_path) {

		return global_release_path + "/web/";

	},

	start(global_release_path, options = {}) {

		return new Promise((resolve) => {

			if (!_.includes(process.argv, '--release-web') && !_.includes(process.argv, '--deploy-web')) return resolve();

			console.log(colors.cyan('Create Web release...'));

			this.webReleasePath = options.path || this.getWebReleasePath(global_release_path);

			this.gameName = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

			utilits.createPath(this.webReleasePath);

			this.build(options, () => {

				console.log(colors.cyan('Web release created!'));

				resolve();

			});

		});

	},

	build(options, next) {

		const settings_array = utilits.getSettings();

		this.modifySettings(settings_array, options);

		this.createScript(this.webReleasePath);

		_.each(settings_array, (settings) => {

			utilits.injectAssetsIntoSettings(settings);

			utilits.base64Settings(settings);

			utilits.createTag(this.webReleasePath, 'Tag.Web.tpl', settings, {
				tagFileName: 'index.html',
				settingsString: utilits.formatSettings(settings)
			});

			const assets_quality = settings["assets-quality"]["default"];

			settings["assets-quality"]["default"] = "high";

			utilits.createTag(this.webReleasePath, 'Tag.Web.tpl', settings, {
				tagFileName: settings.name + '-high.html',
				settingsString: utilits.formatSettings(settings)
			});

			settings["assets-quality"]["default"] = "medium";

			utilits.createTag(this.webReleasePath, 'Tag.Web.tpl', settings, {
				tagFileName: settings.name + '-medium.html',
				settingsString: utilits.formatSettings(settings)
			});

			settings["assets-quality"]["default"] = "low";

			utilits.createTag(this.webReleasePath, 'Tag.Web.tpl', settings, {
				tagFileName: settings.name +  '-low.html',
				settingsString: utilits.formatSettings(settings)
			});

			settings["assets-quality"]["default"] = assets_quality;

			utilits.copySettingAssets(this.webReleasePath, settings);

			this.checkSize(settings, 20000000);

		});

		if (next) next();

	},

	modifySettings(settings_array, options = {}) {

		_.each(settings_array, (settings) => {

			settings["version"] += "." + Date.now();
			settings["custom-close-button"]["default"] = 0;
			settings["interstitial-timeout"]["default"] = 0;

			settings.Assets = _.pickBy(settings.Assets, function(o) {return !(o["web-release"] === "skip")});

			if (options.assetsPath) settings["assets-path"]["default"] = options.assetsPath;

		});

	},

	createScript(release_path) {

		fse.copySync(`${__dirname}/Builds`, `${release_path}/Builds`);

		fse.removeSync(`${release_path}/Builds/.gitkeep`);

	},

	checkSize: function(settings, limit) {

		utilits.forEachQuality(function(quality) {

			const size = utilits.calculateSettingAssetsSize(settings, quality);

			const size_txt = Math.round(size / 10000) / 100;

			if (size <= limit) console.log(colors.green(`Web: '${settings.name}' -> ${quality}; Size: ${size_txt} megabytes`));
			else console.log(colors.gray(`Web: '${settings.name}' -> ${quality}; Size: ${size_txt} megabytes`));

		});

	}

}