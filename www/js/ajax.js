document.addEventListener('deviceready', onDeviceReady, false);

var cidade;

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
                    cidade = response.name;
                    builder.getPrevisao(response);

                }else{
                    $("#meumodal").modal("hide");
                    $(".previsao").hide();
                    $(".tempo-atual").show();
                    cidade = response.name;
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
        $(".previsao").html(
            '<div class="col-xs-12" >\
                    <div id="myCarousel" class="carousel slide" data-ride="carousel">\
                        <ol class="carousel-indicators">\
                        </ol>\
                        <div class="carousel-inner" role="listbox">\
                        </div>\
                      <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">\
                        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>\
                        <span class="sr-only">Previous</span>\
                      </a>\
                      <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">\
                        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>\
                        <span class="sr-only">Next</span>\
                      </a>\
                    </div>\
                </div>')
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
                if(i2 == 0){
                    $(".carousel-indicators").append(
                        '<li data-target="#myCarousel" data-slide-to="0" class="active"></li>')
                }else{
                    $(".carousel-indicators").append(
                    '<li data-target="#myCarousel" data-slide-to="' + i2 + '"></li>');
                }
                
                if(i2 == 0){
                    $(".carousel-inner").append(
                    '<div class="item active">\
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
                    </div>')
                }else{
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
                }
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
            var celula = '<li><a href="#">Sem Favoritas</a></li>';
            $('.dropdown-menu').append(celula);                
        }

        favoritas.data.forEach(function(favorita) {
            var celula = '<li><a href="#" id="cidadefav" data-toggle="modal" data-target=".modal1">' + favorita.titulo +'</a></li>';
            $('.dropdown-menu').append(celula);
        });

    },

    limpaFavoritas: function(){
        var favoritas = this.db.getCollection("favoritas");
        favoritas.clear();
    },

}

var Fav = function(titulo){
    this.titulo = titulo;
}


function onDeviceReady() {
    app.inicializar();
    app.carregaFavoritas();
    $(document).ready(function(){

        
        
        $("#favs").click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            var favorita = new Fav(cidade);
            app.insereFavorita(favorita);
            app.carregaFavoritas();
        });

        $("#limpar").click(function(e){
            e.stopImmediatePropagation();
            e.preventDefault();
            app.limpaFavoritas();
            app.carregaFavoritas();
        });

        $("#menu-toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("menuDisplayed");
        });
        
        $(".previsao").hide();
        $(".tempo-atual").hide();
        $("#favs").hide();

        $("#pesquisa").click(function(){
            cidade = $("#barra").val();
        });

        $("#drop").click(function(e){
            var ci = $(e.target).html();
            cidade = ci;
        });
        

        $("#amodal").click(function(){
            manager.Ajax("weather");
            $("#favs").show();

        });
        
        $("#pmodal").click(function(){
            manager.Ajax("forecast");
            $("#favs").show();
        });
    });
}
