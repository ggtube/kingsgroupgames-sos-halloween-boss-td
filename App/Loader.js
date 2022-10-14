(function update_loading_progress() {

	if (!MRAID.TrackedEvents['Loader Initialized']) return Broadcast.on('Loader Initialized', () => {

		update_loading_progress();

	}, "loader");

	//Здесь можно создать новые элементы для экрана загрузки

	function apply_styles() {

		//Здесь можно установить новые стили новым и старым элементам экрана загрузки, в том числе и зависящие от размеров экрана
		if (Settings['loading-overlay-styles']['display'] && Settings['loading-overlay-styles']['display'] === 'none') {

			if (!Loader.showed) return;

			if (Loader.HTML_LOADER) Loader.HTML_LOADER.remove();

			let container = document.createElement('div');
			container.className = 'html-loading';
			container.style.opacity = '1';
			container.style.background = '#000';
			container.style.width = '100%';
			container.style.height = '100%';
			container.style.textAlign = 'center';
			document.body.appendChild(container);

			let text = document.createElement('div');
			text.className = 'text';
			text.innerHTML = 'Loading...';
			text.style.position = 'absolute';
			container.appendChild(text);

			MRAID.extendStyles(text, Settings["loading-text-styles"]);

			Loader.HTML_LOADER = container;

		}
	}

	Broadcast.on("Mraid Resized", apply_styles, "loader");

	apply_styles();

})();

