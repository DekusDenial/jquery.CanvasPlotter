/*
 * jquery.CanvasPlotter
 * https://github.com/DekusDenial/jquery.CanvasPlotter
 *
 * Copyright (c) 2012 DekusDenial
 * Licensed under the MIT license.
 */

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
      this.dataSource = this.$el.data('source') || this.config.dataSource;
      this.dataSource = (this.dataSource.indexOf('#') > -1) ? this.dataSource : ('#' + this.dataSource);
      this.fetchData();
    },

    fetchData : function() {
      // read input data
      // 1) assume we have a table selector passed in
      this.xValue = [];
      this.yValue = [];
      var me = this;
      var $dataSource = $(this.config.dataSource), $th = $dataSource.find('th');
      this.XLabel = $th[0];
      this.YLabel = $th[1];

      $dataSource.find('tr td').each(function(i, el){
        (i & 1) ? me.yValue.push(el.innerText) : me.xValue.push(el.innerText);
      });
      this.prepareCanvas();

    },

    prepareCanvas : function(){
      // preset the canvas or adjust according to config
      this.$cv = this.$el.append('<canvas>').find('canvas');
      if (this.config.animated) {
        this.$cv.addClass('bar-animated');
      }

      this.$cv[0].height = this.config.canvasHeight;
      this.$cv[0].width = this.yValue.length * (this.config.barWidth + this.config.barGap) + this.config.barGap;

    },

    normalizeData : function() {
      // scale and normalize values to be used in the plotter
    },

    drawLabels : function() {
      // draw out XLabel and YLabel
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
    // default settings here:
    // barGap = how much space between each plotted bar
    // barWidth = how wide is each bar
    // canvasHeight = how long the canvas should be
    // dataSource = the source of the data
    animated : false,
    dataSource: 'table#dataSource',
    barGap : 15,
    barWidth : 20,
    canvasHeight : 200

    // and more ...
  };

}(jQuery, window, document));