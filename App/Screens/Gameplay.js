App.Gameplay = new Screen({

	Name: "Gameplay",

	Containers: [

		{name: 'BackgroundContainer', scaleStrategy: ['cover-screen', 1920, 1080], childs: [
			{name: 'game con', scalePortrait: 0.7, scaleLandscape: 1.1, positionPortrait: [-80, -50], positionLandscape: [0, 150], childs: [
				{name: 'background', type: 'sprite', image: 'background.jpg', event: 'screen', position: [50, 150], childs: [
					{name: 'wall gates', position: [-265, -600], childs: [
						{name: 'wall 1', type: 'sprite', image: 'wall_1.png'},
						{name: 'wall 2', type: 'sprite', image: 'wall_2.png'},
						{name: 'wall 3', type: 'sprite', image: 'wall_3.png'},
					]},
					{name: 'wall broken', type: 'sprite', image: 'wall_4.png', position: [-255, -560], alpha: 0, childs: [
						{name: 'wall smoke', type: 'sprite', image: 'gate_smoke.png', position: [30, 30], blendMode: 3, alpha: 0},
						{name: 'wall emi'},
					]},
					{name: 'wall smoke damage', type: 'sprite', image: 'gate_smoke.png', position: [-40, -120], blendMode: 3},
					{name: 'wall emi damage', position: [-240, -550]},
					{name: 'wall hp', position: [-260, -720], childs: [
						{name: 'wall bg', type: 'sprite', image: 'hp_bar_bg.png'},
						{name: 'hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
						{name: 'hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
					]},
					{name: 'zombie mask', type: 'sprite', image: 'zombie_mask.png', scale: 2, position: [0, 0], alpha: 1},
				]},
				{name: 'cells', type: 'sprite', image: 'cells.png', scale: 1, position: [120, -160]},
				{name: 'help overlay', type: 'sprite', image: 'overlay.png', scale: 2, scalePortrait: 3, position: [0, -150], positionPortrait: [0, 0]},
				{name: 'towers', position: [0, 150]},
				{name: 'watchtower 2', type: 'sprite', image: 'watchtower.png', position: [205, -305], scale: 0.8},
				{name: 'watchtower 2 hp', position: [220, -500], childs: [
					{name: 'watchtower 2 bg', type: 'sprite', image: 'hp_bar_bg.png'},
					{name: 'watchtower 2 hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
					{name: 'watchtower 2 hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
				]},
				{name: 'zombie spawn', position: [-400, 600], mask: 'zombie mask', childs: [ // mask: 'zombie mask',
					{name: 'zombies die'},
					{name: 'zombies'},
					{name: 'wall emi damage 2', position: [240, -1050]},
				]},
				{name: 'watchtower 1', type: 'sprite', image: 'watchtower.png', position: [250, 150], scale: 0.9},
				{name: 'watchtower 1 hp', position: [280, -50], childs: [
					{name: 'watchtower 1 bg', type: 'sprite', image: 'hp_bar_bg.png'},
					{name: 'watchtower 1 hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
					{name: 'watchtower 1 hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
				]},
				{name: 'coins'}
			]},
		]},
		{name: 'VignetteContainer', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], childs: [
			{name: 'vignette shading', type: '9-slice', image: 'red-frame.png', leftWidth: 200, topHeight: 200, rightWidth: 200, bottomHeight: 200, size: [1080, 1080], x: -300, y: -300, scale: 2},
		]},
		{name: 'TopUI', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], position: ['width', 0], childs: [
			{name: 'top ui con', positionLandscape: [-160, 250], positionPortrait: [-160, 260], scale: 0.8, anchor: [1, 1], childs: [
				{name: 'top ui badge', type: 'sprite', image: 'top_ui.png'},
				{name: 'score', type: 'text', position: [-40, -120], rotation: -0.2, styles: {
					"fontFamily": "Arial-BoldMT",
					"fontStyle": "italic",
					"fontSize": 100,
					"fill": "0xffffff",
					"padding": 20
				}},
			]},
		]},
		{name: 'TopLogo', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], positionLandscape: [0, 0], positionPortrait: ['width/2', 0], childs: [
			{name: 'logo con', childs:[
				{name: 'logo', type: 'sprite', image: 'logo.png', positionLandscape: [280, 140], positionPortrait: [0, 110], scale: 1, scalePortrait: 0.7}
			]}
		]},
		{name: 'IntroContainer', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], childs: [
			{name: 'help message', type: 'text', text: 'HELP_MESSAGE', positionLandscape: [-500, -300], positionPortrait: [-150, -470]},
			{name: 'infected alert', position: [0, 0], scaleLandscape: 1.8, scalePortrait: 2, childs:
				Settings['enable-intro']
				?
				[
					{name: 'infected alert dirt', type: 'sprite', image: 'infected_dirt.png', position: [0, 0], scale: 1},
					{name: 'infected alert goal', type: 'sprite', image: 'infected_goal.png', position: [0, 0], scale: 1},
					{name: 'infected alert bg', type: 'sprite', image: 'infected_bg.png', position: [0, 0], scale: 1},
					{name: 'infected alert sign', type: 'sprite', image: 'infected_sign.png', position: [-200, 0], scale: 0.85},
					{name: 'infected alert text', type: 'text', text: 'INFECTED_ALERT', position: [0, 0], styles: {
						fontFamily: "Arial-BoldMT", fontWeight: "normal", fill: '0xd29732', fontSize: "56px", lineJoin: "round", stroke: "0x000000", strokeThickness: 1, letterSpacing: 2
					}}
				]
				: []
			},
		]},

		{name: 'BottomUI', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], position: ['width/2', 'height'], childs: [
			{name: 'bottom ui', positionPortrait: [0, -180], positionLandscape: [-540, -170], childs: [
				{name: 'help arrows', rotation: -0.4, childs: [
					{name: 'help arrows con', position: [250, -110], childs: [
						{name: 'help arrow 1', type: 'sprite', image: 'arrow_1.png', position: [-200, 0]},
						{name: 'help arrow 2', type: 'sprite', image: 'arrow_2.png', position: [-170, -50]},
						{name: 'help arrow 3', type: 'sprite', image: 'arrow_3.png', position: [-140, -100]},
						// {name: 'help arrow 4', type: 'sprite', image: 'arrow_4.png', position: [0, -240]},
						// {name: 'help arrow 5', type: 'sprite', image: 'arrow_5.png', position: [0, -320]},
					]}
				]},
				{name: 'ui tower 1 con', position: [-250, 0], button: 'tower', ID: 0, level: 2, price: 200, childs: [
					{name: 'ui tower 1 glow', type: 'sprite', image: 'turret_ui_glow.png', position: [0, -55], scale: 1.1},
					{name: 'ui tower 1', type: 'sprite', image: 'turret_ui_1.png'},
					{name: 'ui tower 1 color', type: 'sprite', image: 'turret_ui_1_color.png'},
					{name: 'ui tower 1 price', type: 'text', text: 'TURRET_1_PRICE', position: [5, 110]},
				]},
				{name: 'ui tower 2 con', position: [0, 0], button: 'tower', ID: 1, level: 3, price: 300, childs: [
					{name: 'ui tower 2 glow', type: 'sprite', image: 'turret_ui_glow.png', position: [0, -55], scale: 1.1},
					{name: 'ui tower 2', type: 'sprite', image: 'turret_ui_2.png'},
					{name: 'ui tower 2 color', type: 'sprite', image: 'turret_ui_2_color.png'},
					{name: 'ui tower 2 price', type: 'text', text: 'TURRET_2_PRICE', position: [15, 110]},
				]},
				{name: 'ui tower 3 con', position: [250, 0], button: 'tower', ID: 2, level: 1, price: 400, childs: [
					{name: 'ui tower 3 glow', type: 'sprite', image: 'turret_ui_glow.png', position: [0, -55], scale: 1.1},
					{name: 'ui tower 3', type: 'sprite', image: 'turret_ui_3.png'},
					{name: 'ui tower 3 color', type: 'sprite', image: 'turret_ui_3_color.png'},
					{name: 'ui tower 3 price', type: 'text', text: 'TURRET_3_PRICE', position: [20, 110]},
				]},
				{name: 'help con', scale: 1, scalePortrait: 1.5, childs: [
					{name: 'help hand', type: 'sprite', image: 'hand.png'},
				]},
			]},
		]},
		{name: 'BottomChar', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], position: ['width', 'height'], childs: [
			{name: 'char con', scale: [-0.6, 0.6], scaleLandscape: [-0.4, 0.4], positionLandscape: [-300, 0], positionPortrait: [-200, 0], childs: [
				{name: 'char', type: 'spine',  spineData: 'char-data', spineAtlas: 'texture-char', scale: Settings['character'] === 'Wacko' ? 1 : 0.7}
			]}
		]},
		{name: 'DebugContainer', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], childs: [
			{name: 'debug background', type: 'graphics', draw: [['beginFill', 0x000000], ['drawRect', [-2000, -2000, 4000, 4000]]], alpha: 0.5},

        ]}
	],

	Events: {

		// Стандартное событие срабатывающее перед созданием спрайтов из секции Containers
		// Здесь можно что-то динамически изменить в Containers если нужно перед их созданием
		'Gameplay before build': function() {

			this.updateChildParamsByName(Settings[this.Name]);

			this.PLACE_POINTS = [
				{
					"name": "point1",
					"type": "sprite",
					"image": "shape.png",
					"ID": 1,
					"position": [
						-352.00641767058346,
						-42.75123222985047
					]
				},
				{
					"name": "point2",
					"type": "sprite",
					"image": "shape.png",
					"ID": 2,
					"position": [
						-301.6777326712722,
						-2.201691744002403
					]
				},
				{
					"name": "point3",
					"type": "sprite",
					"image": "shape.png",
					"ID": 3,
					"position": [
						-251.34899220852674,
						38.34782100536603
					]
				},
				{
					"name": "point4",
					"type": "sprite",
					"image": "shape.png",
					"ID": 4,
					"position": [
						-201.02030720921562,
						76.10088640993297
					]
				},
				{
					"name": "point5",
					"type": "sprite",
					"image": "shape.png",
					"ID": 5,
					"position": [
						-152.08957807097408,
						116.6503991593014
					]
				},
				{
					"name": "point6",
					"type": "sprite",
					"image": "shape.png",
					"ID": 6,
					"position": [
						-101.76089307166285,
						155.80166049978948
					]
				},
				{
					"name": "point7",
					"type": "sprite",
					"image": "shape.png",
					"ID": 7,
					"position": [
						-152.08957807097408,
						190.75816761363637
					]
				},
				{
					"name": "point8",
					"type": "sprite",
					"image": "shape.png",
					"ID": 8,
					"position": [
						-202.41831853371946,
						225.71467472748327
					]
				},
				{
					"name": "point9",
					"type": "sprite",
					"image": "shape.png",
					"ID": 9,
					"position": [
						-254.1450703209689,
						260.67118184133005
					]
				},
				{
					"name": "point10",
					"type": "sprite",
					"image": "shape.png",
					"ID": 10,
					"position": [
						-64.014365456321,
						-263.67631392045445
					]
				},
				{
					"name": "point11",
					"type": "sprite",
					"image": "shape.png",
					"ID": 11,
					"position": [
						-13.685624993575516,
						-224.52503871172658
					]
				},
				{
					"name": "point12",
					"type": "sprite",
					"image": "shape.png",
					"ID": 12,
					"position": [
						300.8688087765636,
						43.94088211384684
					]
				},
				{
					"name": "point13",
					"type": "sprite",
					"image": "shape.png",
					"ID": 13,
					"position": [
						352.5955605638128,
						81.6938920454545
					]
				},
				{
					"name": "point14",
					"type": "sprite",
					"image": "shape.png",
					"ID": 14,
					"position": [
						351.19754923930896,
						155.80166049978948
					]
				},
				{
					"name": "point15",
					"type": "sprite",
					"image": "shape.png",
					"ID": 15,
					"position": [
						349.7995379148051,
						229.9094844270836
					]
				}
			];
			this.ZOMBIE_COUNTER = 0;
			this.WALL_HP = Settings['wall-hp'];
			this.WALL_HP_MAX = Settings['wall-hp'];

			this.TOWER_1_HP_MAX = Settings['tower-hp'] || 1;
			this.TOWER_2_HP_MAX = Settings['tower-hp'] || 1;

			this.ZOMBIE_DAMAGE = Settings['zombie_dmg'];
			this.POINTS = 425;
			this.TOWER_ID = 0;
			this.ZOMBIE_HP = Settings['zombie_hp'];

		},

		// Стандартное событие срабатывающее сразу после создания спрайтов из секции Containers
		'Gameplay build': function() {

			this['watchtower 2'].hp = this.TOWER_2_HP_MAX;
			this['watchtower 1'].hp = this.TOWER_1_HP_MAX;

			this['debug background'].visible = Settings["debug"];
			this['wall broken'].visible = false;

			this.each(this.PLACE_POINTS, p => {
				this.buildChild('cells', {name: p.name, type: p.type, image: p.image, position: p.position, ID: p.ID, scale: 1, alpha: 0})
			});

			this['cells'].alpha = 0;

			this.each(this['infected alert'].children, c => { if (c) c.alpha = 0});
			this.each(this['help arrows con'].children, c => { if (c) c.alpha = 0});

			this.setText('score', this.POINTS, true, true);

			for (let i = 1; i < 4; i++) {

				this['ui tower ' + i + ' glow'].alpha = 0;
				this['ui tower ' + i + ' color'].alpha = 0;
				this['ui tower ' + i + ' con'].alpha = 0;
				this['ui tower ' + i + ' con'].visible = false;

			}

			this['wall 2'].alpha = 0;
			this['wall 3'].alpha = 0;

			this['top ui con'].alpha = 0;
			this['help hand'].alpha = 0;
			this['help overlay'].alpha = 0;
			// this['wall hp'].alpha = 0;
			this['char'].alpha = 0;
			this['logo'].alpha = 0;
			this['help message'].alpha = 0;
			this['score'].ready = true;

			this['vignette shading'].alpha = 0;
			this['wall smoke damage'].alpha = 0;

		},

		// Стандартное событие срабатывающее на изменение размеров или ориентации экрана
		'Gameplay resize': function() {

			const defWidth = 1920;
			const defHeight = 1080;

			this.gameScale = 0;

			if (App.IsLandscape) {

				if ((App.Width / App.Height) < (defWidth / defHeight)) {

					this['vignette shading'].width = defWidth;
					this['vignette shading'].height = defHeight * (defWidth / defHeight) / (App.Width / App.Height);
					this.gameScale = (defWidth / defHeight) / (App.Width / App.Height);

				} else {

					this['vignette shading'].width = defWidth * (App.Width / App.Height) / (defWidth / defHeight);
					this['vignette shading'].height = defHeight;
					this.gameScale = (App.Width / App.Height) / (defWidth / defHeight);

				}

			} else {

				if ((App.Width / App.Height) < (defHeight / defWidth)) {

					this['vignette shading'].width = defHeight;
					this['vignette shading'].height = defWidth * (defHeight / defWidth) / (App.Width / App.Height);
					this.gameScale = (defHeight / defWidth) / (App.Width / App.Height);

				} else {

					this['vignette shading'].width = defHeight * (App.Width / App.Height) / (defHeight / defWidth);
					this['vignette shading'].height = defWidth;
					this.gameScale = (App.Width / App.Height) / (defHeight / defWidth);

				}
			}

			this['vignette shading'].x = -this['vignette shading'].width / 2;
			this['vignette shading'].y = -this['vignette shading'].height / 2;

			this['vignette shading'].width /= this['vignette shading'].params.scale;
			this['vignette shading'].height /= this['vignette shading'].params.scale;

			if (this.SHAKE_T) this.SHAKE_T.stop();
			this.moveToDefault('game con');

		},

		// Стандартное событие срабатывающее во время показа экрана (есть ещё и hided - срабатывает во время скрытия экрана)
		'Gameplay showed': function() {

			this.updateSettings();

			if (Settings["intro"]) {

				this.showIntro(() => {

					this.startGame();

				});

			} else {

				this.skipIntro(() => {

					this.startGame();

				});

			}
			// this.buildTower(1, 180);
			// this.transferToCTA();
			// App.Teaser.show();
			// this.wallDestroy();
			// this.loseGame();

		},

		// Стандартное событие срабатывающее на каждый тик / каждую перерисовку экрана
		// Тут лучше ничего не писать, так как этот код срабатывает 60 раз в секунду или больше в зависимости от системы пользователя
		// Любой код расположенный здесь будет снижать производительность
		'Gameplay update': function() {

			if (this.state === 'pause') return;

			const dt = App.timeOffset / 5;

			this.moveZombies(dt);
			this.towersAim(dt);
			this.bossBlood(dt);

		},

		'Gameplay tower down': function(tower, e) {

			MRAID.markMeaningfulInteraction();

			if (this.TOWER || !tower.canBuy || this.state === 'cta') return;

			if (this.state !== 'tutorial') this.pauseGame();

			this.TOWER = this.buildTower(tower.params.level, 180, tower.params.price);

			const pos = this.TOWER.parent.toLocal(new PIXI.Point(e.data.global.x, e.data.global.y));

			this.TOWER.position.set(pos.x, pos.y);

			this.TOWER.place.tint = '0xFF0000';

			this.fadeTo('cells', 1, 0.5);

			this.PRESSED_TOWER = tower;

			if (this.state !== 'tutorial') this.hideTutorHand();

		},
		'Stage Press Move': function(s, e) {

			if (!this.TOWER) return;

			const pos = this.TOWER.parent.toLocal(new PIXI.Point(e.data.global.x, e.data.global.y));

			this.TOWER.position.set(pos.x, pos.y);

			this.findPlace(this.TOWER, this['cells']);

			const angle = this.findAngle(this.TOWER);

			if (angle && this.TOWER.placeAngle !== angle || angle === 0 && this.TOWER.placeAngle !== 0) this.changeTower(this.TOWER, angle);

		},
		'Stage Press Up': function(s, e) {

			// if (!this.P) this.P = [];
			// if (!this.C) this.C = 1;
			//
			// const pos = this['cells'].toLocal(new PIXI.Point(e.data.global.x, e.data.global.y));
			// const obj = {
			// 	"name": "point" + this.C,
			// 	"type": "sprite",
			// 	"image": "shape.png",
			// 	"ID": this.C,
			// 	"position": [
			// 		pos.x,
			// 		pos.y]
			// }
			//
			// this.C ++;
			// this.P.push(obj);
			//
			// console.log(this.P);

			if (this.TOWER){

				if (this.TOWER.newPlace){

					this.moveToSprite(this.TOWER, this.TOWER.newPlace);

					this.TOWER.active = true;
					this.TOWER.place.alpha = 0;

					this.changeScorePoints(this.TOWER.price, this.PRESSED_TOWER);

					const ground = this.buildChild(this.TOWER, {name: 'ground', type: 'sprite', image: 'ground.png', scale: 2});
					this.TOWER.addChildAt(ground, 0);

					this.checkCanBuyNewTower();

					this.playSound('s_flamethrower_equip.mp3');

					if (this.state === 'tutorial'){

						this.hideTutorial();
						this.fadeTo('cells', 0, 0.5);

					}

				}else{

					this.TOWER.destroy();

				}

				this.TOWER = null;
				this.PRESSED_TOWER = null;

				if (this.state !== 'tutorial'){

					this.unpauseGame();
					this.fadeTo('cells', 0, 0.5);

				}

				this.handTimeout = this.timeout(() => this.handTimeout = null, 2000);

			}

		},
		'Gameplay screen click': function(container, e) {


		},

		'Gameplay resumed': function() {



		},

		'Gameplay paused': function() {



		},

		'Setting Changed': function(name, value) {

			//Здесь нужно автоматически применить изменения в настройках Settings
			//Это нужно только для Dashboard чтобы не перезагружать фрейм игры

			this.updateSettings(name, value);

		}

	},

	//Обычно этот метод нужен во всех играх.
	//Здесь нужно написать код который скроет правила игры (если они есть в игре и отображаются в самом начале).
	//Или сделать первое действие (которое предлагается сделать игроку) автоматически.
	//Этот метод запускается автоматически после Settings["autoplay-timeout"] задержки, которая запускается после вызова MRAID.track('Game Starts');
	autoplay() {

		if (App.Tutorial.showed) App.Tutorial.animateHide();

	},

	//Обычно этот метод нужен во всех играх.
	//Здесь нужно написать код, который заблокирует рекцию на действия игрока
	//и запустит анимации, которые скроют плавно экран Gameplay и покажут экран CTA.
	//Этот метод стоит вызывать когда игрок добился цели в игре, набрал нужное количество очков или победил врага.
	//Также этот метод вызывается автоматически после Settings["gameplay-timeout"], Settings["idle-timeout"] и в других случаях
	transferToCTA(reason, timeout) {

		if (App.Tutorial.showed) App.Tutorial.animateHide();

		if (reason === 'win' && Settings['aggressive-mode']){

			setTimeout(() => Broadcast.call("CallToAction cta click"), 1500);

		}

		clearTimeout(this.TransferToCTATimeout);

		this.TransferToCTATimeout = this.timeout(function() {

			if (Settings["redirect-target-url-after-game"]) {
				setTimeout(() => {
					MRAID.open();
				}, 200);
			} else {
				if (!App.CallToAction.showed) App.CallToAction.show(reason);
			}

		}, typeof timeout === "number" ? timeout : 0);

	},

	//Здесь нужно применить заново все настройки созданные для этого проекта
	//Сменить фон в зависимости от настройки, текстуру героя и т.д.
	//Всё что зависит от настроек переделать заново
	updateSettings() {

		//this['fish ui text'].text = this.fishesCount + '/' + Settings["needed-fishes-count"];

		//this.applyParams('background top', {image: 'water-' + Settings["location"].toLowerCase() + '-top-background.jpg'});
		//this.applyParams('background bottom', {image: 'water-' + Settings["location"].toLowerCase() + '-bottom-overlay.png'});

		//this.updateChildParamsByName(this.waterConfig[Settings["location"]]);

		this.resize();

	},

	showIntro(next) {

		//Запускаем тут анимации появления первого экрана

		if (next) next.call(this);

	},

	skipIntro(next) {

		//Показываем тут быстро первый экран без анимаций его появления

		if (next) next.call(this);

	},
	showIntroHand(){

		this.state = 'tutorial';

		this.fadeTo(['help overlay', 'help message'], 1, 1);

		this['help message'].anim = this.pulsation(this['help message'], 1.05, 0.4);

		this.fadeTo(['cells', 'ui tower 1 color', 'char'], 1, 0.5);

		this.animateUITower(this['ui tower 1 con']);

		this.each(this['zombies'].children, zombie => zombie.children[0].stop());

		this['ui tower 1 con'].canBuy = true;

		this['char'].state.setAnimation(0, 'idle', true);

	},
	hideHand(){

		this.each(this['help arrows con'].children, arrow => {

			if (arrow.alphaTween) arrow.alphaTween.stop();
			arrow.visible = false;

		});

		if (this['ui tower 1 glow'].alphaTween) this['ui tower 1 glow'].alphaTween.stop();
		if (this['help hand'].tweenHandMove) this['help hand'].tweenHandMove.stop();

		this.fadeTo(['ui tower 1 glow', 'help hand', 'help overlay', 'char', 'help message'], 0, 0.5, 0, () => {

			this.each(this['zombies'].children, zombie => zombie.children[0].play());
			this.state = 'game';

		});

		for (let i = 1; i < 4; i++) {

			this['ui tower ' + i + ' glow'].alpha = 0;
			this['ui tower ' + i + ' color'].alpha = 0;

		}

		this.fadeTo(['top ui con', 'wall hp', 'logo'], 1, 0.5);

		this.hideTutorHand();

	},
	showInfectedAlert() {

		let animObj, delay = 0;

		animObj = this['infected alert bg'];
		delay = 0;

		if (animObj.tweenShow) animObj.tweenShow.stop();

		animObj.tweenShow = this.tween({
			set: [
				['alpha', 0],
				['scale', [0.8, 1.2]]
			],
			to: [
				['alpha', 1, 200, delay, Linear.easeOut],
				['scale', 1, 400, delay, Back.easeOut],
			]
		}, animObj);

		animObj.visible = true;

		animObj = this['infected alert goal'];

		delay += 50;

		if (animObj.tweenRotate) animObj.tweenRotate.stop();

		animObj.tweenRotate = this.tween({
			set: [
				['alpha', 0],
			],
			to: [
				['alpha', 1, 100, delay, Linear.easeOut],
				['rotation', [0, 0, Math.PI], 6000, delay, Linear.easeOut],
			]
		}, animObj);

		animObj.visible = true;

		animObj = this['infected alert dirt'];

		delay += 50;

		if (animObj.tweenShow) animObj.tweenShow.stop();

		animObj.tweenShow = this.tween({
			set: [
				['alpha', 0],
				['scale', 0.6]
			],
			to: [
				['alpha', 1, 100, delay, Linear.easeOut],
				['scale', 1, 400, delay, Power1.easeOut],
			]
		}, animObj);

		animObj.visible = true;

		animObj = this['infected alert text'];

		delay += 100;

		if (animObj.tweenShow) animObj.tweenShow.stop();

		animObj.tweenShow = this.tween({
			set: [
				['alpha', 0]
			],
			to: [
				['alpha', 1, 100, delay, Linear.easeOut]
			]
		}, animObj);

		animObj.visible = true;

		animObj = this['infected alert sign'];

		delay += 100;

		if (animObj.tweenShow) animObj.tweenShow.stop();

		animObj.tweenShow = this.tween({
			set: [
				['alpha', 0],
				['position', [animObj.params.position[0] - 200, animObj.params.position[1]]],
			],
			to: [
				['alpha', 1, 100, delay, Linear.easeOut],
				['position', [animObj.params.position[0], animObj.params.position[1]], 400, delay, Power1.easeOut],
			]
		}, animObj);

		animObj.visible = true;

		this['infected alert'].visible = true;

		delay = 1600;

		this.fadeTo(['infected alert sign', 'infected alert text', 'infected alert dirt', 'infected alert goal', 'infected alert bg'], 0, 0.5, delay, () => {

			if (animObj.tweenRotate) animObj.tweenRotate.stop();

			this.tutorialTimeout();

		});

	},

	startGame() {

		MRAID.track('Game Starts');

		this.startZombiesSpawner();

		// this['game con'].scale.set(1, 1);
		//
		// this.scaleTo('game con', App.IsLandscape ? 1.1 : 1.05, 0.1, 500);

		for (let i = 1; i < 4; i++) {

			this.moveBy('ui tower ' + i + ' con', 0, 500);
			this.moveToDefault('ui tower ' + i + ' con', 0.2, i * 150 + Settings['enable-intro'] ? 1500 : 0);
			this.fadeTo('ui tower ' + i + ' con', 1, 0.5, i * 150 + Settings['enable-intro'] ? 1500 : 0, () => {

				if (i === 3){

					if (!Settings['enable-intro']) this.tutorialTimeout(900);
				}

			});

		}

		if (Settings['enable-intro']) this.showInfectedAlert();

	},
	findPlace(tower, cells){

		const bounds1 = tower.point.getBounds();

		let res = null;

		for (let i = 0; i < cells.children.length; i++) {

			const cell = cells.children[i];

			res = this.collisionCheck(bounds1, cell);

			if (res){

				this.each(this['towers'].children, t => {

					if (t && t.ID !== tower.ID){

						if (this.collisionCheck(tower.place.getBounds(), t.place, 2.2)){

							res = null;

						}
					}

				});

				if (tower.newPlace && tower.newPlace === cell.name){

					break

				}else{
					if (!res) return;

					tower.newPlace = cell.name;
					tower.newPlaceID = cell.params.ID;
					tower.place.tint = '0x00FF00';
					// console.log(cell.name)
					break

				}

			}else{

				tower.newPlace = null;
				tower.place.tint = '0xFF0000';

			}
		}
	},
	findAngle(tower){

		if (tower.newPlace && tower.newPlaceID){

			const placeId = tower.newPlaceID;

			let angle = 180;

			if (placeId > 9 && placeId < 14) angle = 90;
			else if (placeId > 13) angle = 45;

			return angle

		}

	},
	changeTower(tower, angle){

		const pos = tower.position.clone();
		const lvl = tower.lvl;
		const price= tower.price;

		tower.destroy();

		tower = this.buildTower(lvl, angle, price);

		this.TOWER = tower;
		this.TOWER.position.set(pos.x, pos.y);

	},
	collisionCheck(obj1, obj2, scale = 1){

		const bounds1 = obj1;
		const bounds2 = obj2.getBounds();

		return bounds1.x < bounds2.x + bounds2.width / 2
			&& bounds1.x + bounds1.width / scale > bounds2.x
			&& bounds1.y < bounds2.y + bounds2.height
			&& bounds1.y + bounds1.height > bounds2.y;

	},
	startZombiesSpawner(){

		this.zombiesSpawner();


	},
	moveZombies(dt){

		if (this.state === 'tutorial') return;

		this.each(this['zombies'].children, zombie => {

			if (zombie.alive){

				this.BOSS_HP_BAR.x = zombie.x;
				this.BOSS_HP_BAR.y = zombie.y - 80;

				if (zombie.x < 440 && zombie.y > -600){

					zombie.x += dt * zombie.speed * 1.1;
					zombie.y -= dt * zombie.speed;

				}else{

					//moving to tower 1

					if (this['watchtower 1'].hp > 0){

						if (zombie.children[0].name === 'zombie att'){

							if (!zombie.attack && zombie.children[0].currentFrame === 15) this.watchTowerDamage('watchtower 1', zombie);

						}

						if (zombie.tower1) return;

						zombie.tower1 = true;

						const zombieAtt = this.changeZombie(zombie, 'boss-attack', 33, true, 0.5);
						zombie.rotation = 0.5;

						zombieAtt.gotoAndPlay(0);

						zombieAtt.onLoop = () => {

							zombie.attack = false;

						}

					}else{

						//moving to tower 2

						if (zombie.children[0].name === 'zombie att' && !zombie.attack && zombie.tower1){

							zombie.tower1 = false;

							const zombieMove = this.changeZombie(zombie, 'boss-walk', 44, true, 0.7, 'boss walk');
							zombieMove.gotoAndPlay(0);

							zombie.rotation = 0;

						}

						if (zombie.x > 440 && zombie.y > -660){

							if (zombie.children[0].name !== 'boss walk') return;

							zombie.x += dt * zombie.speed * 0.8;
							zombie.y -= dt * zombie.speed * 0.8;

						}else{

							if (!zombie.rotated){

								zombie.rotated = true;

								this.rotateBy(zombie.children[0], -1, 1, 0, () => {

									const zombieMove = this.changeZombie(zombie, 'boss-walk-90', 44, true, 0.7, 'boss walk');
									zombieMove.gotoAndPlay(0);

								});

							}

							if (zombie.x > 480 && zombie.y > -1000){

								zombie.x -= dt * zombie.speed;
								zombie.y -= dt * zombie.speed * 0.9;

							}else{

								if (this['watchtower 2'].hp > 0){

									if (zombie.children[0].name === 'zombie att'){

										if (!zombie.attack && zombie.children[0].currentFrame === 15) this.watchTowerDamage('watchtower 2', zombie);

									}

									if (zombie.tower2) return;

									zombie.tower2 = true;

									const zombieAtt = this.changeZombie(zombie, 'boss-attack', 33, true, 0.5);
									zombie.rotation = 0.5;

									zombieAtt.gotoAndPlay(0);

									zombieAtt.onLoop = () => {

										zombie.attack = false;

									}

								}else{

									//moving to gates

									if (zombie.children[0].name === 'zombie att' && !zombie.attack && zombie.tower2){

										zombie.tower2 = false;

										const zombieMove = this.changeZombie(zombie, 'boss-walk-90', 44, true, 0.7, 'boss walk');
										zombieMove.gotoAndPlay(0);

										zombie.rotation = 0;

									}

									if (zombie.x > 280 && zombie.y > -1200){

										if (zombie.children[0].name !== 'boss walk') return;

										zombie.x -= dt * zombie.speed;
										zombie.y -= dt * zombie.speed * 0.8;

									}else{

										if (this.WALL_HP < 0){

											zombie.x -= dt * zombie.speed;
											zombie.y -= dt * 0.8 * zombie.speed;

											if (!zombie.out) zombie.out = true;

											if (!this.wallDestroyed && !zombie.attack){

												this.wallDestroyed = true;

												this.loseGame();

												const zombieRun = this.changeZombie(zombie, 'boss-walk-90', 44);

												zombieRun.gotoAndPlay(0);

												zombie.out = true;

											}

										}else{

											if (zombie.children[0].name === 'zombie att'){

												if (!zombie.attack && zombie.children[0].currentFrame === 15) {

													if (this.state === 'tutorial' || this.state === 'pause' || zombie.hp <= 0) return;

													zombie.attack = true;

													this.wallDamage();
													this.zombieWallAttack();

												}

											}

											if (zombie.door) return;

											zombie.door = true;

											const zombieAtt = this.changeZombie(zombie, 'boss-attack-90', 33);

											zombieAtt.gotoAndPlay(0);
											zombieAtt.onLoop = () => {

												zombie.attack = false;

											};
										}
									}
								}
							}
						}
					}
				}
			}
		});
	},
	watchTowerDamage(tower, zombie){

		zombie.attack = true;

		this.redBlink();

		// this.earthquake(['game con'], 0.5, 0.1, 10);

		const positions = this['game con'].params.position;

		this.SHAKE_T = this.tween({
			to: ['position', [positions[0] + 2, positions[1] + 2], 50, 0, Bounce.easeIn],
			next: ['position', [positions[0], positions[1]], 50, 0, Bounce.easeIn],
			loop: 2
		}, this['game con']);

		let hp = this[tower].hp - this.ZOMBIE_DAMAGE;

		const hpScale = hp / this.TOWER_1_HP_MAX;

		setTimeout(() => {

			this[tower].hp -= this.ZOMBIE_DAMAGE;

			if (hp > 0 && hp <= 1) {
				this[tower].texture = this.getTexture('watchtower_2.png');
				this[tower].params.image = 'watchtower_2.png';
			}
			if (hp <= 0){
				this[tower].texture = this.getTexture('watchtower_3.png');
				this[tower].params.image = 'watchtower_3.png';
			}

		}, 600);

		this.changeHp(tower + ' hp bar', tower + ' hp bar red', hpScale);

		const emi = this.sphereBurstEmitter(tower, ['p_1.png','p_2.png','p_3.png','p_5.png','p_6.png'], {
			count: 20,
			limit: 50,
			lifetime: 500,
			targetDistance: [50, 10],
			endPositionOffset: [10, 10]
		});

		emi.position.set(this.random(-50, 50), this.random(-20, 20));

		const emi2 = this.sphereBurstEmitter(tower, ['p_2.png','p_3.png','p_4.png','p_5.png','p_6.png'], {
			count: 20,
			limit: 50,
			lifetime: 500,
			targetDistance: [50, 50],
			endPositionOffset: [10, 10]
		});

		emi2.position.set(this.random(-10, 90), this.random(-20, 20));

	},
	zombieWallAttack(){

		this.redBlink();

		const positions = this['game con'].params.position;

		this.SHAKE_T = this.tween({
			to: ['position', [positions[0] + 2, positions[1] + 2], 50, 0, Bounce.easeIn],
			next: ['position', [positions[0], positions[1]], 50, 0, Bounce.easeIn],
			loop: 2
		}, this['game con']);

		let hp = this.WALL_HP - this.ZOMBIE_DAMAGE;

		const hpScale = hp / this.WALL_HP_MAX;

		setTimeout(() => {

			this.WALL_HP -= this.ZOMBIE_DAMAGE;

		}, 100);

		this.changeHp('hp bar', 'hp bar red', hpScale > 0 ? hpScale : 0);

		if (hpScale < 0.8 && hpScale > 0.6){

			this['wall 1'].alpha = 0;
			this['wall 3'].alpha = 1;

		}else if (hpScale < 0.4 && hpScale > 0){

			this['wall 3'].alpha = 1;
			this['wall 2'].alpha = 0.7;

		}

	},
	zombieTakeDamage(hp){

		const hpScale = hp / this.ZOMBIE_HP;

		this.changeHp('zombie hp bar', 'zombie hp bar red', hpScale > 0 ? hpScale : 0);

	},
	changeHp(bar, barRed, hpScale){

		this.scaleTo(bar, [hpScale, 1], 0.5, 0, () => {
			this.scaleTo(barRed, [this[bar].scale.x, 1], 0.5, 500);
		});

		if (!App.Assets['s_zombie_roar.mp3'].sound.playing()) this.playSound('s_zombie_roar.mp3');

		if (hpScale <= 0) this.fadeTo(this[bar].parent, 0, 0.5, 500);

	},
	loseGame(){

		this.moveToDefault('game con');

		this.moveBy('bottom ui', 0, 1000, 0.3);
		this.fadeTo('bottom ui', 0, 0.2);

		this.state = 'cta';

		this.fadeTo('wall broken', 1, 0.5);

		const positions = this['game con'].params.position;

		this.SHAKE_T = this.tween({
			to: ['position', [positions[0] + 4, positions[1] + 4], 50, 0, Bounce.easeIn],
			next: ['position', [positions[0], positions[1]], 50, 0, Bounce.easeIn],
			loop: 2
		}, this['game con']);

		this.transferToCTA('lose', 2500);

		this.scaleTo('game con', 1.2, 0.1, 0, () => {
			this.scaleTo('game con', 1.2);
		});

		this.playSound('s_cta_lose.mp3');

		this.wallDestroy();

	},
	redBlink(){

		const v = this['vignette shading'];

		if (v.anim) return;

		v.anim = this.tween({
			set: ['alpha', 0],
			to: ['alpha', 1, 400],
			next: ['alpha', 0, 400]
		}, v, () => {

			v.anim = null;

		});

	},
	zombiesSpawner(){

		const zombie = this.buildChild('zombies', {
			name: 'zombie', scale: 2
		});

		const zombieRun = this.buildChild(zombie, {
			name: 'zombie run',
			type: 'movie-clip',
			frameTemplate: 'boss-walk-??.png',
			frameStart: 1,
			frameEnd: 44,
			loop: true,
			speed: 0.7,
			scale: 1
		});

		zombie.position.set(0, 0);
		zombieRun.gotoAndPlay(0);
		zombie.alive = true;

		zombie.speed = 0.65;
		zombie.delta = 800;
		// zombie.hp = this.ZOMBIE_HP + parseInt(this.ZOMBIE_COUNTER / 20);
		zombie.hp = this.ZOMBIE_HP;

		const zombieHpCon = this.buildChild('zombie spawn', {
			name: 'zombie hp',
			scale: 0.7
		});
		this.buildChild(zombieHpCon, {
			name: 'zombie hp bg',
			type: 'sprite',
			image: 'hp_bar_bg.png'
		});
		this.buildChild(zombieHpCon, {
			name: 'zombie hp bar red',
			type: 'sprite',
			image: 'hp_bar_red.png',
			anchor: [0, 0.5],
			position: [-75, 0]
		});
		this.buildChild(zombieHpCon, {
			name: 'zombie hp bar',
			type: 'sprite',
			image: 'hp_bar.png',
			anchor: [0, 0.5],
			position: [-75, 0],
			tint: '0x00a550'
		});

		this.BOSS_HP_BAR = zombieHpCon;

		this.ZOMBIE_COUNTER++;

		// if (!App.Assets['s_zombie_fright.mp3'].sound.playing()) this.playSound('s_zombie_fright.mp3');

	},
	changeZombie(zombie, anim, frame = 27, loop = true, speed = 0.7, name = 'zombie att'){

		zombie.removeChildren();

		return this.buildChild(zombie, {
			name: name,
			type: 'movie-clip',
			frameTemplate: anim + '-??.png',
			frameStart: 1,
			frameEnd: frame,
			loop: loop,
			speed: speed,
			scale: 1
		});

	},
	buildTower(lvl, angle, price){

		const tower = this.buildChild('towers', {name: 'tower ' + this['towers'].children.length, scale: 0.7, childs: []});
		const towerPlace = this.buildChild(tower, {name: tower.name + ' place', type: 'sprite', image: 'turret_place.png', scale: 2});
		const towerBase = this.buildChild(tower, {name: tower.name + ' base', type: 'sprite', image: `tower_${lvl}_base_${angle}.png`});
		const towerMech = this.buildChild(tower, {name: tower.name + ' mech'});
		const towerGun = this.buildChild(towerMech, {name: tower.name + ' gun', type: 'sprite', image: `tower_${lvl}_gun_${angle}.png`});

		this.buildChild(towerMech, {name: tower.name + ' cannon', type: 'sprite', image: `tower_${lvl}_canon_${angle}.png`});
		const towerPoint = this.buildChild(towerPlace, {name: tower.name + ' shape', type: 'sprite', image: 'shape.png', scale: 1, alpha: 0});

		const towerBulletCon = this.buildChild(towerMech, {name: tower.name + ' dot'});

		tower.place = towerPlace;
		tower.gun = towerMech;
		tower.point = towerPoint;
		tower.ID = this.TOWER_ID;
		tower.lvl = lvl;
		tower.base = towerBase;
		tower.placeAngle = angle;
		tower.price = price;

		let tint = '0xFFFFFF';

		if(lvl === 1){

			tower.params.reload = App.timeOffset < 10 ? App.timeOffset * 20 : App.timeOffset * 6;

			tint = '0xd7d7d7';

			if (angle === 180){

				towerBase.position.set(-5, -35);
				towerMech.position.set(-10, -70);
				towerGun.position.set(100, 90);
				towerBulletCon.position.set(160, 140);
				towerBase.rotation = 0.1;
				tower.angle = 1;
				tower.bulletAngle = Math.PI / 6;

			}else if (angle === 90){

				towerBase.position.set(20, -40);
				towerMech.position.set(-10, -80);
				towerGun.position.set(-100, 70);
				towerBulletCon.position.set(-130, 120);
				towerBase.rotation = 0.1;
				tower.angle = -0.9;
				tower.bulletAngle = -Math.PI / 4;

			}else if (angle === 45){

				towerBase.position.set(20, -20);
				towerMech.position.set(-10, -60);
				towerGun.position.set(-110, -40);
				towerBulletCon.position.set(-180, -30);
				towerBase.rotation = 0.1;
				tower.angle = -1.8;
				tower.bulletAngle = 0;

			}else if (angle === 0){

				towerBase.position.set(25, 15);
				towerMech.position.set(0, 0);
				towerGun.position.set(-80, -90);
				towerBulletCon.position.set(-140, -120);
				towerBase.rotation = 0.1;
				tower.angle = -2.1;
				tower.bulletAngle = Math.PI / 5;

			}
			const pos = towerGun.position.clone();

			tower.anim = () => {

				return this.tween({
					to: [
						['x', angle === 90 ? pos.x + 5 : pos.x - 5, 200],
						['y', angle === 90 ? pos.y - 5 : pos.y - 5, 200]
					],
					next: ['position', [pos.x, pos.y], 500],
					loop: false
				}, towerGun);

			}
		}else if(lvl === 2){

			tower.params.reload = App.timeOffset < 10 ? App.timeOffset * 17 : App.timeOffset * 5;

			towerBase.scale.set(0.45, 0.45);
			towerMech.scale.set(0.45, 0.45);

			if (angle === 180){

				towerBase.position.set(-5, -20);
				towerMech.position.set(5, -50);
				towerGun.position.set(140, 110);
				towerBulletCon.position.set(280, 220);
				towerBase.rotation = 0.1;
				tower.angle = 0.9;
				tower.bulletAngle = Math.PI / 5;

			}else if (angle === 90){

				towerBase.position.set(20, -10);
				towerMech.position.set(10, -45);
				towerGun.position.set(-140, 140);
				towerBulletCon.position.set(-220, 240);
				towerBase.rotation = 0.1;
				tower.angle = -0.9;
				tower.bulletAngle = -Math.PI / 5;

			}else if (angle === 45){

				towerBase.position.set(0, 15);
				towerMech.position.set(-10, -30);
				towerGun.position.set(-140, -75);
				towerBulletCon.position.set(-300, -140);
				towerBase.rotation = 0.1;
				tower.angle = -2.1;
				tower.bulletAngle = Math.PI / 6;

			}else if (angle === 0){

				towerBase.position.set(0, 15);
				towerMech.position.set(-10, -30);
				towerGun.position.set(-140, -75);
				towerBulletCon.position.set(-300, -140);
				towerBase.rotation = 0.1;
				tower.angle = -2.1;
				tower.bulletAngle = Math.PI / 6;

			}

			const pos = towerGun.position.clone();

			tower.anim = () => {

				return this.tween({
					to: [
						['x', angle === 90 ? pos.x + 5 : pos.x - 5, 20],
						['y', angle === 90 ? pos.y - 5 : pos.y - 5, 20]
					],
					next: ['position', [pos.x, pos.y], 50],
					loop: 3
				}, towerGun);

			}
		}else if(lvl === 3){

			tower.params.reload = App.timeOffset < 10 ? App.timeOffset * 5 : App.timeOffset;

			towerBase.scale.set(0.5, 0.5);
			towerMech.scale.set(0.5, 0.5);

			towerMech.addChild(towerGun);
			towerMech.addChild(towerBulletCon);

			tint = '0xff9900';

			if (angle === 180){

				towerBase.position.set(20, 5);
				towerMech.position.set(-10, -60);
				towerGun.position.set(70, 20);
				towerBulletCon.position.set(300, 150);
				towerBase.rotation = 0.1;
				tower.angle = 1;
				tower.bulletAngle = -2.5;

			}else if (angle === 90){

				towerBase.position.set(-20, 10);
				towerMech.position.set(5, -50);
				towerGun.position.set(-15, 35);
				towerBulletCon.position.set(-200, 260);
				towerBase.rotation = 0.1;
				tower.angle = -0.9;
				tower.bulletAngle = -0.7;

			}else if (angle === 45){

				towerBase.position.set(25, 0);
				towerMech.position.set(20, -60);
				towerGun.position.set(-90, 50);
				towerBulletCon.position.set(-380, 40);
				towerBase.rotation = 0.1;
				tower.angle = -1.75;
				tower.bulletAngle = 0;

			}else if (angle === 0){

				towerBase.position.set(-5, -20);
				towerMech.position.set(20, -60);
				towerGun.position.set(-90, 0);
				towerBulletCon.position.set(-340, -180);
				towerBase.rotation = 0.1;
				tower.angle = -2.1;
				tower.bulletAngle = Math.PI / 6;

			}

			const pos = towerGun.position.clone();

			tower.anim = () => {

				return this.tween({
					to: [
						['x', angle === 90 ? pos.x + 5 : pos.x - 5, 20],
						['y', angle === 90 ? pos.y - 5 : pos.y - 5, 20]
					],
					next: ['position', [pos.x, pos.y], 50],
					loop: false
				}, towerGun);

			}
		}

		this.TOWER_ID ++;

		tower.reload = 0;

		tower.position.set(0, -200);

		towerBulletCon.rotation = tower.bulletAngle;

		// this.buildChild(towerBulletCon, {name: '', type: 'sprite', image: 'bullet.png', scale: 3, alpha: 1});

		tower.dot = towerBulletCon;

		const scale = towerBase.scale.x > 0.9 ? 3 : 2.2 / towerBase.scale.x;

		tower.muzzle = this.buildChild(towerBulletCon, {
			name: '', type: 'sprite', image: 'bullet_flame.png', scale: lvl === 2 && angle === 180 || lvl === 1 && angle === 180 ? scale : [-scale, scale], alpha: 0, anchor: [0.3, 0.6]
		});

		tower.anim();

		return tower;

	},
	towersAim(dt){

		if (!this['zombies'].children.length || this.state === 'tutorial') return;

		this.each(this['towers'].children, tower => {

			if (!tower.active) return;

			tower.reload -= dt;

			if (tower.reload > 0) return;

			tower.reload = tower.params.reload;

			for (let i = 0; i < 1; i++) {

				const target = this['zombies'].children[i];

				if (target && target.alive){

					// if (target.out || target.gun && target.gun !== tower.gun.name) continue;
					if (target.out) continue;

					const tPos = tower.toGlobal(new PIXI.Point());

					// const distance = Math.abs(this['zombies'].toLocal(tPos).y - target.y);
					//
					// if (distance > 300) continue

					const zPos = target.toGlobal(new PIXI.Point());
					target.gun = tower.gun.name;

					const gun = tower.gun;
					const angle = Math.atan2(zPos.x - tPos.x, zPos.y - tPos.y);

					gun.rotation = tower.angle - angle;
					this.zombieShoot(tower.lvl, tower.dot, target, tower.bulletAngle, tower.muzzle, tower.anim, tPos.y > zPos.y);

					break
				}
			}

		});

	},
	zombieShoot(bulletLvl, parent, target, rotation, blink, anim, fromBottom){

		let bulletSprite, bulletsCount = 1, bulletInterval = 100, type = 'bullet', damage = 1;

		// Первая башня (пулемет, стреляет очередями)

		if (bulletLvl === 2) {

			bulletsCount = 3;
			bulletSprite = {name: '', type: 'sprite', image: 'bullet.png', scale: 2.5};

			this.playSound('s_sarge_gun.mp3');

		// Третья башня (огнемет)

		}else if (bulletLvl === 1) {

			damage = 3;

			type = 'flame';

			bulletSprite = {name: '', type: 'sprite', image: 'bullet_3.png', scale: 2};

			this.playSound('s_flamethrower_fire.mp3');

		// Вторая башня (пулемет, стреляет автоматически)
		}else if (bulletLvl === 3) {

			damage = 3;

			bulletSprite = {name: '', type: 'sprite', image: 'bullet_2.png', scale: 3};

			this.playSound('s_turret_fire.mp3');

			bulletInterval = 50;

		}

		anim();

		for (let i = 0; i < bulletsCount; i++) {

			const bullet = this.buildChild(parent, bulletSprite);

			bullet.alpha = 0;

			const fade = this.fadeTo(bullet, 1, 1, i * bulletInterval);

			this.fadeTo(blink, 1, 200 / bulletInterval, i * bulletInterval, () => {
				this.fadeTo(blink, 0, 200 / bulletInterval);
			});

			const destroyBullet = () => {

				bullet.destroy();
				target.hp -= damage;

				this.zombieTakeDamage(target.hp);
				this.showZombieBlood(target, fromBottom);

				const coin = this.buildChild('coins', {name: '', type: 'sprite', image: 'coin.png', scale: 0.25});
				this.moveToSprite(coin, target);
				coin.alpha = 0;

				this.fadeTo(coin, 1, 0.5, 0, () => {

					this.moveToSprite(coin, 'top ui badge', 0.4, 0, () => {

						coin.destroy();

						this.POINTS += 5 * damage;

						this.setText('score', this.POINTS, true, true);

						if (this.state !== 'pause') this.checkCanBuyNewTower();

						if (!this['score'].ready) return;

						this['score'].ready = false;

						this.pulse('score', 2, 1, 0.5, 0, () => {
							this.scaleToDefault('score');
							this['score'].ready = true;
						});

					});
				});

				if (target.hp <= 0){

					if (!target.alive) return;

					target.alive = false;

					const zombieDie = this.buildChild('zombies die', {
						name: 'zombie_die',
						type: 'movie-clip',
						frameTemplate: 'boss-die-??.png',
						frameStart: 1,
						frameEnd: 52,
						loop: false,
						speed: 0.4,
						scale: 2
					});

					zombieDie.position.set(target.x, target.y);
					zombieDie.gotoAndPlay(0);

					zombieDie.onComplete = () => {

						const splat = this.buildChild('zombies die', {
							name: 'splat',
							type: 'sprite',
							image: 'splat.png',
							position: [zombieDie.x - 5, zombieDie.y + 30],
							scale: this.randomFloat(0.3, 0.5),
							rotation: this.randomFloat(-0.1, 0.1),
						});

						this.fadeTo(splat, 0, 0.5, 2000, () => splat.destroy());
						splat.parent.addChildAt(splat, 0);

						// zombieDie.destroy();

					};

					if (!App.Assets['s_zombie_fall.mp3'].sound.playing()) this.playSound('s_zombie_fall.mp3');

					target.parent.removeChild(target);

					if (this['zombies'].children.length === 0){

						if (this.state === 'cta') return;

						this.state = 'cta';

						this.moveToDefault('game con');

						this.moveBy('bottom ui', 0, 1000, 0.3);
						this.fadeTo('bottom ui', 0, 0.2);

						this.transferToCTA('win', 2000);

						this.playSound('s_cta_win.mp3');

						this.scaleTo('game con', 1.3, 0.1, 0, () => {
							this.scaleToDefault('game con', 0.1)
						});

					}
				}

			}

			if (!target || !target.alive) if (fade) fade.stop();

			this.moveToSprite(bullet, target, 1, i * bulletInterval, () => destroyBullet());
		}


	},
	showZombieBlood(zombie, fromBottom){

		const blood = this.buildChild('zombies die', {name: 'blood', type: 'sprite', image: 'hit.png', scale: 0, position: [zombie.x, zombie.y]});

		blood.parent.addChildAt(blood, 1);

		this.scaleTo(blood, 0.3, 1, 0, () => {
			this.fadeTo(blood, 0, 0.5, 0, () => {
				blood.destroy();
			});
		});

	},
	checkCanBuyNewTower(){

		for (let i = 1; i < 4; i++) {

			const con = this['ui tower ' + i + ' con'];

			if (!con.active){

				if (con.price <= this.POINTS) this.animateUITower(con);
				else this.hideUITower(con);

			}else{

				this.hideUITower(con);

			}

		}

	},
	animateUITower(con){

		con.canBuy = true;

		this.fadeTo('cells', 1, 0.5);

		const glow = con.children[0];
		const color = con.children[2];

		this.fadeTo(glow, 1);

		con.alphaTween = this.tween({
			to: ['alpha', 1, 400],
			next: ['alpha', 0.3, 400],
			loop: true
		}, glow);

		con.moveTween = this.chaoticMotion(con, 1, 3);
		this.fadeTo(color, 1, 1);

		if (!con.tutor) this.showTutorial(con, glow, color);

	},
	showTutorial(uiTower, glow, color){

		if (this['help con'].active || this.state === 'cta' || this.handTimeout) return;

		uiTower.tutor = true;
		this['help con'].active = true;

		const delay = 250;
		const alphaSpeed = 400;

		this.moveToSprite('help arrows', uiTower);

		this.fadeTo('help arrows', 1);

		this.each(this['help arrows con'].children, (arrow, i) => {

			arrow.visible = true;

			if (arrow.alphaTween) arrow.alphaTween.stop();

			arrow.alphaTween = this.tween({
				to: ['alpha', 1, alphaSpeed, delay * i],
				next: ['alpha', 0, alphaSpeed, delay * 5 - delay * i],
				loop: true
			}, arrow);

		});

		if (glow.alphaTween) glow.alphaTween.stop();

		glow.alphaTween = this.tween({
			to: ['alpha', 1, alphaSpeed],
			next: ['alpha', 0.5, alphaSpeed],
			loop: true
		}, glow);

		this.moveToSprite('help con', uiTower);

		const endHandPos = this['help con'].toLocal(this['help arrow 3'].toGlobal(new PIXI.Point()));
		const speedAnim = 1000;

		if (this['help hand'].tweenHandMove) this['help hand'].tweenHandMove.stop();

		this['help hand'].tweenHandMove = this.tween({
			set: [
				['alpha', 0],
				['rotation', -0.2],
				['position', [50, -50]],
			],
			to: [
				['alpha', 1, 100, 0, Linear.easeInOut],
				['rotation', 0, 400, 0, Power1.easeInOut],
			],
			next: {
				to: [
					['rotation', 0.4, speedAnim, 100, Power1.easeInOut],
					['position', [endHandPos.x, endHandPos.y], speedAnim, 100, Power1.easeInOut],
				],
				next: {
					to: [
						['alpha', 0, 100, 0, Linear.easeOut],
						['rotation', -0.4, 200, 0, Power1.easeIn],
						['position', [endHandPos.x + 40, endHandPos.y + 30], 200, 0, Power1.easeIn],
					],
					next: ['alpha', 0, 300, 0, Linear.easeOut],
				}
			},
			loop: true
		}, this['help hand']);

		this['help hand'].visible = true;

	},
	hideTutorHand(){

		this['help con'].active = false;
		this['help hand'].visible = false;

		this.each(this['help arrows con'].children, arrow => {

			if (arrow.alphaTween) arrow.alphaTween.stop();

			arrow.visible = false;
		});

	},
	hideUITower(con){

		con.canBuy = false;

		const glow = con.children[0];
		const color = con.children[2];

		if (con.alphaTween) con.alphaTween.stop();
		if (con.moveTween) con.moveTween.stop();

		this.fadeTo([glow, color], 0);

	},
	pauseGame(){

		this.state = 'pause';
		this.each(this['zombies'].children, zombie => zombie.children[0].stop());

	},
	unpauseGame(){

		this.state = 'game';
		this.each(this['zombies'].children, zombie => zombie.children[0].play());

	},
	changeScorePoints(points, target){

		this.POINTS -= points;
		this.setText('score', this.POINTS, true, true);

		const money = this.buildChild(target, {
			name: 'score assist',
			type: 'text',
			text: '-' + points,
			position: [0, 0],
			styles: {
				"fontFamily": "Arial-BoldMT",
				"fontStyle": "italic",
				"fontSize": 70,
				"fill": "0xffffff",
				"padding": 20
			}
		});

		money.alpha = 0;
		this.fadeTo(money, 1, 0.4);
		this.moveBy(money, 0, -200, 0.2, 0, () => money.destroy())

	},
	tutorialTimeout(timeout) {

		if (this.state !== 'intro') {

			clearTimeout(this.TutorialTimeout);
			this.TutorialTimeout = setTimeout(() => {

				if (Settings["tutorial"] && !App.Tutorial.showed && !App.CallToAction.showed) App.Tutorial.show();

			}, typeof timeout === "number" ? timeout : Settings["tutorial-timeout"]);

		}

	},

	hideTutorial() {

		clearTimeout(this.TutorialTimeout);

		if (App.Tutorial.showed) App.Tutorial.animateHide();

	},
	wallDamage(){

		const smoke = this['wall smoke damage'];
		smoke.scale.set(0, 0);
		smoke.tint = '0x7d7f7d';

		this.fadeTo(smoke, 1, 1, 0, () => this.fadeTo(smoke, 0, 1));
		this.scaleTo(smoke, this.random(60, 70) / 100, 2, 0, {ease: 'Linear.easeIn'});

		const emi = this.sphereBurstEmitter('wall emi damage', ['p_1.png','p_2.png','p_3.png','p_5.png','p_6.png'], {
			count: 20,
			limit: 50,
			lifetime: 500,
			targetDistance: [50, 10],
			endPositionOffset: [10, 10]
		});

		emi.position.set(this.random(-50, 50), this.random(-20, 20));

		const emi2 = this.sphereBurstEmitter('wall emi damage 2', ['p_2.png','p_3.png','p_4.png','p_5.png','p_6.png'], {
			count: 20,
			limit: 50,
			lifetime: 500,
			targetDistance: [50, 50],
			endPositionOffset: [10, 10]
		});

		emi2.position.set(this.random(-10, 90), this.random(-20, 20));

		const emi3 = this.sphereBurstEmitter('wall emi damage 2', ['p_2.png','p_3.png','p_4.png','p_5.png','p_6.png'], {
			count: 5,
			limit: 50,
			lifetime: 500,
			targetDistance: [-40, -40],
			endPositionOffset: [-10, -10]
		});

		emi3.position.set(this.random(-80, 10), -80);

		this.damageTimer = setTimeout(() => {

			this.damageTimer = null;

		}, 800);

	},
	wallDestroy(){

		this['wall gates'].alpha = 0;

		const smoke = this['wall smoke'];
		smoke.scale.set(0, 0);

		this.scaleTo(smoke, 1.1, 0.8, 0, {ease: 'Linear.easeIn'});
		this.fadeTo(smoke, 0, 0.2);

		const emi = this.sphereBurstEmitter('wall emi', ['p_1.png','p_2.png','p_3.png','p_4.png','p_5.png','p_6.png'], {
			count: 50,
			limit: 150,
			lifetime: 5000,
			targetDistance: [60, 40],
			endPositionOffset: [20, 20]
		});

	},
	bossBlood(dt){



	}

});
