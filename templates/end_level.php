<div class="content">
	<h2>Level <?= $_GET["levelNr"] ?> finished</h2>
	<ul>
		<li>
			<a href="#<?= $_GET["levelNr"] ?>">Replay</a>
		</li>
		<li>
			<a href="#<?= intval($_GET["levelNr"], 10)+1 ?>">Continue</a>
		</li>
	</ul>
</div>