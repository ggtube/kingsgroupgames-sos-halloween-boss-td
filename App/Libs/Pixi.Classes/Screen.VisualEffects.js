Class.Mixin(Screen, {

	//Смещение спрайта в указанную позицию
	//Если speed = false то без анимации - моментальное изменение позиции
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	moveTo(containers, x, y, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.position.set(x, y);

		}, (container, time, ease) => {

			this.tween({
				to: ['position', [x, y], time, 0, ease]
			}, container);

		});

	},

	//Смещение спрайта в позицию указанную в Containers секции (в свойстве params)
	//Если speed = false то без анимации - моментальное изменение позиции
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	moveToDefault(containers, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			if (container.params && container.params.position) container.position.set(...container.params.position);
			else container.position.set(0, 0);

		}, (container, time, ease) => {

			if (container.params) {

				this.tween({
					to: ['position', container.params.position || [0, 0], time, 0, ease]
				}, container);

			}

		});

	},

	//Смещение спрайта в позицию другого спрайта
	//Если speed = false то без анимации - моментальное изменение позиции
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	//Если options.absolute === true toLocal toGlobal не будут применены,
	//иначе координаты будут высчитаны так, чтобы спрайты совместились на экране
	moveToSprite(containers, target_sprite, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			target_sprite = this.getContainers([target_sprite])[0];

			let new_coords = target_sprite.position;
			if (!options.absolute) new_coords = container.parent.toLocal(target_sprite.toGlobal(new PIXI.Point()));

			container.position.set(new_coords.x, new_coords.y);

		}, (container, time, ease) => {

			target_sprite = this.getContainers([target_sprite])[0];

			let new_coords = target_sprite.position;
			if (!options.absolute) new_coords = container.parent.toLocal(target_sprite.toGlobal(new PIXI.Point()));

			this.tween({
				to: ['position', [new_coords.x, new_coords.y], time, 0, ease]
			}, container);

		});

	},

	//Смещение спрайта на указанное количество пикселей
	//Если speed = false то без анимации - моментальное изменение позиции
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	moveBy(containers, x, y, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.position.set(container.position.x + x, container.position.y + y);

		}, (container, time, ease) => {

			this.tween({
				to: ['position', [container.position.x + x, container.position.y + y], time, 0, ease]
			}, container);

		});

	},

	//Изменение scale в указанное значение
	//Если speed = false то без анимации - моментальное изменение scale
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	scaleTo(containers, scale, speed = false, delay = 0, options = {}, next) {

		if (!this.isArray(scale)) scale = [scale, scale];

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.scale.set(...scale);

		}, (container, time, ease) => {

			this.tween({
				to: ['scale', scale, time, 0, ease]
			}, container);

		});

	},

	//Изменение scale в значение указанное в Containers секции (в свойстве params)
	//Если speed = false то без анимации - моментальное изменение scale
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	scaleToDefault(containers, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			if (container.params) {

				let scale = ("scale" in container.params) ? container.params.scale : 1;

				if (!this.isArray(scale)) scale = [scale, scale];

				container.scale.set(...scale);

			}

		}, (container, time, ease) => {

			if (container.params) {

				this.tween({
					to: ['scale', ("scale" in container.params) ? container.params.scale : 1, time, 0, ease]
				}, container);

			}

		});

	},

	//Изменение скейла спрайта в значение скейла другого спрайта
	//Если speed = false то без анимации - моментальное изменение скейла
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	scaleToSprite(containers, target_sprite, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			target_sprite = this.getContainers([target_sprite])[0];

			container.scale.set(target_sprite.scale.x, target_sprite.scale.y);

		}, (container, time, ease) => {

			target_sprite = this.getContainers([target_sprite])[0];

			this.tween({
				to: ['scale', [target_sprite.scale.x, target_sprite.scale.y], time, 0, ease]
			}, container);

		});

	},

	//Изменение scale в указанное количество раз от текущего значения
	//Если speed = false то без анимации - моментальное изменение scale
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	scaleBy(containers, scale, speed = false, delay = 0, options = {}, next) {

		if (!this.isArray(scale)) scale = [scale, scale];

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.scale.set(container.scale.x * scale[0], container.scale.y * scale[1]);

		}, (container, time, ease) => {

			this.tween({
				to: ['scale', [container.scale.x * scale[0], container.scale.y * scale[1]], time, 0, ease]
			}, container);

		});

	},

	//Изменение rotation в указанное значение
	//Если speed = false то без анимации - моментальное изменение rotation
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	rotateTo(containers, radians, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.rotation  = radians;

		}, (container, time, ease) => {

			this.tween({
				to: ['rotation', radians, time, 0, ease]
			}, container);

		});

	},

	//Изменение rotation в значение указанное в Containers секции (в свойстве params)
	//Если speed = false то без анимации - моментальное изменение rotation
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	rotateToDefault(containers, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			if (container.params) container.rotation = container.params.rotation || 0;

		}, (container, time, ease) => {

			if (container.params) {

				this.tween({
					to: ['rotation', container.params.rotation || 0, time, 0, ease]
				}, container);

			}

		});

	},

	//Изменение rotation в указанное количество раз от текущего значения
	//Если speed = false то без анимации - моментальное изменение rotation
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	rotateBy(containers, radians, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.rotation = container.rotation + radians;

		}, (container, time, ease) => {

			this.tween({
				to: ['rotation', container.rotation + radians, time, 0, ease]
			}, container);

		});

	},

	//Изменение alpha в указанное значение
	//Если speed = false то без анимации - моментальное изменение alpha
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время анимации и т. д.
	fadeTo(containers, alpha, speed = false, delay = 0, options = {}, next) {

		return this.tweenOrSet(containers, speed, delay, options, next, container => {

			container.alpha = alpha;
			container.visible = alpha > 0;

		}, (container, time, ease) => {

			if (alpha > 0) container.visible = true;

			this.tween({
				to: ['alpha', alpha, time, 0, ease]
			}, container, () => {

				container.visible = alpha > 0;

			});

		});

	},

	//Изменение volume для звуков и видео
	//Первый параметр имя ассета или объект ассета или массив имён или объектов ассетов
	//Если speed = false то без плавности - моментальное изменение звука в указанное значение
	//Если speed = 1 то 200ms время по умолчанию, если speed 2 то 100ms время изменения и т. д.
	//volume может быть 'default' - это значение из Assets
	volumeTo(medias, volume, speed = 1, delay = 0, options = {}, next) {

		options.media = true;

		return this.tweenOrSet(medias, speed, delay, options, next, asset => {

			if (volume === 'default') volume = asset.volume;

			let media = asset.sound || asset.video;

			media.volume = volume;

		}, (asset, time, ease) => {

			if (volume === 'default') volume = App.Assets[asset.name].volume;

			let media = asset.sound || asset.video;
            media = !media ? asset : media;

			this.stopTween(media._volumeTween);
			media._volumeTween = this.tween({
				to: ['volume', volume, time, 0, ease]
			}, media);

		});

	},

	sequence(containers, intervals, animations_list, options = {}) {

		containers = this.getContainers(containers, options);

		if (typeof intervals === 'number') intervals = [intervals];

		let time = 0;
		let i = 0;

		_.each(containers, sprite => {

			if (i < intervals.length) time += intervals[i];
			else time += intervals[intervals.length - 1];

			this.animate(animations_list, {containers: sprite, delay: time});

			i++;

		});

	},

	//Короткое трясение
	//Часто используется для начисления очков или для привлечение внимания на изменение какого-либо значения
	pulse(container, scale = 2, intensity = 3, speed = 1, delay = 0, next) {

		if (typeof container === 'string') container = this[container];

		let scale_x = 1;
		let scale_y = 1;

		if (typeof container === 'object' && container.scale) {

			scale_x = container.scale.x;
			scale_y = container.scale.y;

		}

		if (typeof container === 'object' && container.params && container.params.scale) {

			let scl = container.params.scale;
			if (!this.isArray(scl)) scl = [scl, scl];

			scale_x = scl[0];
			scale_y = scl[1];

		}

		return this.tween({
			delay: delay,
			to: ['scale', [scale_x * (1 + ((scale - 1) / 4)), scale_y * (1 + ((scale - 1) / 4))], 100 / speed, 0, Power2.easeInOut],
			next: ['scale', [scale_x, scale_y], 500 / speed, 0, Elastic.easeOut.config(1 * scale, 1 / intensity)],
		}, container, next);

	},

	//Постоянное изменение скейла туда-сюда
	//Используется для кнопок на которые нужно нажать пользователю сейчас, в том числе и для CTA
	pulsation(container, scale = 1.05, speed = 1, delay = 0) {

		if (typeof container === 'string') container = this[container];

		let start_scale_x = 1;
		let start_scale_y = 1;

		if (container.scale) {

			start_scale_x = container.scale.x;
			start_scale_y = container.scale.y;

		}

		let scale_x_to = () => {

			let scale_x = 1;
			if (container.params && 'scale' in container.params) scale_x = container.params.scale[0] === undefined ? container.params.scale : container.params.scale[0];
			else scale_x = start_scale_x;

			return scale_x * scale

		};

		let scale_y_to = () => {

			let scale_y = 1;
			if (container.params && 'scale' in container.params) scale_y = container.params.scale[1] === undefined ? container.params.scale : container.params.scale[1];
			else scale_y = start_scale_y;

			return scale_y * scale

		};

		let scale_x_next = () => {

			let scale_x = 1;
			if (container.params && 'scale' in container.params) scale_x = container.params.scale[0] === undefined ? container.params.scale : container.params.scale[0];
			else scale_x = start_scale_x;

			return scale_x

		};

		let scale_y_next = () => {

			let scale_y = 1;
			if (container.params && 'scale' in container.params) scale_y = container.params.scale[1] === undefined ? container.params.scale : container.params.scale[1];
			else scale_y = start_scale_y;

			return scale_y

		};

		return this.tween({
			delay: delay,
			to: ['scale', [scale_x_to, scale_y_to], 300 / speed, 0, Power2.easeInOut],
			next: ['scale', [scale_x_next, scale_y_next], 300 / speed, 0, Power2.easeInOut],
			loop: true
		}, container);

	},

	//Хаотическое смещение положения вокруг одного места
	//Может использоваться для создания помех / неровностей для других анимаций создававя более реалистичные движения или как необычная альтернатива pulsation для кнопок
	chaoticMotion(container, scale = 1, speed = 1) {

		if (!this.isArray(scale)) scale = [scale, scale];

		if (typeof container === 'string') container = this[container];

		let pos_x = 0;
		let pos_y = 0;

		if (typeof container === 'object' && container.position) {

			pos_x = container.position.x;
			pos_y = container.position.y;

		}

		return this.tween({
            to: [
            	['position', [() => pos_x + this.random(-2, 2) * scale[0], () => pos_y + this.random(-2, 2) * scale[1]], 200 / speed, 0, Power1.easeInOut]
			],
			next: [
				['position', [container.params.position[0], container.params.position[1]], 200 / speed, 0, Power1.easeInOut]
			],
            loop: true
        }, container);

	},

	//Хаотическое мигание alpha
	chaoticAlphaMotion(container, min_alpha = 0, max_alpha = 1, speed = 1) {

		if (typeof container === 'string') container = this[container];

		return this.tween({
            to: [
            	['alpha', () => { return this.randomFloat(min_alpha, max_alpha); }, 200 / speed, 0, Power1.easeInOut]
			],
            loop: true
        }, container);

	},

	tweenSine(obj, param, period = 2, magnitude = 50, periodOffset = 0) {
		if (!obj) return;
		if (!(param in obj)) return;

		let i = (periodOffset / period) * 2 * Math.PI;
		let init_val = obj[param];
		let last_val = init_val;

		return this.tween({
			to: ['p', 1, 1000, 0, Linear.easeInOut],
			update: () => {
				let dt = this.updateTimeOffset / 1000;

				if (dt) {
					i += (dt / period) * 2 * Math.PI;
					i = i % (2 * Math.PI);

					if (obj[param] !== last_val) init_val += obj[param] - last_val;

					obj[param] = init_val + Math.sin(i) * magnitude;
					last_val = obj[param];
				}
			},
			loop: true
		}, {p: 0});
	},

	//Частицы разлетаются в виде фонтана сначала вверх потом под действием гравитации вниз и в стороны
	fountainEmitter(container, particles, options = {}) {

		if (typeof container === 'string') container = this[container];

		if (!this.isArray(particles)) particles = [particles];

		if (options['count'] === undefined) options['count'] = 10;
		if (options['interval'] === undefined) options['interval'] = 100;
		if (options['limit'] === undefined) options['limit'] = false;
		if (options['particleSpeed'] === undefined) options['particleSpeed'] = [[-300, 300], [-500, -500]];
		if (options['particleAcceleration'] === undefined) options['particleAcceleration'] = [0, 500];
		if (options['lifetime'] === undefined) options['lifetime'] = 3500;

		let emitter = this.buildChild(container, {type: 'emitter', count: options.count, interval: options.interval, limit: options.limit, particleSpeed: options.particleSpeed, particleAcceleration: options.particleAcceleration, images: function(emitter) {

			if (typeof particles[0] === 'string') {

				return this.buildChild(emitter, {type: 'sprite', image: this.sample(particles), position: [0, 0], scale: this.randomFloat(0.5, 1.5), blendMode: PIXI.BLEND_MODES.SCREEN});

			} else if (typeof particles[0] === 'object') {

				return this.sample(particles);

			} else if (typeof particles[0] === 'function') {

				return particles[0].call(this, emitter);

			}

		}, particleTween: function() {

			return {
				set: ['alpha', 0],
				to: ['alpha', 1, 100],
				next: ['alpha', 0, 100, options['lifetime']]
			};

		}});

		emitter.emit();

		emitter.skipUpdate = false;

		return emitter;

	},

	//Частицы разлетаются из одной точки в разные стороны в виде сферы и быстро гаснут
	sphereBurstEmitter(container, particles, options = {}) {

		if (typeof container === 'string') container = this[container];

		if (!this.isArray(particles)) particles = [particles];

		if (options['count'] === undefined) options['count'] = 200;
		if (options['interval'] === undefined) options['interval'] = 100;
		if (options['limit'] === undefined) options['limit'] = false;
		if (options['lifetime'] === undefined) options['lifetime'] = 3500;
		if (options['endScale'] === undefined) options['endScale'] = 0;
		if (options['endAlpha'] === undefined) options['endAlpha'] = 0;
		if (options['endPositionOffset'] === undefined) options['endPositionOffset'] = [0, 0];
		if (options['targetDistance'] === undefined) options['targetDistance'] = [300, 300];

		let emitter = this.buildChild(container, {type: 'emitter', count: options.count, limit: options.limit, images: function() {

			if (typeof particles[0] === 'string') {

				return this.buildChild(emitter, {type: 'sprite', image: this.sample(particles), rotation: Math.random() * Math.PI * 2, alpha: 0.8 +  Math.random() * 0.2});

			} else if (typeof particles[0] === 'object') {

				return this.sample(particles);

			} else if (typeof particles[0] === 'function') {

				return particles[0].call(this, emitter);

			}

		}, particleTween: function(sprite) {

			let pos = this.getPointInsideEllipse(options['targetDistance'][0], options['targetDistance'][1]);

			pos[0] += options['endPositionOffset'][0];
			pos[1] += options['endPositionOffset'][1];

			let dist = 5 * Math.sqrt(Math.pow(pos[0], 2) + Math.pow(pos[1], 2));

			let angle = Math.atan2(pos[1], pos[0]);

			let time = _.random(1000, 2000);

			let scale = 0.5 +  Math.random() * 0.5;

			let rotation = Math.random() * Math.PI * 2;

			return {
				set: [
					['scale', 0]
				],
				to: [
					['scale', scale, time*0.2, 0, Back.easeOut.config(1.2)],
					['rotation', sprite.rotation + rotation*0.2, time*0.2],
					['position', pos, time*0.2, 0, Power1.easeIn]
				],
				next: [
					['scale', options['endScale'], time*0.8],
					['rotation', sprite.rotation + rotation*0.8, time*0.8],
					['position', [dist * Math.cos(angle), dist * Math.sin(angle)], time * 0.8, 0, Power1.easeOut],
					['alpha', options['endAlpha'], time*0.1, time*0.7]
				]
			}

		}});

		emitter.emit();

		emitter.skipUpdate = false;

		return emitter;

	},

	//Эффект землетрясения
	earthquake(containers, scale = 1, quake_time = 50, total_time = 1000, delay = 0, next) {

		if (!this.isArray(containers)) containers = [containers];

		const offsets = [-3 * App.PixelRatio, -1.5 * App.PixelRatio, 0, 1.5 * App.PixelRatio, 3 * App.PixelRatio];

		const positions = [];

		this.each(containers, (container) => {
			if (typeof container === 'string') container = this[container];
			positions.push({x: container.position.x, y: container.position.y});
		});

		let count = 0;

		const f = () => {

			const offset_x = _.sample(offsets);
			const offset_y = _.sample(offsets);

			this.each(containers, (container, i) => {

				this.tween(['position', [positions[i].x + offset_x * scale, positions[i].y + offset_y * scale], quake_time, 0, Bounce.easeIn], container, () => {

					if (count * quake_time >= total_time) {

						c();

					} else {

						f();

					}

				});

			});

			count++;

		};

		const c = () => {

			this.each(containers, (container, i) => {

				this.tween(['position', [positions[i].x, positions[i].y], quake_time, 0, Bounce.easeIn], container, () => {

					if (next) {

						next.call(this);
						next = null;

					}

				});

			});

		};

		this.timeout(f, delay || 0);

	},

	//Анимация руки для туториала указывающей что нужно нажать на кнопку
	//Спрайт руки нужно положить так, чтобы 0 0 позиция указывала на кнопку
	titorialHandButtonPressAnimation(containers, speed = 1, delay = 0) {

		if (typeof containers === 'string') containers = this[containers];

		this.tween({set: ['alpha', 0]}, containers);

		this.timeout(() => {

			this.tween({
				set: [
					['position', [50, 50]],
					['scale', 1],
					['alpha', 0]
				],
				to: [
					['position', [0, 0], 500 / speed, 0, Power2.easeInOut],
					['scale', 0.8, 500 / speed, 0, Power2.easeInOut],
					['alpha', 1, 200 / speed]
				],
				next: [
					['scale', 0.7, 300 / speed, 0, Power2.easeInOut],
					['alpha', 0, 400 / speed, 500 / speed]
				],
				loop: true
			}, containers)

		}, delay);

	},

	//Запускает анимацию или синхронно устанавивает значения для массива спрайтов
	tweenOrSet(containers, speed, delay, options, next, set_fn, tween_fn) {

		//Предусматриваем сокращённое указание next вместо options параметра если options не нужны
		if (typeof options === 'function') {

			next = options;
			options = {};

		}

		//По умолчанию плавный ease
		options.ease = options.ease || Power1.easeInOut;

		return this.syncOrTimeout(delay, () => {

			containers = this.getContainers(containers);

			_.each(containers, container => {

				if (speed === false) {

					set_fn(container);

				} else {

					tween_fn(container, 200 / speed, (typeof options.ease === 'string') ? EaseLookup.find(options.ease) : options.ease);

				}

			});

			if (next) this.timeout(next, 200 / speed);

		});

	},

	//Выполняет функцию через таймаут, а если таймаут 0, то синхронно, без всяких таймаутов
	syncOrTimeout(timeout, fn) {

		if (timeout > 0) return this.timeout(fn, timeout);
		else return fn();

	},

	//Возвращает массив объектов спрайтов раскрывая записи указывающие на спрайты (строковые имена, ссылки на дочерние элементы и т.д.)
	//Пример: ["sprite 1", this["sprite 2"], "sprite 3:children", "sprite 4:chars", "sound asset name:sound", "video asset name:video"]
	//Вернёт: [this["sprite 1"], this["sprite 2"], ...this["sprite 3"].children, ...this["sprite 4"].chars, App.Assets["sound asset name"].sound, App.Assets["video asset name"].video]
	getContainers(containers, options = {}) {

		if (!this.isArray(containers)) containers = [containers];

		let result = [];

		for (let i=0, l=containers.length; i<l; i++) {

			if (typeof containers[i] === 'string') {

				if (containers[i].indexOf(":") !== -1) {

					let split = containers[i].split(':');

					let name = split[0];
					let modifier = split[1];

					if (modifier === 'sound') {

						if (App.Assets[name] && App.Assets[name].sound) result.push(App.Assets[name].sound);
						else console.error(`VisualEffects: sound asset '${name}' not available.`);

					} else if (modifier === 'video') {

						if (App.Assets[name] && App.Assets[name].video) result.push(App.Assets[name].video);
						else console.error(`VisualEffects: video asset '${name}' not available.`);

					} else {

						if (this[name]) {

							if (this[name][modifier]) result = result.concat(this[name][modifier]);
							else console.error(`VisualEffects: modifier '${modifier}' not found in container '${name}'.`);

						} else {

							console.error(`VisualEffects: container '${name}' not found.`);

						}

					}

				} else {

					if (this[containers[i]]) result.push(this[containers[i]]);
					else console.error(`VisualEffects: container '${containers[i]}' not found.`);

				}

			} else {

				result.push(containers[i]);

			}

		}

		if (options.randomize) result = _.shuffle(result);

		return result;

	},

	//Выполняет анимации по списку вида:
	//[   функция     задержка     параметры функции
	//  ["fadeTo",           0,    [["sprite 1", "sprite 2"], 0]],
	//
	//  ["moveBy", 	       500,    ["sprite 1", 0, 300]],
	//  ["fadeTo",           0,    ["sprite 1", 1, 0.2]],
	//  ["moveToDefault",    0,    ["sprite 1", 0.1, 0, {"ease": "Power4.easeOut"}]],
	//
	//  ["moveBy", 	       200,    ["sprite 2", 0, 300]],
	//  ["fadeTo",           0,    ["sprite 2", 1, 0.2]],
	//  ["moveToDefault",    0,    ["sprite 2", 0.1, 0, {"ease": "Power4.easeOut"}]]
	//]
	animate(animations_list, options = {}) {

		this.syncOrTimeout(options["delay"] || 0, () => {

			let time = 0;

			_.each(animations_list, animation_params => {

				if (!this.checkAnimationCondition(animation_params[3])) return;

				let animation_name = animation_params[0];

				if (["fadeTo", "moveTo", "moveBy", "moveToDefault", "moveToSprite", "scaleTo", "scaleBy", "scaleToDefault", "scaleToSprite", "rotateTo", "rotateBy", "rotateToDefault", "sequence", "pulsation"].includes(animation_name)) {

					time += animation_params[1];

					this.timeout(() => {

						let containers = options["containers"] ? options["containers"] : animation_params[2][0];
						let other_params = options["containers"] ? animation_params[2] : animation_params[2].slice(1);

						this[animation_name](containers, ...other_params);

					}, time);

				} else {

					console.error(`VisualEffects: animate name '${animation_name}' not supported.`);

				}

			});

		});

	},

	checkAnimationCondition(options) {

		if (!options || !options.condition) return true;

		let condition = options.condition;

		if (condition.landscape && !App.IsLandscape) return false;
		if (condition.portrait && !App.IsPortrait) return false;

		if (condition.iPhone && MRAID.size.proportionDevice !== 'iPhone') return false;
		if (condition.iPhoneX && MRAID.size.proportionDevice !== 'iPhoneX') return false;
		if (condition.iPad && MRAID.size.proportionDevice !== 'iPad') return false;

		return true;

	},

	//[DEPRECATED]
	fadeOut(container, speed = 1, delay = 0, next) {

		console.warn('[DEPRECATED] Метод fadeOut устарел - используйте .fadeTo()');

		return this.tween({
			to: ['alpha', 0, 200 / speed, delay, Power1.easeInOut]
		}, container, next);

	},

	//[DEPRECATED]
	fadeIn(container, speed = 1, alpha = 1, delay = 0, next) {

		console.warn('[DEPRECATED] Метод fadeIn устарел - используйте .fadeTo()');

		return this.tween({
			set: ['alpha', 0],
			to: ['alpha', alpha, 200 / speed, delay, Power1.easeInOut]
		}, container, next);

	},

	//[DEPRECATED]
	fadeOutFly(container, direction = 'bottom', distance = 500, speed = 1, delay = 100, options = {}, next) {

		console.warn('[DEPRECATED] Метод fadeOutFly устарел - используйте .fadeTo() + .fadeTo()');

		if (typeof container === 'string') container = this[container];

		options.ease = options.ease || Power1.easeIn;

		let to_pos_x = container.position.x;
		let to_pos_y = container.position.y;

		if (direction === 'left') to_pos_x -= distance;
		if (direction === 'right') to_pos_x += distance;
		if (direction === 'top') to_pos_y -= distance;
		if (direction === 'bottom') to_pos_y += distance;

		return this.tween({
			to: [
				['alpha', 0, 200 / speed, delay, options.ease],
				['position', [to_pos_x, to_pos_y], 200 / speed, delay, options.ease]
			]
		}, container, next);

	},

	//[DEPRECATED]
	fadeInFly(container, direction = 'top', distance = 500, speed = 1, delay = 100, options = {}, next) {

		console.warn('[DEPRECATED] Метод fadeInFly устарел - используйте .fadeTo() + .fadeTo()');

		if (typeof container === 'string') container = this[container];

		options.ease = options.ease || Power1.easeOut;
		options.endAlpha = options.endAlpha || 1;

		let start_pos_x = 0;
		let start_pos_y = 0;

		if (typeof container === 'object' && container.position) {

			start_pos_x = container.position.x;
			start_pos_y = container.position.y;

		}

		if (typeof container === 'object' && container.params && container.params.position) {

			start_pos_x = container.params.position[0];
			start_pos_y = container.params.position[1];

		}

		let from_pos_x = start_pos_x;
		let from_pos_y = start_pos_y;

		if (direction === 'left') from_pos_x -= distance;
		if (direction === 'right') from_pos_x += distance;
		if (direction === 'top') from_pos_y -= distance;
		if (direction === 'bottom') from_pos_y += distance;

		return this.tween({
			set: [
				['alpha', 0],
				['position', [from_pos_x, from_pos_y]]
			],
			to: [
				['alpha', options.endAlpha, 500 / speed, delay, options.ease],
				['position', [start_pos_x, start_pos_y], 500 / speed, delay, options.ease]
			]
		}, container, next);

	},

	//[DEPRECATED]
	fadeInScale(container, start_scale = 0.5, speed = 1, delay = 100, options = {}, next) {

		console.warn('[DEPRECATED] Метод fadeInScale устарел - используйте .fadeTo() + .scaleTo()');

		if (typeof container === 'string') container = this[container];

		options.ease = options.ease || Power1.easeOut;
		options.endAlpha = options.endAlpha || 1;

		let scale = 0;

		if (typeof container === 'object' && container.scale) scale = container.scale.x;
		else if (typeof container === 'object' && container.params && container.params.scale) scale = container.params.scale;
		else scale = 1;

		if (options.endScale) scale = options.endScale;

		let from_scale = scale * start_scale;

		return this.tween({
			set: [
				['alpha', 0],
				['scale', from_scale]
			],
			to: [
				['alpha', options.endAlpha, 500 / speed, delay, options.ease],
				['scale', scale, 500 / speed, delay, options.ease]
			]
		}, container, next);

	},

	//[DEPRECATED]
	fadeOutScale(container, speed = 1, delay = 100, options = {}, next) {

		console.warn('[DEPRECATED] Метод fadeOutScale устарел - используйте .fadeTo() + .scaleTo()');

		if (typeof container === 'string') container = this[container];

		options.ease = options.ease || Power1.easeIn;

		let scale = 1;

		if (typeof container === 'object' && container.scale) scale = container.scale.x;
		else if (typeof container === 'object' && container.params && container.params.scale) scale = container.params.scale;

		if (options.endScale) scale = options.endScale;

		return this.tween({
			to: [
				['alpha', 0, 500 / speed, delay, options.ease],
				['scale', scale, 500 / speed, delay, options.ease]
			]
		}, container, next);

	},

	//[DEPRECATED]
	fadeInOutScale(container, speed = 1, delay = 100, options = {}, next) {

		console.warn('[DEPRECATED] Метод fadeOutScale устарел - используйте .scaleTo() + .scaleTo() + .fadeTo()');

		if (typeof container === 'string') container = this[container];

		options.ease = options.ease || Power1.easeIn;

		let scale = 1;

		if (typeof container === 'object' && container.scale) scale = container.scale.x;
		else if (typeof container === 'object' && container.params && container.params.scale) scale = container.params.scale;

		let start_scale = scale / 2;
		let end_scale = scale * 2;

		if (options.startScale) start_scale = options.startScale;
		if (options.endScale) end_scale = options.endScale;

		let tween1 = this.tween({
			set: ['scale', start_scale],
			to: ['scale', end_scale, 500 / speed, delay, options.ease]
		}, container, next);

		let tween2 = this.tween({
			set: ['alpha', 0],
			to: ['alpha', 1, 500 / speed / 2, delay, options.ease],
			next: ['alpha', 0, 500 / speed / 2, 0, options.ease]
		}, container, next);

		return [tween1, tween2];

	}

});