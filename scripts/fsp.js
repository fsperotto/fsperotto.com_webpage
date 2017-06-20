
//----------------------------------------------------------------------
// global variables
//----------------------------------------------------------------------

var urlParams;

var lang;

var root;


//----------------------------------------------------------------------
// events handlers
//----------------------------------------------------------------------


//on load, triggered after complete load
window.onload = function(event) {

  //js dependent positioning for elements
  setTimeout(placeElements, 400); 
  
  //define event handlers
  setTimeout(defineEventHandlers, 450);

  //define the lang to be used
  setTimeout(defineLang, 500);


  return true;
  
}


//----------------------------------------------------------------------


//on load, triggered as soon as possible
$(document).ready(function(event) {

  //parse url parameters
  fillURLparams();

  //define root element
  root = $('html, body');

  //include html fragments
  w3.includeHTML();

  return true;

});


//----------------------------------------------------------------------


function defineEventHandlers() {

  //on scroll
  $(document).scroll(function(event) {
    
    //header vanishing effect
    
    var pos = $(document).scrollTop();

    var parallax = parseInt(pos * -0.3) + 'px';
    var alpha_bck = 0.6 * pos / $("#header_content").height();
    var opc_bck   = 1.0 - alpha_bck;
    var alpha_cnt = 0.3 * pos / $("#header_content").height();
    var opc_cnt   = 1.0 - alpha_bck;

    $('#header_content').css('margin-top', parallax);
    $('#header_content').css('opacity', opc_cnt / 5.0 * 3.0 + 0.4);
    $('#header_background').css('opacity', opc_bck);

    return true;

  });


  //----------------------------------------------------------------------

  //on resize
  $(window).resize( function(event) {

    //js dependent positioning for elements
    placeElements();

    return true;
    
  });


  //----------------------------------------------------------------------

  //on click anchor
  $(document).on("click", "a[href^='\\#']", function(event) {

      // scrolling for anchors
      
      // cancel the default event
      event.preventDefault();
      
      // identify elements and positions
      var anchor = $.attr(this, 'href');
      var element = null;
      var pos = 0;
      if (anchor != "#") {
        element = $( anchor );
        pos = $( element ).offset().top;
      }

      // scroll animation
      $(root).animate({scrollTop: pos }, 'slow');

      //if there is an element behind the anchor
      if (element != null) {
      
        // try to find an accordion
        var accordion_header = $( $( $(element).get(0) ).find(".accordion-toggle:first") ).get(0);

        //if it is an accordion
        if (accordion_header != null) {
          //open it
          acc(accordion_header, true);
        }
        
      }
      
      return true;
      
  });
  
  //----------------------------------------------------------------------

  $( "a.lang_en" ).click( function() { 
    defineLang("en");
  });

  $( "a.lang_fr" ).click( function() { 
    defineLang("fr");
  });
  
  $( "a.lang_br" ).click( function() { 
    defineLang("br");
  });

  //----------------------------------------------------------------------


  $( ".accordion-toggle" ).click( function() {
     acc( $(this), false);
  });

  //----------------------------------------------------------------------

}


//----------------------------------------------------------------------
// functions
//----------------------------------------------------------------------


//toggle accordion
function acc(accordion_header_element, force_open) {
  
  //find the content given the header
  var accordion_content_element = $(accordion_header_element).next();
  
  //fin the icon given the header
  var accordion_icon_element = $($(accordion_header_element).find(".accordion-icon:first")).get(0);
  
  //if content exists
  if (accordion_content_element != null) {
    //opent or close it
    if (force_open) {
      $(accordion_content_element).slideDown('slow');
    } else {
      $(accordion_content_element).slideToggle('slow');
    }
  }

  //if icon exists
  if (accordion_icon_element != null) {
    //set it
    if (force_open) {
      accordion_icon_element.innerHTML = "[-]";
    } else {
      if (accordion_icon_element.innerHTML == "[-]") {
        accordion_icon_element.innerHTML = "[+]";
      } else {
        accordion_icon_element.innerHTML = "[-]";
      }
    }
  }
  
}


// define the lang
function defineLang(l) {

  //get the lang from function parameter
  lang = l;

  //try to identify the lang using the url params
  if ( (!lang) || (lang=="") ) { lang = urlParams["lang"]; }

  //try to identify the lang using the local storage
  if ( (!lang) || (lang=="") ) { lang = window.sessionStorage.getItem("lang_fsp"); }
  if ( (!lang) || (lang=="") ) { lang = window.localStorage.getItem("lang_fsp"); }

  //try to identify the lang using the navigator properties 
  if ( (!lang) || (lang=="") ) { lang = window.navigator.language; }
  if ( (!lang) || (lang=="") ) { lang = window.navigator.browserLanguage; }
  if ( (!lang) || (lang=="") ) { lang = window.navigator.systemLanguage; }

  //get only the first two characters
  lang = lang.substring(0,2);  
  
  //choose the language
  if ( (lang!="en") && (lang!="fr") ) { lang = "br"; }
  
  //store the lang option
  localStorage.setItem("lang_fsp", lang);
  sessionStorage.setItem("lang_fsp", lang);
  
  //search for all elements in the page with defined lang
  var elements = document.querySelectorAll("[lang]");

   //alert( "lang is " + lang);

  //make visible the chosen language
  var i;
  for (i = 0; i < elements.length; i++) {
    if (elements[i].lang == lang) {
      elements[i].style.display = "initial";
      //$(elements[i]).show();
    } else {
      elements[i].style.display = "none";
      //$(elements[i]).hide();
    }
  }
  
  //alert( "lang is " + lang);
  
  return true;

}


function placeElements() {
  
  //main under header
  $( "main" ).css("margin-top", $( "#header_content" ).height()+40+"px");
  
}


// parse url parameters
function fillURLparams() {
  
    var match,
        pl     = /\+/g,  // Regex for replacing '+' symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
  
}

