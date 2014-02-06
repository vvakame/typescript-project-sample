///<reference path='libs/DefinitelyTyped/jquery/jquery.d.ts' />

module Main {

	$(function () {
		$("#alert").on("click", function () {
			$.getJSON("/api/sample", (json) => {
				alert(json.greeting);
			});
		});
	});
}
