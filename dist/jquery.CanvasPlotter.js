/*! jQuery Canvasplotter - v0.1.0 - 2012-04-14
* https://github.com/DekusDenial/jquery.CanvasPlotter
* Copyright (c) 2012 DekusDenial; Licensed MIT */

// (function($) {

//   // Collection method.
//   $.fn.awesome = function() {
//     return this.each(function() {
//       $(this).html('awesome');
//     });
//   };

//   // Static method.
//   $.awesome = function() {
//     return 'awesome';
//   };

//   // Custom selector.
//   $.expr[':'].awesome = function(elem) {
//     return elem.textContent.indexOf('awesome') >= 0;
//   };

// }(jQuery));


if ( typeof Object.create !== 'function' ) {
  Object.create = function(o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}

(function($, window, document, undefined){

  var CanvasPlotter = {

    init : function (el, opts){
      // initialize all data for ground 0

      this.el = el;
      this.$el = $(el);

      this.config = $.extend( {}, $.fn.canvasPlotter.defaults, opts );
      this.prepareCanvas();
    },

    prepareCanvas : function(){
      // preset the canvas or adjust according to config
      var $cv = $('<canvas>');
      if (this.config.animated) {
        $cv.addClass('bar-animated');
      }

      this.$el.append($cv);

    },

    fetchData : function() {
      // read input data, or fetch by AJAX
    },

    normalizeData : function() {
      // scale and normalize values to be used in the plotter
    },

    drawLabels : function() {
      // draw out XLabels and YLabels
    },

    plotBars : function(){
      // plot the bars
    },

    animatedPlotBars : function(){
      // plot bars with animation
    },

    utils : {
      posX : function(index){
        // calculate which x position to plot each bar
      },

      posY : function(index){
        // calculate the top y position of each bar
      }
    }
  };

  $.fn.canvasPlotter = function(opts) {

    return this.each(function(){
      var canvasPlotter = Object.create(CanvasPlotter);
      canvasPlotter.init(this, opts);
    });
  };

  $.fn.canvasPlotter.defaults = {
    // default settings here
    animated : false,
    barGap : 15,
    barWidth : 20,
    canvasHeight : 200

    // and more ...
  };

}(jQuery, window, document));