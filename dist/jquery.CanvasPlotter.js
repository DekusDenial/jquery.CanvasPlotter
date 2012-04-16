/*! jQuery Canvasplotter - v0.1.0 - 2012-04-15
* https://github.com/DekusDenial/jquery.CanvasPlotter
* Copyright (c) 2012 DekusDenial; Licensed MIT */

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
      this.$cv[0].width = this.yValue.length * (this.config.barWidth + this.config.barGap) + this.config.barGap * 2;
      if (!(this.cvContext = this.$cv[0].getContext('2d'))) {
        throw "Sorry, something wrong with canvas in your browser!";
      }

      this.normalizeData();
      this.drawLabels();
      (this.config.animated) ? this.animatedPlotBars() : this.plotBars();
    },

    normalizeData : function() {
      // scale and normalize values to be used in the plotter
      this.maxValue = Math.round(Math.max.apply(Math, this.yValue) * (1 + this.config.constants.scaleFactor));
      this.minValue = Math.min.apply(Math, this.yValue) - Math.round(this.maxValue * this.config.constants.scaleFactor);
    },

    drawLabels : function() {
      var ctx = this.cvContext;

      ctx.save();
      ctx.fillStyle = '#fff';
      ctx.fillRect(this.config.barGap + this.config.constants.xTickOffset, 0, this.$cv[0].width, this.config.constants.maxHeight + Math.round(this.config.constants.yTickOffset / 2));

      // draw out XLabel and YLabel
     
      var i, l = this.xValue.length;

      ctx.font = "11px Helvetica, Arial, sans-serif";
      ctx.fillStyle = "#000";
      // first draw x-axis
      for (i = 0; i < l ; i++) {
        ctx.fillText(this.xValue[i], this.utils.posX.call(this, i), this.config.constants.maxHeight + this.config.constants.bottomOffset);
      }

      // then draw ticks on y-axis according to numYTicks
      for (i = 0, l = this.config.numYTicks; i < l + 1; i++) {
        var yTickValue = Math.round(this.maxValue / this.config.numYTicks * i);
        var yTickAdjust = (this.maxValue.toString().length - yTickValue.toString().length) * this.config.constants.yTickAdjustFactor;
        ctx.fillText(yTickValue, this.config.constants.xTickOffset + yTickAdjust, this.utils.posY.call(this, yTickValue) + this.config.constants.yTickOffset);
        this.drawGrids(ctx, this.config.constants.xTickOffset, this.utils.posY.call(this, yTickValue) + Math.round(this.config.constants.yTickOffset / 2));
      }
      
      ctx.restore();
    },

    drawGrids : function(ctx, x, y){
      // draw the grids
      ctx.save();
      ctx.fillStyle = "#ccc";
      ctx.fillRect(x + 20, y, this.$cv[0].width, 1);

      // then draw the bottom and left border of the grid
      ctx.fillStyle = "#111";
      ctx.fillRect(this.config.barGap + this.config.constants.xTickOffset, this.config.constants.maxHeight + Math.round(this.config.constants.yTickOffset / 2), this.$cv[0].width, 1);
      ctx.fillRect(this.config.barGap + this.config.constants.xTickOffset, 0, 1, this.config.constants.maxHeight + Math.round(this.config.constants.yTickOffset / 2));
      ctx.restore();
    },

    plotBars : function(){
      // plot the bars
      var i = 0, l = this.yValue.length, ctx = this.cvContext;
      ctx.save();
      ctx.lineWidth = 1;      

      for (; i < l; i++){
        // fake the shadow without using canvas context shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(this.utils.posX.call(this, i) + 3, this.utils.posY.call(this, this.yValue[i]) + Math.round(this.config.constants.yTickOffset / 2) + 3, this.config.barWidth, this.utils.scale.call(this, this.yValue[i]) - 3);

        // draw the actual bar on top of the "shadow"
        ctx.fillStyle = '#8DC900';
        ctx.fillRect(this.utils.posX.call(this, i), this.utils.posY.call(this, this.yValue[i]) + Math.round(this.config.constants.yTickOffset / 2), this.config.barWidth , this.utils.scale.call(this, this.yValue[i]));

        // show the bar value
        ctx.fillStyle = '#000';
        var yValueAdjust = Math.round(this.config.barWidth / 2 - (this.yValue[i].toString().length * this.config.constants.yTickAdjustFactor / 2));
        ctx.fillText(this.yValue[i], this.utils.posX.call(this, i) + yValueAdjust, this.utils.posY.call(this, this.yValue[i]));


        // extra outline stroke for the bar
        // ctx.strokeStyle = '#444';
        // ctx.strokeRect(this.utils.posX.call(this, i), this.utils.posY.call(this, this.yValue[i]) + Math.round(this.config.constants.yTickOffset / 2), this.config.barWidth , this.utils.scale.call(this, this.yValue[i]));
      }

      ctx.restore();
    },

    animatedPlotBars : function(){
      // plot bars with animation
      this.$cv.addClass('bar-animated');
      this.plotBars();
    },

    utils : {
      posX : function(index){
        // calculate which x position to plot each bar
        return (index * this.config.barWidth) + ((index + 2) * this.config.barGap) + this.config.constants.xTickOffset;
      },

      posY : function(value){
        // calculate the top y position of each bar
        return this.config.constants.maxHeight - this.utils.scale.call(this, value);
      },

      scale : function(value){
        // calculate the relative height of the bar according to maxValue
        return Math.round((value/this.maxValue) * this.config.constants.maxHeight);
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
    numYTicks : 10,
    constants : {
      bottomOffset : 20,
      xLabelOffset : 15,
      yTickOffset : 10,
      yTickAdjustFactor: 6,
      xTickOffset : 5,
      scaleFactor : 0.1

    }
  };

  $.fn.canvasPlotter.defaults.constants.maxHeight = $.fn.canvasPlotter.defaults.canvasHeight - $.fn.canvasPlotter.defaults.constants.bottomOffset;

}(jQuery, window, document));