<h2>Level <?= $_GET["levelNr"] ?> finished</h2>
<ul>
	<li>
		<a onclick="pazuru.loadGame(<?= $_GET["levelNr"] ?>)">Replay</a>
	</li>
	<li>
		<a onclick="pazuru.startLevel(<?= intval($_GET["levelNr"], 10)+1 ?>)">Continue</a>
	</li>
</ul>
