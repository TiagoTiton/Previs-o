document.addEventListener('deviceready', onDeviceReady, false);

var cidade;
function onDeviceReady() {
    app.inicializar();
    app.carregaFavoritas();
    $(document).ready(function(){
        $("#favs").click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            var cidade = $("#barra").val();
            var favorita = new Fav(cidade);
            app.insereFavorita(favorita);
            app.carregaFavoritas();
        });

        $("#menu-toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("active");
        });
        $(".previsao").hide();
        $(".tempo-atual").hide();

        $("#amodal").click(function(){
            cidade = $("#barra").val();
            manager.Ajax("weather");

        });
        
        $("#pmodal").click(function(){
            cidade = $("#barra").val();
            manager.Ajax("forecast");
        });
    });
}
    /*$("#favs").click(function(){
        cidade = $("#barra").val();
        $(".dropdown-menu").append('<li><a href="#">' + cidade +'</a></li>');
    });*/
var manager = {
    Ajax: function(tipo){
        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/" + tipo, 
            data: { 
                q: cidade,
                lang: "pt",
                units: "metric",
                APPID: "c9258c9834d00b4178b094ab70001f28",
            },
            dataType: "json",
            success: function(response) {
                console.log(response);
                if (tipo == "forecast"){
                    $("#meumodal").modal("hide");
                    $(".tempo-atual").hide();
                    $(".previsao").show();
                    builder.getPrevisao(response);

                    
                }else{
                    $("#meumodal").modal("hide");
                    $(".previsao").hide();
                    $(".tempo-atual").show();
                    builder.getAtual(response);
                    
                }
            },
            failure: function(response) {
                console.error(response);
            }
        });
    }
}

var builder = {
    getAtual: function(response){
        var temp_atual = response.main.temp;
        var min = response.main.temp_min;
        var max = response.main.temp_max;
        var icone = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var cidade = response.name + "<img src='" + icone + "'/>";
        var descricao = response.weather[0].description;
        var umidade = response.main.humidity;
        $(".tempo-atual").html(
            '<div class="cabeca">\
                    <h4>Condição de tempo atual</h4>\
                </div>\
                <div>\
                    <h1 id="cidade">' + cidade + '</h1>\
                    <h1 id="atual">' + temp_atual + 'º</h1>\
                    <h6 id="condicao">' + descricao + '</h6><br>\
                    <h4 id ="min">Mínima: ' + min + 'º</h4>\
                    <h4 id ="max">Máxima: ' + max + 'º</h4>\
                    <h4 id ="umidade">Umidade: ' + umidade + '%</h4>\
                </div>\
            </div>');
    },

    getPrevisao: function(response){
        var i = 0;
        var i2 = -1;
        var j;
        var date2 = 0;
        for(j of response.list){
            var date = j.dt_txt.slice(8,10) + "/" + j.dt_txt.slice(5,7);
            var temp = j.main.temp;
            var min = j.main.temp_min;
            var max = j.main.temp_max;
            var icone = "http://openweathermap.org/img/w/" + j.weather[0].icon + ".png";
            var cidade = response.city.name + "<img src='" + icone + "'/>";
            var descricao = j.weather[0].description;
            var umidade = j.main.humidity;
            var hora = j.dt_txt.slice(10, 16);

            if (date != date2){
                date2 = date;
                ++i;
                ++i2;
                $(".carousel-indicators").append(
                    '<li data-target="#myCarousel" data-slide-to="' + i2 + '"></li>');

                $(".carousel-inner").append(
                    '<div class="item">\
                    <div class="col-xs-12  tempo-previsao">\
                        <div class="cabeca">\
                            <h5>Previsão ' + date + ' - ' + hora +'</h5>\
                        </div>\
                        <div>\
                            <h3 id="cidade">' + cidade + '</h3>\
                            <h2 id="atual">' + temp + 'º</h2>\
                            <h6 id="condicao">' + descricao + '</h6><br>\
                            <h5 id ="min">Mínima: ' + min + 'º</h5>\
                            <h5 id ="max">Máxima: ' + max + 'º</h5>\
                            <h5 id ="umidade">Umidade: ' + umidade + '%</h5><br>\
                            <button type="button" class="btn btn-primary btn-lg btn-block info" data-toggle="modal" data-target="#modal-previsao-' + i +'"> Mais Horários </button><br>\
                        </div>\
                    </div>\
                    </div>');
                
            }else{

                $("#header-" + i).html("<h2>" + date +"</h2");
                $("#body-" + i).append(
                    '<div class="col-xs-12 tempo-previsao">\
                        <div class="cabeca">\
                            <h4>Previsão ' + hora +'</h4>\
                        </div>\
                        <div>\
                            <h1 id="atual">' + temp + 'º <img src="' + icone +'"/></h1>\
                            <h6 id="condicao">' + descricao + '</h6><br>\
                            <h4 id ="min">Mínima: ' + min + 'º</h4>\
                            <h4 id ="max">Máxima: ' + max + 'º</h4>\
                            <h4 id ="umidade">Umidade: ' + umidade + '%</h4>\
                        </div>\
                    </div>')}
        }
        
    }
}

var app = {

    inicializar: function(){
        this.db = new loki('favoritas.db', {
            autosave: true,
            autosaveInterval: 1000,
            autoload: true
        });

        this.db.loadDatabase();

        var favoritas = this.db.getCollection('favoritas');

        if (!favoritas) {
            favoritas = this.db.addCollection('favoritas');
        }

        var favorita = favoritas.get(1);
    },

    insereFavorita: function(favorita){
        var favoritas = this.db.getCollection("favoritas");
        favoritas.insert(favorita);
    },

    carregaFavoritas: function(){

    var favoritas = this.db.getCollection('favoritas');

        $('.dropdown-menu').empty();

        if (favoritas.data.length <= 0) {
                
            var modelo = '<li><a href="#">Sem Favoritas</a></li>';
            $('.dropdown-menu').append(modelo);                
            
        }

        favoritas.data.forEach(function(favorita) {
            var modelo = '<li><a href="#">' + favorita.titulo +'</a></li>';
            $('.dropdown-menu').append(modelo);
        });

        /*$('.dropdown-menu').listview('refresh');*/
    },

}

var Fav = function(titulo){
    this.titulo = titulo;
}
