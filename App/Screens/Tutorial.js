App.Tutorial = new Screen({

	Name: "Tutorial",

	Containers: [
		{name: 'TutorialContainer', scaleStrategyLandscape: ['fit-to-screen', 1920, 1080], scaleStrategyPortrait: ['fit-to-screen', 1080, 1920], childs: [

		]}
	],

	Events: {

		'Tutorial before build': function() {

			this.updateChildParamsByName(Settings[this.Name]);

		},

		'Tutorial build': function() {

		},

		'Tutorial showed': function() {

			this.bringToTop();

			this.showCharacter();

			MRAID.track("Tutorial Showed", [], false);

			App.Gameplay.showIntroHand();

		},

		'Tutorial resize': function() {

		},

		'Tutorial play click': function() {

			this.hideCharacter();

		},

		'Tutorial resumed': function() {



		},

		'Tutorial paused': function() {



		}

	},

	showCharacter() {

		this.tween(['alpha', 1, 200], ['TutorialContainer']);

		//Анимированно показываем тут элементы туториала

	},

	hideCharacter() {

		//Анимированно прячем тут элементы туториала

	},

	animateHide() {

		this.hideCharacter();

		this.tween(['alpha', 0, 200], ['TutorialContainer'], () => {

			this.hide();

		});

		App.Gameplay.hideHand();

	}

});