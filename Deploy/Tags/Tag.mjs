import Mraid					from './Tag.Mraid.mjs';
import FacebookInstantGames 	from './Tag.FacebookInstantGames.mjs';
import GooglePlayInstant		from './Tag.GooglePlayInstant.mjs';
import Web 						from './Tag.Web.mjs';

import fs 						from "fs";
import fse 						from "fs-extra";

const __dirname = fs.realpathSync('.');

export default {

	Mraid,
	FacebookInstantGames,
	GooglePlayInstant,
	Web,

	start(loader_files, main_files, next) {

		this.clearReleaseDir();

		const release_path = this.getReleasePath();

		this.Mraid.start(release_path)
		.then(() => this.FacebookInstantGames.start(release_path))
		.then(() => this.GooglePlayInstant.start(release_path))
		.then(() => this.Web.start(release_path))
		.then(next)
		.catch(err => console.log(err));

	},

	getReleasePath() {

		const release_dir = this.getReleaseDir();

		return `${__dirname}/Releases/${release_dir}`;

	},

	getReleaseDir() {

		if (this.releaseDir) return this.releaseDir;

		let date = new Date(),
			month = date.getMonth() + 1;

		return this.releaseDir = `${date.getFullYear()}.${month < 10 ? '0' + month : month}.${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;

	},

	clearReleaseDir() {

		const release_dir = this.getReleasePath();

		if (!fs.existsSync(`${__dirname}/Releases`)) fs.mkdirSync(`${__dirname}/Releases`);

		if (fs.existsSync(release_dir)) fse.removeSync(release_dir);

		// if the directory is open, need some time to delete
		while (!fs.existsSync(release_dir)) try { fs.mkdirSync(release_dir); } catch(error) { }

	}

};