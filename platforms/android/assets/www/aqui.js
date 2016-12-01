var manager = {
	getCity: function(_city){
		manager.city = _city + ",BR";
	},

	// A função abaixo é quase igual àquela do exemplo do Renato,
	// possui algumas alterações para poder utilizar a mesma para a
	// previsão atual e para os cinco dias.

	callAjax: function(type){ //Recebe como parametro o tipo de previsão
		$.ajax({
			method: "GET",
			url: "http://api.openweathermap.org/data/2.5/" + type, //o tipo de previsão é usado para concatenar na URL, já que de um tipo para outro, só muda uma palavra na URL.
			data: { //Aqui serão passados os dados para realizar a requisição.
				q: manager.city, //o nome da cidade já deve ter sido pego.
				lang: "pt",
				units: "metric",
				APPID: "d78899b1b63b179985a1457bd147f13d",
			},
			dataType: "json",
			success: function(response) { //Caso ocorra sucesso na requisição.
				if (type == "weather"){
                    builder.getDataWeather(response); //Construirá o HTML para a previsão atual.
                }else{
                    builder.getDataForecast(response); //Construirá o HTML para a previsão dos cinco dias.
                }
			},
			failure: function(response) { //Caso algum erro venha a ocorrer (OBS: por algum motivo nunca vi esse método executar).
				alert(666);
			}
		});
	}
}

var builder = {
	getDataForecast: function(data){
		$(".big-weather-set").html("");
		// $(".big-weather-set").css("display", "block");
		console.log(data);
		// Main
		var i;
		var last_date = "";
		for (i of data.list){
			var date = i.dt_txt.slice(0,10).split("-").reverse().join("/");
			var hour = i.dt_txt.slice(10);
			var mid = i.main.temp + "°C";
			var max = i.main.temp_max + "°C";
			var min = i.main.temp_min + "°C";
			var icon = "http://openweathermap.org/img/w/" + i.weather[0].icon + ".png";
			var desc = i.weather[0].description;

			if (date != last_date){
				last_date = date;
				$(".big-weather-set").append(
				'<div class="weather-set" id="weather-set-' + date.slice(0,2) + '">\
					<h1 class="date" id="date">' + date + '</h1>\
					<div class="details" id="details">\
						<h2 class="hour" id="hour">' + hour + '</h2>\
						<img class="img-icon" src=' + icon + '><br>\
						<div class="mid" id="mid">' + mid + '</div><br>\
						<div class="max" id="max">' + max + '</div><br>\
						<div class="min" id="min">' + min + '</div>\
					</div>\
				</div>'
				);
			}else{
				$("#weather-set-" + date.slice(0,2)).append(
			    '<div class="details" id="details">\
					<div class="left">\
						<h2 class="hour" id="hour">' + hour + '</h2>\
						<img class="img-icon" src=' + icon + '><br>\
						<div class="mid" id="mid">' + mid + '</div><br>\
						<div class="max" id="max">' + max + '</div><br>\
						<div class="min" id="min">' + min + '</div>\
					</div>\
					<div class="right">\
				</div>');
			}
		}
	},

    getDataWeather: function(data){
		$(".big-weather-set").html("");
		// $(".big-weather-set").css("display", "block");
		console.log(data);
		// Main

		var _date = new Date();
		var date = _date.getDate() + "/" + _date.getMonth()+1 + "/" + _date.getFullYear();
		var hour = _date.getHours() + ":" + _date.getMinutes() + ":" + _date.getSeconds();
		var mid = data.main.temp + "°C";
		var max = data.main.temp_max + "°C";
		var min = data.main.temp_min + "°C";
		var icon = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
		var desc = data.weather[0].description;


		$(".big-weather-set").append(
		'<div class="weather-set">\
			<h1 class="date" id="date">' + date + '</h1>\
			<div class="details" id="details-">\
				<div class="left">\
					<h2 class="hour" id="hour">' + hour + '</h2>\
					<img class="img-icon" src=' + icon + '><br>\
					<div class="mid" id="mid">' + mid + '</div><br>\
					<div class="max" id="max">' + max + '</div><br>\
					<div class="min" id="min">' + min + '</div>\
				</div>\
				<div class="right">\
				</div>\
			</div>\
		</div>'
		);
    }
};


$(document).ready(function(){

	$("#ID-DO-BOTAO").click(function(){
		manager.getCity($("#txt-search").val()); //Pega o nome da cidade
		manager.callAjax("weather"); // Pega o tempo atual;
		// manager.callAjax("forecast"); // Pega o tempo para os cinco dias;
	});
});
