//-----------------------------------------------------------------------------
// Filename : Screen.VideoAd.js
//-----------------------------------------------------------------------------
// Language : Javascript
// Date of creation : 01.04.2017
// Require: Class.js
//-----------------------------------------------------------------------------
// Set of localization and text manipulation methods
//-----------------------------------------------------------------------------

Class.Mixin(Screen, {

	initialize: function() {

		//Make canvas transparency
		App.ClearBeforeRender = true;
		App.StageBackgroundColor = false;

	},

	buildVideoAd() {

		Broadcast.on(this.Name + ' update', function() {

			this.updateVideoAd();

		}, this, {index: this.Name + '-VideoAd'});

		Broadcast.on(this.Name + ' video down', function(sprite, e) {

			this.onVideoAdDown(e);

		}, this, {index: this.Name + '-VideoAd'});

		Broadcast.on(this.Name + ' video move', function(sprite, e) {

			this.onVideoAdMove(e);

		}, this, {index: this.Name + '-VideoAd'});

		Broadcast.on(this.Name + ' video up', function(sprite, e) {

			this.onVideoAdUp(e);

		}, this, {index: this.Name + '-VideoAd'});

		if (Settings["video-ad-config"]["unmute-on-fist-interaction"] && this.videoAdMuted) {

			Broadcast.on('Interaction', function () {

				Broadcast.off('Interaction', this.Name + '-VideoAd');

				if (this.videoAdMuted) this.updateVideoAdMute(false);

			}, this, {index: this.Name + '-VideoAd'});

		}

		this.videoAdMuted = true;

		this.videoAdSteps = Settings["video-ad-config"]["steps"];

		const container = this.buildChild(App.Stage, {name: 'VideoAdEventContainer', type: 'container', scaleStrategy: ['fit-to-screen', 720, 1086], position: ['width/2', 'height/2'], scale: 'scale'});

		this._containers.splice(0, 0, container);

		App.Stage.addChildAt(container, 0);

		this.buildChild(container, {type: "graphics", draw: [["beginFill", 0x000000], ["drawRect", [-1000, -1000, 2000, 2000]]], scale: 3, alpha: 0, event: {move: true, name: 'video'}});

		if (!this.buildDOMContainer) throw new Error("Screen.Dom.js not found. You must include Screen.Dom.js to use Screen.VideoAd.js");

		this.buildDOMContainer({name: 'VideoAdContainer', type: 'dom-container', scaleStrategy: ['fit-to-screen', 720, 1086], styles: {zIndex: '-1'}, childs: [
			['div', 'videos-holder', {
				scale: {width: 720, height: 1086}
			}]
		]});

		this.foreachSteps((step_params) => {

			const video_name = step_params.video;

			if (video_name) {

				if (!App.Assets[step_params.video]) throw new Error("The re are no video asset with name '" + video_name + "'");

				if (!step_params.videoEl) step_params.videoEl = App.Assets[step_params.video].video;

				if (!step_params.videoEl._videoAdProcessed) {

					step_params.videoEl._videoAdProcessed = true;

					step_params.videoEl.style.opacity = 0;
					step_params.videoEl.style.transition = 'opacity 500ms';

					step_params.videoEl.addEventListener('ended', () => {

						const step_params = this.videoAdSteps[this.videoAdStepId];

						if (!step_params) return;

						if (step_params.video === video_name) {

							if (!step_params.to) this.nextVideoAdStep();

						}

					});

					step_params.videoEl.params = {
						styles: {width: '100%'}
					};

					this["VideoAdContainer"].els["videos-holder"].appendChild(step_params.videoEl);

				}

			}

			if (Settings["debug"] && step_params.action) {

				if (step_params.action.swipe) {

					_.each(step_params.action.swipe, (coords) => {

						this.buildChild(this[step_params.action.name], {type: 'graphics', position: [coords[0], coords[1]], draw: [["beginFill", 0xff00ff], ["drawCircle", [0, 0, coords[2]]]], alpha: 0.5});

					});

				} else if (step_params.action.click) {

					_.each(step_params.action.click, (coords) => {

						this.buildChild(this[step_params.action.name], {type: 'graphics', position: [coords[0], coords[1]], draw: [["beginFill", 0xff00ff], ["drawCircle", [0, 0, coords[2]]]], alpha: 0.5});

					});

				}

			}

		});

	},

	startVideoAd() {

		MRAID.isAutoplaySupported((result) => {

			MRAID.log('isAutoplaySupported', result);

			this.updateVideoAdMute(result === 'muted');

			this.videoAdStepId = Settings["video-ad-config"]["start-step"];

			this.processVideoAdStep(this.videoAdStepId);

		});

	},

	updateVideoAd() {

		if (!this.videoAdSteps) console.log(this, this.videoAdSteps, this.videoAdStepId);

		const active_step_params = this.videoAdSteps[this.videoAdStepId];

		if (!active_step_params) return;

		MRAID.log('video updatetime', this.videoAdStepId, active_step_params.from, active_step_params.to, active_step_params.videoEl.currentTime);

		if (active_step_params.from) {

			if (active_step_params.videoEl.currentTime < active_step_params.from) {

				MRAID.log('return to front', active_step_params.from, active_step_params.videoEl.currentTime);

				active_step_params.videoEl.currentTime = active_step_params.from;
				active_step_params.videoEl.play();

			}

		}

		if (active_step_params.to) {

			if (active_step_params.videoEl.currentTime > active_step_params.to) {

				MRAID.log('video play step end');

				if (active_step_params.loop) {

					MRAID.log('video play step end >> loop');

					if (active_step_params.from) active_step_params.videoEl.currentTime = active_step_params.from;

				} else {

					MRAID.log('video pause');

					active_step_params.videoEl.pause();

					this.nextVideoAdStep();

				}

			}

		}

	},

	processVideoAdStep(step_id) {

		const active_step_params = this.videoAdSteps[step_id];

		MRAID.log('processVideoAdStep', step_id);

		this.foreachSteps((step_params, step_params_id) => {

			step_params.active = (step_id === step_params_id);

			if (step_params.video) {

				if (step_params.active && step_params.videoEl.style.opacity !== 1) step_params.videoEl.style.opacity = 1;

				else if (!step_params.active && step_params.videoEl.style.opacity !== 0 && step_params.videoEl !== active_step_params.videoEl) videoEl.style.opacity = 0;

			}

			if (step_params.action) {

				if (step_params.active && this[step_params.action.name].alpha !== 1) this.tween(['alpha', 1, 500], step_params.action.name);

				else if (!step_params.active && this[step_params.action.name].alpha !== 0) this.tween(['alpha', 0, 500], step_params.action.name);

			}

		});


		if (active_step_params.from) active_step_params.videoEl.currentTime = active_step_params.from;

		active_step_params.videoEl.muted = this.videoAdMuted;

		active_step_params.videoEl.play();

		MRAID.log('video play', active_step_params.videoEl.currentTime);

		this.processVideoAdStepAction(active_step_params);

		if (active_step_params.cta) this.transferToCTA('win');

		MRAID.track("Step " + step_id);

	},

	nextVideoAdStep() {

		if (this.videoAdSteps[this.videoAdStepId + 1]) {

			this.videoAdStepId++;

			this.processVideoAdStep(this.videoAdStepId);

		} else {

			this.transferToCTA('win');

		}

	},

	processVideoAdStepAction(step_params) {

		if (step_params.action) Broadcast.call(this.Name + ' video ad ' + step_params.action.name + ' update', [step_params]);

	},

	onVideoAdDown(e) {

		const coords = e.data.getLocalPosition(this["VideoAdEventContainer"]);

		MRAID.markMeaningfulInteraction();

		const step_params = this.videoAdSteps[this.videoAdStepId];

		if (!step_params) return;

		if (step_params.action && step_params.action.swipe) {

			const first_point = step_params.action.swipe[0];

			const distance = this.getDistance(coords, {x: first_point[0], y: first_point[1]});

			if (distance < first_point[2]) {

				step_params.swipePoint = 1;

				if (step_params.action["pauseVideoDuringSwipe"]) {

					MRAID.log('video pause during swipe');

					step_params.videoEl.pause();

				}

				this.processVideoAdStepAction(step_params);

			}

		} else if (step_params.action && step_params.action.click) {

			const first_point = step_params.action.click[0];

			const distance = this.getDistance(coords, {x: first_point[0], y: first_point[1]});

			if (distance < first_point[2]) {

				step_params.clickPoint = 1;

				if (step_params.action.click.length <= step_params.clickPoint) {

					step_params.clickPoint = null;

					this.nextVideoAdStep();

				}

			}

		}

	},

	onVideoAdMove(e) {

		const coords = e.data.getLocalPosition(this["VideoAdEventContainer"]);

		const step_params = this.videoAdSteps[this.videoAdStepId];

		if (!step_params) return;

		if (step_params.action && step_params.swipePoint) {

			const next_point = step_params.action.swipe[step_params.swipePoint];

			const distance = this.getDistance(coords, {x: next_point[0], y: next_point[1]});

			if (distance < next_point[2]) {

				step_params.swipePoint++;

				if (step_params.action.swipe.length <= step_params.swipePoint) {

					step_params.swipePoint = null;

					this.nextVideoAdStep();

				}

			}

		}

	},

	onVideoAdUp() {

		const step_params = this.videoAdSteps[this.videoAdStepId];

		if (step_params.action && step_params.action.swipe) {

			step_params.swipePoint = null;

			if (step_params.action["pauseVideoDuringSwipe"]) {

				MRAID.log('play video after swipe');

				step_params.videoEl.play();
			}

			this.processVideoAdStepAction(step_params);

		}

	},

	updateVideoAdMute(muted) {

		this.videoAdMuted = muted;

		this.foreachSteps((step_params) => {

			if (step_params.videoEl) step_params.videoEl.muted = muted;

		});

		if (muted) App.resources["background music"].sound.pause();

		else App.resources["background music"].sound.loop(true).play();

		Broadcast.call(this.Name + ' mute changed', [muted]);

	},

	foreachSteps(fn) {

		_.each(this.videoAdSteps, (step_params, step_id) => {

			fn.call(this, step_params, step_id, this.videoAdSteps);

		});

	}

});