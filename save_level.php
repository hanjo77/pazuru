<?php

$dir = 'js/levels';
$files = scandir($dir);
$max_index = 0;

for ($i = 0; $i < sizeof($files); $i++) {

	$file = $files[$i];
	$index = str_replace("level", "", $file);
	$index = str_replace(".json", "", $index);
	$index = intval($index, 10);
	if ($index > $max_index) {

		$max_index = $index;
	}
}

if ($_REQUEST["data"]) {

	echo $dir."/level".($max_index+1).".json";
	$myfile = fopen($dir."/level".($max_index+1).".json", "w") or die("Unable to open file!");
	$txt = $_REQUEST["data"];
	fwrite($myfile, $txt);
	fclose($myfile);
}

?>