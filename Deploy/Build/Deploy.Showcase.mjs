//Deploy mraid ad to mraid.io showcase folder

import fse 			from 'fs-extra';
import Tag 			from "./../Tags/Tag";
import fs 			from "fs";
import colors 		from "colors/safe";

const __dirname = fse.realpathSync('.');

export default {

	updateShowcase() {

		console.log(colors.cyan('Deploy showcase versions...'));

		const game_name = JSON.parse(fs.readFileSync(`${__dirname}/package.json`)).name;

		const mraid_showcase_path = `${__dirname}/../../mraid.io-dashboard/Public/showcase/${game_name}/latest/`;

		fse.removeSync(mraid_showcase_path);

		Tag.Mraid.start(Tag.getReleasePath(), {
			path: mraid_showcase_path,
			assetsPath: ``
		}).then(() => {

			console.log(colors.cyan('Path: ') + colors.green(`https://mraid.io/showcase/${game_name}/latest/`));

		}).catch(err => console.log(err));

	}

}