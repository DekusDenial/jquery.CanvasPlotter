/*global QUnit:false, module:false, test:false, asynctest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  module('jQuery#canvasPlotter', {
    setup : function() {
      this.elems = $('div#fixture');
    }
  });

  test('is available on the jQuery object', 1, function(){
    ok($.fn.canvasPlotter, 'should be accessible on a collection');
  });

  test('should be chainable', 1, function(){
    strictEqual(this.elems.canvasPlotter(), this.elems, 'should return a jQuery object');
  });

  test('should create a canvas element', 1, function(){
    this.elems.canvasPlotter();
    ok(this.elems.find('canvas').length > 0, 'should contain a canvas element');
  });

  test('should have a default setting object on its namespace', 1, function(){
    ok($.fn.canvasPlotter.defaults, 'User can change without doing so in the plugin');   
  });

  test('should allow user to override default settings', 2, function(){
    this.elems.canvasPlotter({
      animated : true
    });
    var cv = this.elems.find('canvas')[0];
    ok(cv.className, 'should have class assigned if enabling animation on default setting');
    strictEqual(cv.className, 'bar-animated', 'should have class "bar-animated" assigned');
  });

  test('should have the right width on canvas', 1, function(){
    this.elems.canvasPlotter({
      
    });
    var cv = this.elems.find('canvas')[0];
    strictEqual(cv.width, 625, 'should be 470 pixels wide for 13 bars');
  });

}(jQuery));
