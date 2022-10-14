App.Teaser = new Screen({

	Name: "Teaser",

	Containers: [

		{name: 'BackgroundContainer', scaleStrategy: ['cover-screen', 1920, 1080], childs: [
			{name: 'game con', scalePortrait: 0.8, scaleLandscape: 1.1, position: [-80, -50], positionLandscape: [0, 150], childs: [
				{name: 'background', type: 'sprite', image: 'background-teaser.jpg', event: 'screen', position: [50, 150], childs: [
					{name: 'wall broken', type: 'sprite', image: 'wall_4.png', position: [-255, -560], alpha: 0, childs: [
						{name: 'wall smoke', type: 'sprite', image: 'gate_smoke.png', position: [30, 30], blendMode: 3, alpha: 0},
						{name: 'wall emi'},
					]},
					{name: 'wall emi damage', position: [-240, -550]},
					{name: 'wall hp', position: [-260, -620], childs: [
						{name: 'wall bg', type: 'sprite', image: 'hp_bar_bg.png'},
						{name: 'hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
						{name: 'hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
					]},
				]},
				{name: 'towers', position: [0, 150]},
				{name: 'watchtower 2 hp', position: [-70, -300], childs: [
					{name: 'watchtower 2 bg', type: 'sprite', image: 'hp_bar_bg.png'},
					{name: 'watchtower 2 hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
					{name: 'watchtower 2 hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
				]},
				{name: 'zombie spawn', position: [-400, 600], childs: [ // mask: 'zombie mask',
					{name: 'zombies die'},
					{name: 'zombies'},
					{name: 'wall emi damage 2', position: [240, -1050]},
				]},
				{name: 'watchtower 1 hp', position: [510, -290], childs: [
					{name: 'watchtower 1 bg', type: 'sprite', image: 'hp_bar_bg.png'},
					{name: 'watchtower 1 hp bar red', type: 'sprite', image: 'hp_bar_red.png', anchor: [0, 0.5], position: [-75, 0]},
					{name: 'watchtower 1 hp bar', type: 'sprite', image: 'hp_bar.png', anchor: [0, 0.5], position: [-75, 0]},
				]},
				{name: 'coins'}
			]},
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
		{name: 'BottomUI', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], position: ['width/2', 'height'], childs: [
			{name: 'bottom ui', positionPortrait: [0, -180], positionLandscape: [-540, -170], childs: [
				{name: 'help arrows', rotation: -0.2, childs: [
					{name: 'help arrows con', position: [20, -210], childs: [
						{name: 'help arrow 1', type: 'sprite', image: 'arrow_1.png', position: [-200, 0]},
						{name: 'help arrow 2', type: 'sprite', image: 'arrow_2.png', position: [-170, -50]},
						{name: 'help arrow 3', type: 'sprite', image: 'arrow_3.png', position: [-140, -100]},
						// {name: 'help arrow 4', type: 'sprite', image: 'arrow_3.png', position: [-110, -150]},
						// {name: 'help arrow 5', type: 'sprite', image: 'arrow_3.png', position: [-80, -200]},
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
		{name: 'DebugContainer', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], childs: [
			{name: 'debug background', type: 'graphics', draw: [['beginFill', 0x000000], ['drawRect', [-2000, -2000, 4000, 4000]]], alpha: 0.5},
		]}
	],

	Events: {

		// Стандартное событие срабатывающее перед созданием спрайтов из секции Containers
		// Здесь можно что-то динамически изменить в Containers если нужно перед их созданием
		'Teaser before build': function() {

			this.POINTS = 250;

		},

		// Стандартное событие срабатывающее сразу после создания спрайтов из секции Containers
		'Teaser build': function() {

			this['debug background'].visible = Settings["debug"];
			this['wall broken'].visible = false;

			this.each(this['help arrows'].children, c => { if (c) c.alpha = 0});

			this.setText('score', this.POINTS, true, true);

			// this.buildTower(3, 180);

			for (let i = 1; i < 4; i++) {

				this['ui tower ' + i + ' glow'].alpha = 0;
				this['ui tower ' + i + ' color'].alpha = 0;
				this['ui tower ' + i + ' con'].alpha = 0;
				this['ui tower ' + i + ' con'].visible = false;

			}

			this['help hand'].alpha = 0;

			this['score'].ready = true;

		},

		// Стандартное событие срабатывающее на изменение размеров или ориентации экрана
		'Teaser resize': function() {

		},

		// Стандартное событие срабатывающее во время показа экрана (есть ещё и hided - срабатывает во время скрытия экрана)
		'Teaser showed': function() {

			this.updateSettings();

			this.startGame();

			this['BackgroundContainer'].alpha = 0;

			this.tween(['alpha', 1, 1000], ['BackgroundContainer']);

			this.scaleTo('game con', App.IsLandscape ? 1.1 : 0.8, 0.1);

		},

		'Stage Press Down': function(s, e) {

			if (this.state === 'ready') Broadcast.call('CallToAction cta click', [], this);

		},
		'Teaser screen click': function(container, e) {


		},

		'Teaser resumed': function() {



		},

		'Teaser paused': function() {



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

		// this['zombies'].children.forEach(zombie => zombie.stop());
		this.state = 'ready';

		this.fadeTo(['ui tower 1 color'], 1, 0.5);

		const delay = 250;
		const alphaSpeed = 400;

		this.each(this['help arrows'].children, (arrow, i) => {

			if (arrow.alphaTween) arrow.alphaTween.stop();

			arrow.alphaTween = this.tween({
				to: ['alpha', 1, alphaSpeed, delay * i],
				next: ['alpha', 0, alphaSpeed, delay * 5 - delay * i],
				loop: true
			}, arrow);

		});

		if (this['ui tower 1 glow'].alphaTween) this['ui tower 1 glow'].alphaTween.stop();

		this['ui tower 1 glow'].alphaTween = this.tween({
			to: ['alpha', 1, alphaSpeed],
			next: ['alpha', 0.5, alphaSpeed],
			loop: true
		}, 'ui tower 1 glow');

		this.moveToSprite('help con', 'ui tower 1 con');

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

		this['ui tower 1 con'].canBuy = true;
		this.BOSS.stop();

	},
	hideHand(){

		this.each(this['help arrows'].children, arrow => {

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

	},

	startGame() {

		App.Gameplay.pauseGame();

		this.startZombiesSpawner();

		setTimeout(() => {

			for (let i = 1; i < 4; i++) {

				this.moveBy('ui tower ' + i + ' con', 0, 500);
				this.moveToDefault('ui tower ' + i + ' con', 0.2, i * 150, ()=> {

					if (i === 3) setTimeout(() => this.showIntroHand(), 1000);

				});
				this.fadeTo('ui tower ' + i + ' con', 1, 0.5, i * 150);

			}

		}, 1500);

	},

	startZombiesSpawner(){

		this.zombiesSpawner();

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

		zombie.position.set(440, 0);
		zombieRun.gotoAndPlay(0);
		zombie.alive = true;

		zombie.speed = 0.65;
		zombie.delta = 800;
		// zombie.hp = this.ZOMBIE_HP + parseInt(this.ZOMBIE_COUNTER / 20);
		zombie.hp = this.ZOMBIE_HP;

		const zombieHpCon = this.buildChild(zombie, {
			name: 'zombie hp',
			scale: 0.4,
			position: [0, -40]
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

		this.moveTo(zombie, 750, -400, 0.08, 0, {ease: 'Linear.easeInOut'});

		this.BOSS = zombieRun;

		// if (!App.Assets['s_zombie_fright.mp3'].sound.playing()) this.playSound('s_zombie_fright.mp3');

	},
	changeZombie(zombie, anim, frame = 27, loop = true, speed = 0.5){

		zombie.removeChildren();

		return this.buildChild(zombie, {
			name: 'zombie att',
			type: 'movie-clip',
			frameTemplate: anim + '_??.png',
			frameStart: 1,
			frameEnd: frame,
			loop: loop,
			speed: speed,
			scale: 1
		});

	},

	animateUITower(con){

		con.canBuy = true;

		const glow = con.children[0];
		const color = con.children[2];

		this.fadeTo(glow, 1);

		con.alphaTween = this.tween({
			to: ['alpha', 1, 400],
			next: ['alpha', 0.3, 400],
			loop: true
		}, glow);

		con.moveTween = this.chaoticMotion(con, 1, 2);
		this.fadeTo(color, 1, 0.5);

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

	}

});