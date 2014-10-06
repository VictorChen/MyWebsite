function getWeather(){
	navigator.geolocation.getCurrentPosition(function(position){
		function kelvinToFar(degree){
			return ((9/5)*(degree-273)+32).toFixed(2);
		}

		function getDay(number){
			switch(number){
				case 0: return "Sunday";
				case 1: return "Monday";
				case 2: return "Tuesday";
				case 3: return "Wednesday";
				case 4: return "Thursday";
				case 5: return "Friday";
				case 6: return "Saturday"
				default: return "Error";
			}
		}

		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		var days = 7;
		var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat='+lat+'&lon='+lon+'&cnt='+days+'&mode=json&callback=?';
		
		var req = $.ajax({
			url : url,
			dataType : "jsonp",
			timeout : 10000
		});

		req.success(function(data) {
			$('.weather-container img').remove();
			$('#weather-title h2').text("7 days weather forecast for: " + data.city.name + ", " + data.city.country);
			var weatherDays = [];
			$.each($(".weather-day"), function(key, value) {
				weatherDays.push($(this));
			});

			var date = new Date();
			for (var i=0; i<weatherDays.length; i++){
				var icon = data.list[i].weather[0].icon;
				if (icon == "10")	// bug with the OpenWeatherMap's api
					icon += "d";
				$(weatherDays[i].children()[0]).text((date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear());
				$(weatherDays[i].children()[1]).text(getDay(date.getDay()));
				$(weatherDays[i].children()[2]).append("<img src='http://openweathermap.org/img/w/"+icon+".png'></img>");
				$(weatherDays[i].children()[3]).text(data.list[i].weather[0].description);
				$(weatherDays[i].children()[4]).text("Max: " + kelvinToFar(data.list[i].temp.max) + "°F");
				$(weatherDays[i].children()[5]).text("Min: " + kelvinToFar(data.list[i].temp.min) + "°F");
				$(weatherDays[i].children()[6]).text("Humidity: " + data.list[i].humidity + "%");
				$(weatherDays[i].children()[7]).text("Wind Speed: " + data.list[i].speed + " mps");
				$(weatherDays[i].children()[8]).text("Atmospheric Pressure: " + data.list[i].pressure + " hPa");
				date.setDate(date.getDate() + 1);
			}
		});

		// Resend on error
		req.error(function(){
			getWeather();
		});
	});
}