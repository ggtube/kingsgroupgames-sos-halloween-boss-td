import utilits 		from '../Build/Deploy.Build.mjs';
import _ 			from 'lodash';
import colors 		from 'colors/safe';
import fs 			from 'fs';
import fse 			from 'fs-extra';
import zip 			from 'zip-folder';

const __dirname = fse.realpathSync('.');

export default {

	getFacebookInstantGamesReleasePath(global_release_path) {

		return global_release_path + "/facebook-instant-games/";

	},

	start(global_release_path, options = {}) {

		return new Promise((resolve) => {

			if (!_.includes(process.argv, '--release-facebook-instant-games')) return resolve();

			console.log(colors.cyan('Create FacebookInstantGames release...'));

			this.facebookInstantGamesReleasePath = options.path || this.getFacebookInstantGamesReleasePath(global_release_path);

			this.gameName = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

			utilits.createPath(this.facebookInstantGamesReleasePath);

			this.build(options, () => {

				console.log(colors.cyan('Facebook Instant Games release created!'));

				resolve();

			});

		});

	},

	build(options, next) {

		utilits.forEachQuality((quality) => {

			const settings_array = utilits.getSettings();

			this.modifySettings(settings_array, options);

			_.each(settings_array, (settings) => {

				settings["assets-quality"]["default"] = quality;

				utilits.injectAssetsIntoSettings(settings);

				utilits.base64Settings(settings);

				this.createScript(this.facebookInstantGamesReleasePath + settings.name + '-' + quality + '/');

				utilits.createTag(this.facebookInstantGamesReleasePath + settings.name + '-' + quality + '/', 'Tag.FacebookInstantGames.tpl', settings, {
					tagFileName: "index.html",
					settingsString: utilits.formatSettings(settings)
				});

				utilits.copySettingAssets(this.facebookInstantGamesReleasePath + settings.name + '-' + quality + '/', settings, [quality]);

				this.createConfig(this.facebookInstantGamesReleasePath + settings.name + '-' + quality + '/', settings);

			});

		});

		let gzipped = 0;

		utilits.forEachQuality((quality) => {

			const settings_array = utilits.getSettings();

			_.each(settings_array, (settings) => {

				zip(this.facebookInstantGamesReleasePath + settings.name + '-' + quality, this.facebookInstantGamesReleasePath + settings.name + '-' + quality + '.zip', (err) => {

					gzipped++;

					this.checkSize(settings.name + '-' + quality + '.zip', 10000000);

					if (gzipped === settings_array.length * 3) next && next();

				});

			});

		});

	},

	modifySettings(settings_array, options = {}) {

		_.each(settings_array, (settings) => {

			settings["version"] += "." + Date.now();
			settings["publisher"] = "facebook-instant-games";

			settings.Assets = _.pickBy(settings.Assets, function(o) {return !(o["facebook-instant-games-release"] === "skip")});

			if (options.assetsPath) settings["assets-path"]["default"] = options.assetsPath;

		});

	},

	createScript(release_path) {

		fse.copySync(`${__dirname}/Builds/${this.gameName}.min.js`, `${release_path}/Builds/${this.gameName}.min.js`);
		fse.copySync(`${__dirname}/Builds/${this.gameName}-loader.min.js`, `${release_path}/Builds/${this.gameName}-loader.min.js`);

	},

	createConfig(release_path, settings) {

		const config = {
			"instant_games": {
				"orientation": "PORTRAIT",
				"navigation_menu_version": "NAV_FLOATING"
			}
		};

		fse.writeFileSync(release_path + 'fbapp-config.json', JSON.stringify(config, null, 4), 'utf8');

	},

	checkSize: function(file_name, limit) {

		const size = fs.statSync(this.facebookInstantGamesReleasePath + file_name).size;

		const size_txt = Math.round(size / 10000) / 100;

		if (size <= limit) console.log(colors.green(`Facebook Instant Games: '${file_name}'; Size: ${size_txt} megabytes`));
		else console.log(colors.gray(`Facebook Instant Games: '${file_name}'; Size: ${size_txt} megabytes`));

	}

}