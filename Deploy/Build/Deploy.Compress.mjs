//Assets compression logic
import fs 				from 'fs';
import colors 			from "colors/safe";
import tinify 			from "tinify";
import _ 				from "lodash";
import {exec} 			from "child_process";
import ffmpeg_static 	from "ffmpeg-static";
import progressBar 		from "progress";
import Utilits 			from "./Deploy.Build"

const __dirname = fs.realpathSync('.');

const Compressor = {

	async compressAssets(settings_data, callback) {

		console.log(colors.cyan('Compress assets...'));

		await new Promise((res, rej) => {

			tinify.validate(err => {

				if (err) {

					console.error(err);
					rej();

				} else res();

			});

		});

		console.log('Tinypng compress per month: ' + tinify.compressionCount);

		// типы, которые нужно сжать
		const compress_types = {
			'video': [],
			'image': [],
			'atlas': [],
			'sound': []
		};

		// обработчики типов, которые нужно сжать
		const handlers = {
			'video': Compressor.videoHandler,
			'image': Compressor.imageHandler,
			'atlas': Compressor.atlasHandler,
			'sound': Compressor.soundHandler
		};

		_.each(settings_data, (setting_data) => {

			Utilits.expandRandomSettingsAssets(setting_data);

			_.each(setting_data.Assets, (asset) => {

				if (asset.compress === false) return;
				if (!compress_types[asset.type]) return;
				if (compress_types[asset.type].find(item => item.url === asset.url)) return;

				compress_types[asset.type].push(asset);

			});

		});

		for (let type in compress_types) {

			if (!handlers[type]) console.error(colors.red(`Needs compress handler for "${type}" type.`));
			try {

				await handlers[type](compress_types[type]);

			} catch (err) { console.error(err); }

		}

		console.log(colors.cyan('Assets compress completed'));

		if (typeof callback === 'function') callback();

	},

	async videoHandler(assets) {

		const qualities = [
			{name: 'low', rate: 500, minRate: 250, maxRate: 750, soundRate: 32000},
			{name: 'medium', rate: 1000, minRate: 500, maxRate: 1500, soundRate: 64000}
		];

		const formats = {
			'mp4': {format: 'mp4'},
			'ts': {format: 'mpegts', codecV: 'mpeg1video', codecA: 'mp2', resolution: '360'}
		};

		const compress_info = assets.reduce((pairs, asset) => {

			const file_name = asset.url.split('/').pop().split('.')[0];
			let extension = asset.url.match(/\.(.*)$/)[1];
			const video_path = asset.url.match(/.*\//)[0];

			extension = 'ts';

			if (!fs.existsSync(`${__dirname}/${asset.url.replace('.mp4', '.ts')}`)) {

				const options = {
					from: `${__dirname}/${asset.url}`,
					to: `${__dirname}/${asset.url.replace('.mp4', '.ts')}`,
					rate: 1500,
					minRate: 750,
					maxRate: 2250,
					soundRate: 128000
				};

				pairs.push(Object.assign({}, options, formats[extension]));

			}

			qualities.forEach(quality => {

				if (!fs.existsSync(`${__dirname}/${video_path}${file_name}.${quality.name}.${extension}`)) {

					const options = {
						from: `${__dirname}/${video_path}${file_name}.mp4`,
						to: `${__dirname}/${video_path}${file_name}.${quality.name}.${extension}`,
						rate: quality.rate,
						minRate: quality.minRate,
						maxRate: quality.maxRate,
						soundRate: quality.soundRate
					};

					pairs.push(Object.assign({}, options, formats[extension]));

				}

			});

			extension = 'mp4';

			qualities.forEach(quality => {

				if (!fs.existsSync(`${__dirname}/${video_path}${file_name}.${quality.name}.${extension}`)) {

					const options = {
						from: `${__dirname}/${video_path}${file_name}.${extension}`,
						to: `${__dirname}/${video_path}${file_name}.${quality.name}.${extension}`,
						rate: quality.rate,
						minRate: quality.minRate,
						maxRate: quality.maxRate,
						soundRate: quality.soundRate
					};

					pairs.push(Object.assign({}, options, formats[extension]));

				}

			});

			return pairs;

		}, []);

		console.log(colors.cyan(`Start videos compress. Total: ${compress_info.length}.`));

		const progress_bar = new progressBar('Videos compressed: :current/:total ', { total: compress_info.length });

		for (let i = 0; i < compress_info.length; i++) {

			const info = compress_info[i];

			await Compressor.videoCompress(info.from, info.to, Object.assign({progressBar: progress_bar}, info));

		}

	},

	async atlasHandler(assets) {

		console.log(colors.cyan(`Start atlases compress. Total: ${assets.length*2}.`));

		const progress_bar = new progressBar('Atlases compressed: :current/:total ', { total: assets.length*2 });

		await Promise.all(assets.reduce((prev, asset) => {

			const compress_funcs = [];

			if (!fs.existsSync(__dirname + '/' + asset.url)) {

				progress_bar.interrupt(colors.red(`Wrong asset path: ${asset.url}`));

				progress_bar.tick();
				progress_bar.tick();

				return prev;

			}

			let texture_packer_path = '';

			if (process.platform === 'win32') texture_packer_path = "C:/Program Files/CodeAndWeb/TexturePacker/bin/";
			else if (process.platform === 'darwin') texture_packer_path = "/Applications/TexturePacker.app/Contents/MacOS/";
			else if (process.platform === 'linux') texture_packer_path = "/usr/bin/";

			let atlas_txt = fs.readFileSync(__dirname + '/' + asset.url).toString();

			let atlas_json = JSON.parse(atlas_txt);

			let atlas_path = asset.url.substr(0, asset.url.lastIndexOf('/'));

			let image_url = atlas_json.meta.image;

			let xml = fs.readFileSync(`${__dirname}/${atlas_path}/${image_url.split('.')[0]}.tps`, 'utf8');

			const base_scale = xml.match(/<struct type="SpriteSettings">[\s\S]+<key>scale<\/key>[\s\S]+<double>(.*)<\/double>/m)[1];

			// Medium

			let scale = base_scale;

			if (asset["compress"] && asset["compress"]["medium"] && asset["compress"]["medium"]["scale"]) scale *= asset["compress"]["medium"]["scale"];

			let params = `${__dirname}/${atlas_path}/${image_url.split('.')[0]}.tps --data ${__dirname}/${asset.url.replace('.json', '.medium.json')} --sheet ${__dirname}/${asset.url.replace('.json', image_url.indexOf('.png') > 0 ? '.medium.png': '.medium.jpg')} --scale ${scale}`;

			compress_funcs.push(new Promise(res => {

				exec(`"${texture_packer_path}TexturePacker" ${params}`, async err => {

					if (err) {

						progress_bar.interrupt(colors.red(err));

						progress_bar.tick();

						return res();

					}

					if (!asset["compress"] || !asset["compress"]["medium"] || asset["compress"]["medium"]["tinypng"] !== false) {

						await Compressor.tinypngCompress(__dirname + '/' + atlas_path + '/' + image_url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg'), __dirname + '/' + atlas_path + '/' + image_url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg'), { progressBar: progress_bar });

						res();

					} else {

						progress_bar.interrupt(colors.grey(`${image_url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg')} completed`));

						progress_bar.tick();

						res();

					}

				});

			}));

			// Low

			scale = base_scale * 0.5;

			if (asset["compress"] && asset["compress"]["low"] && asset["compress"]["low"]["scale"]) scale *= asset["compress"]["low"]["scale"];

			params = `${__dirname}/${atlas_path}/${image_url.split('.')[0]}.tps --data ${__dirname}/${asset.url.replace('.json', '.low.json')} --sheet ${__dirname}/${asset.url.replace('.json', image_url.indexOf('.png') > 0 ? '.low.png': '.low.jpg')} --scale ${scale}`;

			compress_funcs.push(new Promise(res => {

				exec(`"${texture_packer_path}TexturePacker" ${params}`, async err => {

					if (err) {

						progress_bar.interrupt(colors.red(err));

						progress_bar.tick();

						return res();

					}

					if (!asset["compress"] || !asset["compress"]["low"] || asset["compress"]["low"]["tinypng"] !== false) {

						await Compressor.tinypngCompress(__dirname + '/' + atlas_path + '/' + image_url.replace('.png', '.low.png').replace('.jpg', '.low.jpg'), __dirname + '/' + atlas_path + '/' + image_url.replace('.png', '.low.png').replace('.jpg', '.low.jpg'), { progressBar: progress_bar });

						res();

					} else {

						progress_bar.interrupt(colors.grey(`${image_url.replace('.png', '.low.png').replace('.jpg', '.low.jpg')} completed`));

						progress_bar.tick();

						res();

					}

				});

			}));

			return prev.concat(compress_funcs);

		}, []));

	},

	async imageHandler(assets) {

		console.log(colors.cyan(`Start images compress. Total: ${assets.length*2}.`));

		const progress_bar = new progressBar('Images compressed: :current/:total', { total: assets.length*2 });

		await Promise.all(assets.reduce((prev, asset) => {

			const compress_funcs = [];

			if (!fs.existsSync(__dirname + '/' + asset.url)) {

				progress_bar.interrupt(colors.red(`Wrong asset path: ${asset.url}`));

				progress_bar.tick();
				progress_bar.tick();

				return prev;

			}

			if (!asset["compress"] || asset["compress"]["medium"] !== false) {

				compress_funcs.push(Compressor.tinypngCompress(__dirname + '/' + asset.url, __dirname + '/' + asset.url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg'), { progressBar: progress_bar }));

			} else {

				fs.copyFileSync(__dirname + '/' + asset.url, __dirname + '/' + asset.url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg'));

				progress_bar.interrupt(colors.grey(`${asset.url.replace('.png', '.medium.png').replace('.jpg', '.medium.jpg')} completed`));

				progress_bar.tick();

			}

			if (!asset["compress"] || asset["compress"]["low"] !== false) {

				compress_funcs.push(Compressor.tinypngCompress(__dirname + '/' + asset.url, __dirname + '/' + asset.url.replace('.png', '.low.png').replace('.jpg', '.low.jpg'), { progressBar: progress_bar }));

			} else {

				fs.copyFileSync(__dirname + '/' + asset.url, __dirname + '/' + asset.url.replace('.png', '.low.png').replace('.jpg', '.low.jpg'));

				progress_bar.interrupt(colors.grey(`${asset.url.replace('.png', '.low.png').replace('.jpg', '.low.jpg')} completed`));

				progress_bar.tick();

			}

			return prev.concat(compress_funcs);

		}, []));

	},

	async soundHandler(assets) {

		const compress_count = assets.reduce((count, asset) => {

			let multiExt = asset.url.match(/{(.+)}$/);

			if (multiExt) count += multiExt[1].replace(/\s+/g,'').split(',').length * 3 - 1;
			else count += 2;

			return count;

		}, 0);

		console.log(colors.cyan(`Start sounds compress. Total: ${compress_count}.`));

		const progress_bar = new progressBar('Sounds compressed: :current/:total', { total: compress_count });

		const bitRates = [32, 64];

		await Promise.all(assets.reduce((prev, asset) => {

			const compress_funcs = [];

			let multiExt = asset.url.match(/{(.+)}$/);

			let formats = [];

			const baseFormat = 'mp3';

			if (multiExt) formats = multiExt[1].replace(/\s+/g,'').split(',');
			else formats.push(asset.url.match(/\.(.+)$/)[1]);

			let url = asset.url.split('/');
			let name = url.pop().split('.')[0];
			let path = __dirname + '/' + url.join('/') + '/';

			if (!fs.existsSync(path+name+'.'+baseFormat)) return console.log('Error: file ' + name + '.' + baseFormat + ' not found');

			for (let i = 0; i < formats.length; i++) {

				if (formats[i] === baseFormat) continue;

				if (fs.existsSync(path+name+'.'+formats[i])) fs.unlinkSync(path+name+'.'+formats[i]);

				compress_funcs.push(Compressor.soundCompress(path+name+'.'+baseFormat, path+name+'.'+formats[i], {format: formats[i], rate: null, progressBar: progress_bar}));

			}

			return prev.concat(compress_funcs);

		}, []));

		await Promise.all(assets.reduce((prev, asset) => {

			const compress_funcs = [];

			let multiExt = asset.url.match(/{(.+)}$/);

			let formats = [];

			const baseFormat = 'mp3';

			if (multiExt) formats = multiExt[1].replace(/\s+/g,'').split(',');
			else formats.push(asset.url.match(/\.(.+)$/)[1]);

			let url = asset.url.split('/');
			let name = url.pop().split('.')[0];
			let path = __dirname + '/' + url + '/';

			for (let i = 0; i < formats.length; i++) {

				for (let j = 0; j < bitRates.length; j++) {

					if (fs.existsSync(path+name+'.'+bitRates[j]+'kbps.'+formats[i])) fs.unlinkSync(path+name+'.'+bitRates[j]+'kbps.'+formats[i]);

					compress_funcs.push(Compressor.soundCompress(path+name+'.'+baseFormat, path+name+'.'+bitRates[j]+'kbps.'+formats[i], {format: formats[i], rate: bitRates[j], progressBar: progress_bar}));

				}

			}

			return prev.concat(compress_funcs);

		}, []));

	},

	async soundCompress(source_file, destination_file, options) {

		if (options.format === 'ogg' && options.rate < 45) options.rate = 48;

		await new Promise(res => {

			exec(`${ffmpeg_static.path} -i ${source_file} -y -f ${options.format} ${options.rate ? `-ab ${options.rate}k` : ''} ${destination_file}`, err => {

				if (err) return console.error(colors.red(err));

				if (options.progressBar) {

					options.progressBar.interrupt(colors.grey(`${destination_file.substr(destination_file.lastIndexOf('/') + 1)} completed`));

					options.progressBar.tick();

				}

				res();

			});

		});

	},

	async videoCompress(source_file, destination_file, options) {

		if (options.progressBar) options.progressBar.interrupt(colors.gray('Start compress video asset: ' + source_file.substr(source_file.lastIndexOf('/') + 1) + ' >> ' + destination_file.substr(destination_file.lastIndexOf('/') + 1)));
		else console.log(colors.gray('Start compress video asset: ' + source_file.substr(source_file.lastIndexOf('/') + 1) + ' >> ' + destination_file.substr(destination_file.lastIndexOf('/') + 1)));

		await new Promise(res => {

			exec(`${ffmpeg_static.path} -i ${source_file}`, output => {

				let fps = /([0-9\.]+) (fps|tb\(r\))/.exec(output);

				fps = fps[1];

				let params = `${ffmpeg_static.path} -i ${source_file} -r ${fps} -y -f ${options.format} `;

				if (options.rate) params += `-b:v ${options.rate}k -minrate ${options.rate}k -maxrate ${options.rate}k -bufsize ${options.rate}k `;
				if (options.resolution) params += `-vf scale=-1:${options.resolution} `;
				if (options.codecV) params += `-codec:v ${options.codecV} -an `;

				params += `${destination_file}`;

				exec(params, err => {

					if (err) return console.error(colors.red(err));

					if (options.format === 'mpegts') {

						let params = `${ffmpeg_static.path} -i ${source_file} -f mp3 -ab ${options.soundRate} -vn `;
						params += `${destination_file.replace('.ts', '.mp3')}`;

						exec(params, err => {

							if (err) return console.error(colors.red(err));

							if (options.progressBar) {

								options.progressBar.interrupt(colors.grey(`${destination_file.substr(destination_file.lastIndexOf('/') + 1)} completed`));

								options.progressBar.tick();

							}

							res();

						});

					} else {

						if (options.progressBar) {

							options.progressBar.interrupt(colors.grey(`${destination_file.substr(destination_file.lastIndexOf('/') + 1)} completed`));

							options.progressBar.tick();

						}

						res();

					}

				});

			});

		});

	},

	async tinypngCompress(source_file, destination_file, options) {

		if (options.progressBar) options.progressBar.interrupt(colors.gray('Start compress image asset: ' + source_file.substr(source_file.lastIndexOf('/') + 1) + ' >> ' + destination_file.substr(destination_file.lastIndexOf('/') + 1)));
		else console.log(colors.gray('Start compress image asset: ' + source_file.substr(source_file.lastIndexOf('/') + 1) + ' >> ' + destination_file.substr(destination_file.lastIndexOf('/') + 1)));

		const source = tinify.fromFile(source_file);

		await new Promise(res => {

			source.toFile(destination_file, err => {

				if (err) return console.error(colors.red(err));

				if (options.progressBar) {

					options.progressBar.interrupt(colors.grey(`${destination_file.substr(destination_file.lastIndexOf('/') + 1)} completed`));

					options.progressBar.tick();

				}

				res();

			});

		});

	}

};

export default Compressor;