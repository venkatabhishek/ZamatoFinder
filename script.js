$(function() {
    var baseUrl = "https://developers.zomato.com/api/v2.1";
    var selActivated = false;
  var mode = false;
  var entity_id;
  var entity_type;
    //load initial map
window.google.maps.event.addListener(window.autocomplete, 'place_changed', function () {
   mode = false;
});
  
    function makeInstance(name, options){
    var elem = $("#"+name);
      
    elem.empty();
      elem.append("<option value='' disabled selected>Choose your option</option>")
    for(var j = 0; j < options.length; j++){
      elem.append("<option value="+options[j].id+">"+options[j].name+"</option>");
    }
  
    var instance = M.FormSelect.init(elem);
    return instance;
  }
  //init selects
  var cuisines = makeInstance("cuisines", []);
  var collections = makeInstance("collections", []);
  var establishments = makeInstance("establishments", []);
  M.FormSelect.init($("#category"));
  
  $('#radius').on("change mousemove", function() {
    $("#output").html($(this).val());
});
  
 $('#update').click(function() {
    //key: 9d8d4d6cd40e8783ee21c0eb144dbefa
   if(mode){
     try{
     var text = JSON.parse($("#location").val());
     var lat = text.lat;
     var lng = text.lng;}catch(e){
      M.toast({html: 'Not a valid location!'})
     }
      
   }else{
     try{
     var lat = window.autocomplete.getPlace().geometry.location.lat();
   var lng = window.autocomplete.getPlace().geometry.location.lng();
     }catch(e){
       M.toast({html: 'Not a valid location!'})
     }
   }
 
      
   $.ajax({
   url: baseUrl+"/geocode",
   headers: {"user-key": "9d8d4d6cd40e8783ee21c0eb144dbefa"},
     data: {lat: lat, lon: lng}
   }).done(function(data){
     //configure selects
     var success = true;
     entity_id = data.location.entity_id;
     entity_type = data.location.entity_type
     //cuisines
     $.ajax({
     url: baseUrl+"/cuisines",
     headers: {"user-key": "9d8d4d6cd40e8783ee21c0eb144dbefa"},
     data: {"city_id": data.location["city_id"]}  
     }).done(function(data){
       
       var options = data.cuisines.map(function(cuis){
         return {id: cuis.cuisine["cuisine_id"],
                name: cuis.cuisine["cuisine_name"]};
       });

       var cuisines = makeInstance("cuisines", options)
       
     }).fail(function(err){
       console.log(err);
       success = false;
     });
     
     //collections
     $.ajax({
     url: baseUrl+"/collections",
     headers: {"user-key": "9d8d4d6cd40e8783ee21c0eb144dbefa"},
     data: {"city_id": data.location["city_id"]}  
     }).done(function(data){
       
       var options = data.collections.map(function(cuis){
         return {id: cuis.collection["collection_id"],
                name: cuis.collection["title"]};
       });

       var collections = makeInstance("collections", options)
       
     }).fail(function(err){
       console.log(err);
     success = false;
     });
     
     //establishments
      $.ajax({
     url: baseUrl+"/establishments",
     headers: {"user-key": "9d8d4d6cd40e8783ee21c0eb144dbefa"},
     data: {"city_id": data.location["city_id"]}  
     }).done(function(data){
       
       var options = data.establishments.map(function(cuis){
         return {id: cuis.establishment["id"],
                name: cuis.establishment["name"]};
       });

       var establishments = makeInstance("establishments", options)
       
     }).fail(function(err){
       console.log(err);
        success = false;
     });
     
     if(success){
        M.toast({html: 'Options updated!'})
     }
     
   }).fail(function(err){
     M.toast({html: 'Not a valid location!'})
   });
  
           
});
  
   var selectPoint = document.querySelector('#selectPoint');
        var instance = M.Tooltip.init(selectPoint);
         
        
      //form results
  $(".submit").click(function(){
   //4 checkboxes - selects
    var cat, cuis, coll, estab;
    if($("input[name='forCategory']").prop("checked")){
      var instance = M.FormSelect.getInstance($("#category"));
      cat = instance.getSelectedValues().join(",");
    }
    if($("input[name='forCuisines']").prop("checked")){
 var instance = M.FormSelect.getInstance($("#cuisines"));
      cuis = instance.getSelectedValues().join(",");
    }
    if($("input[name='forCollections']").prop("checked")){
  coll = $('#collections').val()
    }
    if($("input[name='forEstablishments']").prop("checked")){
  estab = $('#establishments').val()
    }
    
    
 
    //radius
    var rad = $("#radius").val();
    
    //query
    var quer = $("#query").val()
    
    var json = {
    cuisine: cuis,
      collection_id: coll, 
      establishment_type: estab,
      category: cat,
      radius: parseFloat(rad),
      q: quer,
      entity_id: entity_id,
      entity_type: entity_type
    };
    
    $.each(json, function(key, value){
    if (value === "" || value === null){
        delete json[key];
    }
});
    
    $.ajax({
    url: baseUrl + "/search",
    headers: {"user-key": "9d8d4d6cd40e8783ee21c0eb144dbefa"},
     data: json 
    }).done(function(data){
       for(var i = 0; i < data.restaurants.length;i++){
       $(".tbody").append(` <tr>
            <td>`+i+`</td>
            <td>`+data.restaurants[i].restaurant.name+`</td>
            <td>`+data.restaurants[i].restaurant.location.address+`</td>
          </tr>`)
       }
     var features = data.restaurants.map(function(rest){
        return {
          type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [rest.restaurant.location.longitude,rest.restaurant.location.latitude]
    },
    properties: {
      title: 'Mapbox',
      description: rest.restaurant.name
    }
        };
      });
      

      features.forEach(function(marker) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
  .setLngLat(marker.geometry.coordinates)
  .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
  .setHTML('<p>' + marker.properties.description + '</p>'))

  .addTo(map);
});
      
      
      M.toast({html: 'Search succeeded!'})
}).fail(function(err){
    console.log(err)
    });
    
    
    //$(".left").animate({ scrollTop: $('hr').offset().top+400 }, 1000);
  });
  

        

        $("#selectPoint").click(function() {
            $(this).toggleClass("green", 1000, "easeInOutQuad", function() {
                selActivated = !selActivated;
                $("label[for='location']").addClass("active");
            });

        });
        


    mapboxgl.accessToken = 'pk.eyJ1IjoiYXZlbmthNjc5NCIsImEiOiJjamZsMnE3ZXEwZGhlMnhzMnBvcmxlcTFjIn0.LmZIpidxC8vvC7MAiY0g_g';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
        center: [-74.50, 40], // starting position [lng, lat]
        zoom: 9 // starting zoom
    });

    map.on('load', function() {

       
        map.on('click', function(e) {
            mode = true;
            if (selActivated) {
console.log("test")
                $("#location").val(JSON.stringify(e.lngLat));
        
            }
        }); //map clicked for coords


    }); //map loaded



});