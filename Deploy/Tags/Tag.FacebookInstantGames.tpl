<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width, user-scalable=no, minimal-ui">
	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="full-screen" content="yes"/>
	<meta name="screen-orientation" content="portrait"/>
	<script src="https://connect.facebook.net/en_US/fbinstant.6.2.js"></script>
    </head>
    <body>
		<script>
			Settings = <%= options.settingsString %>;
		</script>
		<script>

			FBInstant.initializeAsync().then(function() {

				var s = document.createElement('script');

				s.setAttribute('src', Settings['assets-path']['default'] + Settings['game-loader-url']['default'] + "?v=" + Settings["version"]);

				document.getElementsByTagName('head')[0].appendChild(s);

			});

		</script>
    </body>
</html>