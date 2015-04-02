<div class="content">
	<h2>Level <?= $_GET["levelNr"] ?></h2>
	<h3>Get ready!</h3>
	<ul>
		<li>
			<a href="#<?= $_GET["levelNr"] ?>" onclick="pazuru.loadGame(<?= $_GET["levelNr"] ?>)">Start</a>
		</li>
	</ul>
</div>
