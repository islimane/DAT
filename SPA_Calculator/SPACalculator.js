$(document).ready(function() {
	var displayContent = "";

	$("button").click(function() {
		var elemClass = $(this).attr('class');
		var elemContent = $(this).html();
		console.log(elemClass);
		console.log(elemContent);
		if(elemClass=="display"){
			displayContent += elemContent;
			$("input").val(displayContent);
		}else if(elemClass=="exec"){
			console.log("INSIDE EXEC");
			if(elemContent=="DEL"){
				displayContent = displayContent.substring(0, displayContent.length - 1);
				$("input").val(displayContent);
			}else if(elemContent=="C"){
				displayContent = "";
				$("input").val(displayContent);
			}
		}
	});
});
