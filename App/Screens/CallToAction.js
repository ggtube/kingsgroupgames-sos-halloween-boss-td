App.CallToAction = new Screen({

	Name: "CallToAction",

	Containers: [
		{name: 'BackgroundContainer', scaleStrategy: ['cover-screen', 1920, 1080], childs: [
				{name: 'background', type: 'sprite', image: 'cta_background_1.jpg', event: {name: 'bg', move: true}, positionLandscape: [0, 0], positionPortrait: [0, 0]}
		]},
		{name: 'TopLogo', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], positionLandscape: ['width', 0], positionPortrait: ['width/2', 0], childs: [
			{name: 'logo con', childs:[
				{name: 'logo', type: 'sprite', image: 'logo.png', positionLandscape: [-330, 150], positionPortrait: [0, 150]}
			]}
		]},
		{name: 'BottomCon', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], position: ['width/2', 'height'], childs: [
			{name: 'arrow', type: 'sprite', image: 'cta_arrow.png', position: [0, -150]},
			{name: 'help message', type: 'text', text: 'CTA_MESSAGE', position: [0, -70]},
		]}
	],

	Events: {

		'CallToAction before build': function() {

			this.updateChildParamsByName(Settings[this.Name]);

		},

		'CallToAction build': function() {

			this['logo con'].alpha = 0;
			this['arrow'].alpha = 0;

		},

		'CallToAction showed': function() {

			if (Settings['enable-teaser']){

				App.Gameplay.hide();
				App.Teaser.show();

				this.stopAllTweens();
				this.hide();

				setTimeout(() => App.Teaser.state = 'ready', 500);

				return;

			}
			this.bringToTop();
			this.animateShow();

		},
		'CallToAction bg down': function(c, e) {

			if (this.state === 'hide') return;

			if (!Settings['enable-teaser']){

				Broadcast.call('CallToAction cta click', [], this);
				return;

			}

			this.down = true;
			this.downPoint = e.data.global.clone();


		},
		'CallToAction bg move': function(c, e) {

			if (this.state === 'hide' || !this.down) return;

			const point = e.data.global;
			const distance = this.downPoint.y - point.y;

			if (Math.abs(distance) > 10){

				this.state = 'hide';
				this.hideCta(distance);

			}

		},
		'Stage Press Up': function(s, e) {

			this.down = false;

		},
		'CallToAction resize': function() {


		},

		'CallToAction try again click': function() {

			App.CallToAction.hide();

			App.Gameplay.restore();

		},

		'CallToAction resumed': function() {



		},

		'CallToAction paused': function() {



		}

	},
	animateShow(){

		const els = ['background', 'logo con', 'arrow', 'help message'];

		this.moveBy(['background', 'help message'], 0, 2000);
		this.scaleTo('logo con', 0);

		this.moveToDefault('background', 0.2, 0, {ease: 'None'}, () => {

			App.Gameplay.pauseGame();

			this.scaleToDefault('logo con', 0.6);
			this.fadeTo(['logo con', 'arrow'], 1, 0.3);

			this.moveToDefault('help message', 0.5);

			this.startBackgroundAnimation();

		});

		const arrow = this['arrow'];

		this.tween({
			to: ['y', -180, 800],
			next: ['y', -150, 400],
			loop: true
		}, arrow);

		this.pulsation('help message', 1.01);
	},
	hideCta(distance){

		const els = ['background', 'logo con', 'arrow', 'help message'];

		this.moveBy(els, 0, distance > 0 ? -2000 : 2000, 0.2, 0, () => {

			App.Teaser.state = 'ready';

			this.stopAllTweens();
			this.hide();

		});

		App.Teaser.show();
		App.Gameplay.hide();

	},
	startBackgroundAnimation(){

		const bg = this['background'];

		this.tween({
			to: [
				['scale', 1.05, 4000, 0, Linear.easeInOut],
				['rotation', () => this.randomFloat(-0.02, 0.02), 4000, 0, Linear.easeInOut]
			],
			next: [
				['scale', 1, 4000, 0, Linear.easeInOut],
				['rotation', 0, 4000, 0, Linear.easeInOut]
			],
			loop: true
		}, bg);

	}

});