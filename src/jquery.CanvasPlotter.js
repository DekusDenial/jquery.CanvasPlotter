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
      this.xLabel = $th[0];
      this.yLabel = $th[1];

      $dataSource.find('tr td').each(function(i, el){
        (i & 1) ? me.yValue.push(el.innerText) : me.xValue.push(el.innerText);
      });
      this.prepareCanvas();

    },

    prepareCanvas : function(){
      // preset the canvas or adjust according to config
      this.$cv = this.$el.append('<canvas>').find('canvas');
      
      this.$cv[0].height = this.config.canvasHeight;
      this.$cv[0].width = this.yValue.length * (this.config.barWidth + this.config.barGap) + this.config.barGap;
      if (!(this.cvContext = this.$cv[0].getContext('2d'))) {
        throw "Sorry, something wrong with canvas in your browser!";
      }
      this.normalizeData();
      this.drawLabels();
      (this.config.animated) ? this.animatedPlotBars() : this.plotBars();
    },

    normalizeData : function() {
      // scale and normalize values to be used in the plotter
      this.maxValue = Math.max.apply(Math, this.yValue);
      this.minValue = Math.min.apply(Math, this.yValue) - Math.round(this.maxValue/10);
    },

    drawLabels : function() {
      // draw out XLabel and YLabel
      // first draw x-axis
      var i, l = this.xValue.length, ctx = this.cvContext;
      ctx.save();
      ctx.font = "11px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#000000";
      for(i = 0; i < l ; i++) {
        console.log(this.utils.posX.call(this, i));
        ctx.fillText(this.xValue[i], this.utils.posX.call(this, i), this.config.constants.maxHeight + this.config.constants.xLabelOffset);
      }
      ctx.restore();
    },

    plotBars : function(){
      // plot the bars
    },

    animatedPlotBars : function(){
      // plot bars with animation
      this.$cv.addClass('bar-animated');
    },

    utils : {
      posX : function(index){
        // calculate which x position to plot each bar
        return (index * this.config.barWidth) + ((index + 1) * this.config.barGap);
      },

      posY : function(value){
        // calculate the top y position of each bar
        return this.config.constants.maxHeight - this.scale(value);
      },

      scale : function(value){
        // calculate the relative height of the bar according to maxValue
        return Math.round((value/maxValue) * maxHeight);
      }
    }
  };

  $.fn.canvasPlotter = function(opts) {

    return this.each(function(){
      var canvasPlotter = Object.create(CanvasPlotter);
      canvasPlotter.init(this, opts);
    });
  };

  // default settings here:
  // barGap = how much space between each plotted bar
  // barWidth = how wide is each bar
  // canvasHeight = how long the canvas should be
  // dataSource = the source of the data
  $.fn.canvasPlotter.defaults = {
    animated : false,
    dataSource: 'table#dataSource',
    barGap : 20,
    barWidth : 25,
    canvasHeight : 200,
    constants : {
      bottomOffset : 20,
      xLabelOffset : 15,
      yTickOffset : 3,
      xTickOffset : 3,
      scaleFactor : 0.1
    }
  };

  $.fn.canvasPlotter.defaults.constants.maxHeight = $.fn.canvasPlotter.defaults.canvasHeight - $.fn.canvasPlotter.defaults.constants.bottomOffset;

}(jQuery, window, document));