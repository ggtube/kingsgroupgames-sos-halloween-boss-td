<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="UTF-8">
    </head>
    <body>
		<script>
			Settings = <%= options.settingsString %>;
		</script>
		<script>(function() {var s = document.createElement('script'); s.setAttribute('src', Settings['assets-path']['default'] + Settings['game-loader-url']['default'] + "?v=" + Settings["version"]); document.getElementsByTagName('head')[0].appendChild(s);})();</script>
    </body>
</html>