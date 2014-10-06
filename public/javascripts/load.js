$(function(){
	var drawStart = false;
	var weatherStart = false;

	// Update copyright year
	$('#year').text(new Date().getFullYear());

	$('#drawapp').hover(
		function(){
			$('#app-pic').stop().animate({backgroundPosition: '0px -150px'});
			$('body').css("background-image", "url(/images/ps_background.png)");
		},
		function(){
			if (!drawStart){
				$('#app-pic').stop().animate({backgroundPosition: '0px 0px'});
				if (weatherStart)
					$('body').css("background-image", "url(/images/clouds.png)");
				else
					$('body').css("background-image", "url(/images/batthern.png)");
			}
		}
	);

	$('#weatherapp').hover(
		function(){
			if (!weatherStart){
				$('#app-pic').stop().animate({backgroundPosition: '0px 146px'});
				$('body').css("background-image", "url(/images/clouds.png)");
			}
		},
		function(){
			if (!weatherStart){
				$('#app-pic').stop().animate({backgroundPosition: '0px 0px'});
				$('body').css("background-image", "url(/images/batthern.png)");
			}
		}
	);

	$('#drawapp').click(function(event){
		drawStart = true;
		$('.left-container').slideUp('slow');
		$(".right-container").slideUp('slow');
		$('.weather-container').slideUp('slow');
		$('.more-apps').slideUp('slow');
		$('footer').fadeOut('slow', function(){
			$('#weatherapp').css("border-color", "black");
			$('<div id="numClients"></div>').prependTo('body');
			var backButton = $('<button id="back-btn" class="btn-primary btn-large">Go Back</button>').prependTo('body');
			backButton.click(function(){
				$(this).remove();
				$('canvas').remove();
				$('#numClients').remove();
				$('body').css('margin', '0 auto');
				$('.left-container').slideDown('slow');
				$(".right-container").slideDown('slow');
				$(".more-apps").slideDown('slow');
				$('footer').fadeIn('slow');
				drawStart = false;
				weatherStart = false;
			});
			backButton.hover(
				function(){ $('body').css("background-image", "url(/images/batthern.png)");},
				function(){ $('body').css("background-image", "url(/images/ps_background.png)");}
			);
			$('body').css('margin', '0');
			drawapp();
		});
	});

	$('#weatherapp').click(function(event){
		if (navigator.geolocation){
			if (!weatherStart){
				$('#weatherapp').css("border-color", "blue");
				weatherStart = true;
				$('.weather-container').slideDown('slow').prepend("<img src='/images/loading.gif' height=400></img>");
				getWeather();
			}else{
				$('.weather-container').slideUp('slow');
				$('.weather-container img').remove();
				$('#weatherapp').css("border-color", "black");
				weatherStart = false;
			}
		}else{
			alert("Your browser does not support Geolocation!");
		}
	});
});