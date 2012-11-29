///<reference path='libs/jquery.d.ts' />

module Main {

	$(function(){
		$("#alert").on("click", function(){
            $.getJSON("/api/sample", (json) => {
                alert(json.greeting);
            });
		});
	});
}

