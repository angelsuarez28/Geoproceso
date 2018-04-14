var miMapa;
require(["esri/map",
"esri/geometry/Point",
"esri/tasks/Geoprocessor",
"esri/symbols/SimpleLineSymbol",
"esri/symbols/SimpleMarkerSymbol",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/Color",
"esri/tasks/FeatureSet",
"dojo/domReady!"], function(Map,
  Point,
  Geoprocessor,
  SimpleLineSymbol,
  SimpleMarkerSymbol,
  GraphicsLayer,
  Graphic,
  Color,
  FeatureSet


)   {

var miCentro = new Point (-117.15,32.71);

var obj = {
    "basemap": "streets-night-vector",
    "center" : miCentro,
    "zoom": 12
}

miMapa = new Map("mapaCont", obj);


var urlgp = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/NetworkAnalysis/SanDiego/GPServer/FindRoutes";




var gp = new Geoprocessor(urlgp);


var glStops = new GraphicsLayer();
miMapa.addLayer(glStops);


var glRuta = new GraphicsLayer();
miMapa.addLayer(glRuta);





var line = new SimpleLineSymbol();
line.setWidth(2);
line.setStyle(SimpleLineSymbol.STYLE_SHORTDASH);
line.setColor(new Color([255, 0, 0, 1]));
var marker = new SimpleMarkerSymbol();
marker.setOutline(line);
marker.setColor(new Color([255, 0, 0, 1]));



var line2 = new SimpleLineSymbol();
line.setColor(new Color([0, 168, 132, 1]));



var arrayStops = [];
var units = "Minutes";



miMapa.on ("click", añadirStop);




function añadirStop (objEvento){

var pnt = objEvento.mapPoint;
var gr = new Graphic(pnt,marker);
glStops.add(gr);
arrayStops.push(gr); /* almacena los puntos que pongamos en el mapa dentro de un array*/

};





var botonCalcularRuta = document.getElementById("btnRuta");
botonCalcularRuta.onclick = calculaRuta;


/*if (arrayStops.length >=2){

calculaRuta();
}

else

{alert("necesito dos puntos al menos")};*/






function calculaRuta(){

/* obtener parámetros de entrada*/
var fsetStops = new FeatureSet();
/*features es una propiedad que tiene array de graficos y cogemos este por que nos lo pide el geoproceso*/
fsetStops.features = arrayStops;
/* montar objeto parametros de entrada*/
var objParams = {
Stops: fsetStops,
Measurement_Units: units,
/*Reorder_Stops_to_Find_Optimal_Routes : inputOptima.value;*/
};



var inputOptima = document.getElementById ("check");

inputOptima.onchange = calculaRuta;







/*lanzar el geoprocesamiento*/

gp.submitJob(objParams,submitJobSucceded);



function submitJobSucceded(jobInfo){
var jobId = jobInfo.jobId;
gp.getResultData(jobId,"Output_Routes", getResult);
}




function getResult (resultado){


var resultadofinal = resultado.value.features[0];
var capa = resultadofinal.setSymbol(line2);
glRuta.add(capa);



console.log(resultado);
}



var botonBorrar = document.getElementById("btnBorra");
botonBorrar.onclick = borrar;


function borrar () {

glRuta.clear();
glStops.clear();

};




};














});
