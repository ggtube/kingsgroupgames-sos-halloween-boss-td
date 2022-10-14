<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="UTF-8">
		<% if (options.injectMraidJs) { %>
		<script src="mraid.js"></script>
		<% } %>
    </head>
    <body>
		<% if (options.settingsString) { %>
		<script>
			Settings = <%= options.settingsString %>;
		</script>
		<script>(function() {var s = document.createElement('script'); s.setAttribute('src', Settings['assets-path']['default'] + Settings['game-loader-url'] + "?v=" + Settings["version"]); document.getElementsByTagName('head')[0].appendChild(s);})();</script>
		<% } else if (options.loaderScript) { %>
		<script>
			var settings_assets_path = '${settings["assets-path"]["default"]}';
		</script>
		<script>(function() {var s = document.createElement('script'); s.setAttribute('src', settings_assets_path + "${options.loaderScript}" + "?v=" + Date.now()); document.getElementsByTagName('head')[0].appendChild(s);})();</script>
		<% } %>
    </body>
</html>