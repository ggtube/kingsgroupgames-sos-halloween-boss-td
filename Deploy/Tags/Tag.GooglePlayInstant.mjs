import Utilits 		from '../Build/Deploy.Build.mjs';
import _ 			from 'lodash';
import colors 		from 'colors/safe';
import fs 			from 'fs';
import fse 			from 'fs-extra';
import zipFolder 	from 'zip-folder';
import admZip 		from 'adm-zip';
import {exec} 		from 'child_process';
import Tag 			from "./Tag";

const __dirname = fse.realpathSync('.');

export default {

	getGooglePlayInstantReleasePath(global_release_path) {

		return global_release_path + "/google-play-instant/";

	},

	start(global_release_path, options = {}) {

		return new Promise((resolve) => {

			if (!_.includes(process.argv, '--release-google-play-instant')) return resolve();

			console.log(colors.cyan('Create Google Play Instant release...'));

			this.googlePlayInstantReleasePath = options.path || this.getGooglePlayInstantReleasePath(global_release_path);

			this.gameName = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

			Utilits.createPath(this.googlePlayInstantReleasePath);

			this.build(options, () => {

				console.log(colors.cyan('Google Play Instant release created!'));

				resolve();

			});

		});

	},

	build(options, next) {

		let signed = 0;

		Utilits.forEachQuality((quality) => {

			const settings_array = Utilits.getSettings();

			this.modifySettings(settings_array, options);

			_.each(settings_array, (settings) => {

				let package_name = '';

				if (!(settings["target-url"]["default:android"] || settings["target-url"]["default"])) package_name = colors.red('Warning!') + colors.gray(' Package name: NOT SPECIFIED');

				else {

					const target_url = settings["target-url"]["default:android"] || settings["target-url"]["default"];

					if (target_url.indexOf("id=") > -1) {

						package_name = target_url.substring(target_url.indexOf("id=") + 3);

						if (package_name.indexOf('&') > -1) package_name = package_name.substring(0, package_name.indexOf("&"));

						if (!package_name) package_name = colors.red('Warning!') + colors.gray(' Package: INVALID');

						else package_name = colors.green('Package: ' + package_name);

					} else package_name = colors.red('Warning!') + colors.gray(' Package name: INVALID');

				}

				settings["assets-quality"]["default"] = quality;

				Utilits.injectAssetsIntoSettings(settings);

				Utilits.base64Settings(settings);

				this.createScript(this.googlePlayInstantReleasePath + settings.name + '-' + quality + '/', settings);

				Utilits.createTag(this.googlePlayInstantReleasePath + settings.name + '-' + quality + '/', 'Tag.Web.tpl', settings, {
					tagFileName: "sample.html",
					settingsString: Utilits.formatSettings(settings)
				});

				Utilits.copySettingAssets(this.googlePlayInstantReleasePath + settings.name + '-' + quality + '/', settings, [quality]);

				if (fse.existsSync(`${__dirname}/Video`)) {

					const qualities = ['high', 'medium', 'low'];

					const files = fse.readdirSync(`${__dirname}/Video`);

					let current_quality_files = files.filter(file => file.match(`.${quality}`));

					if (!current_quality_files.length) {

						current_quality_files = files.filter(file => qualities.every(quality => !file.match(`.${quality}`)));

					}

					current_quality_files.forEach(video_file_name => {

						const new_video_file_name = qualities.reduce((prev, curr) => prev.replace(`.${curr}`, ''), video_file_name);

						fse.copySync(`${__dirname}/Video/${video_file_name}`, `${this.googlePlayInstantReleasePath}${settings.name}-${quality}/Video/${new_video_file_name}`);

					});

				}

				const zip = new admZip(__dirname + '/Deploy/Tags/Tag.GooglePlayInstant.tpl');

				zip.deleteFile(zip.getEntry('assets/sample.html'));
				zip.deleteFile(zip.getEntry('META-INF/CERT.RSA'));
				zip.deleteFile(zip.getEntry('META-INF/CERT.SF'));
				zip.deleteFile(zip.getEntry('META-INF/MANIFEST.MF'));

				const zip_apk_folder = this.googlePlayInstantReleasePath + settings.name + '-' + quality + '-apk';
				const zip_apk = this.googlePlayInstantReleasePath + settings.name + '-' + quality + '.apk';

				zip.addLocalFolder(this.googlePlayInstantReleasePath + settings.name + '-' + quality + '/', 'assets/');

				zip.extractAllTo(zip_apk_folder, true);

				zipFolder(zip_apk_folder, zip_apk, () => {

					fse.removeSync(zip_apk_folder);

					const sign_command = `jarsigner -verbose -sigalg MD5withRSA -digestalg SHA1 -keystore "${__dirname + '/Deploy/Certificates/mraid_development_apk.keystore'}" -storepass 123456 "${zip_apk}" "Mraid.io Google Play Instant App"`;

					exec(sign_command, () => {

						signed++;

						this.checkSize(settings.name + '-' + quality + '.apk', 10000000, package_name);

						if (signed === settings_array.length * 3) next();

					});

				});

			});

		});

	},

	modifySettings(settings_array, options = {}) {

		_.each(settings_array, (settings) => {

			settings["version"] += "." + Date.now();
			settings["publisher"] = "google-play-instant";
			settings["custom-close-button"]["default"] = 0;
			settings["interstitial-timeout"]["default"] = 0;
			settings["close-button-styles"]["default"]["backgroundImage"] = "none";

			settings.Assets = _.pickBy(settings.Assets, function(asset) {

				const asset_release_settings = Utilits.getAssetReleaseSettings(settings, asset);

				if (asset_release_settings["skip"] === true) return false;

				return true;

			});

		});

	},

	createScript: function(release_path) {

		fse.copySync(`${__dirname}/Builds/${this.gameName}.min.js`, `${release_path}/Builds/${this.gameName}.min.js`);
		fse.copySync(`${__dirname}/Builds/${this.gameName}-loader.min.js`, `${release_path}/Builds/${this.gameName}-loader.min.js`);

	},

	checkSize: function(file_name, limit, package_name) {

		const size = fs.statSync(this.googlePlayInstantReleasePath + file_name).size;

		const size_txt = Math.round(size / 10000) / 100;

		if (size <= limit) console.log(colors.green(`Google Play Instant: '${file_name}'; Size: ${size_txt} megabytes; `) + package_name);
		else console.log(colors.gray(`Google Play Instant: '${file_name}'; Size: ${size_txt} megabytes; `) + package_name);

	}

}