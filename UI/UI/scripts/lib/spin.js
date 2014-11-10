//#v1.2.6
(function(window, document, undefined) {
  "use strict";
  var prefixes = ['webkit', 'Moz', 'ms', 'O'],
      animations = {},
      useCssAnimations;

  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div'),
        n;

    for(n in prop){
      if(prop.hasOwnProperty(n)){
          el[n] = prop[n];
      }
    } 
    return el;
  }
  function ins(parent) {
    for (var i=1, n=arguments.length; i<n; i++){
      parent.appendChild(arguments[i]);
    }

    return parent;
  }

  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'});
    ins(document.getElementsByTagName('head')[0], el);
    return el.sheet || el.styleSheet;
  }());

  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-'),
        start = 0.01 + i/lines*100,
        z = Math.max(1 - (1-alpha) / trail * (100-start), alpha),
        prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase(),
        pre = prefix && '-'+prefix+'-' || '';

    if (!animations[name]) {
      sheet.insertRule('@'+pre+'keyframes '+name+'{'+'0%{opacity:'+z+'}'+start+'%{opacity:'+alpha+'}'+(start+0.01)+'%{opacity:1}'+(start+trail)%100+'%{opacity:'+alpha+'}'+'100%{opacity:'+z+'}'+'}', sheet.cssRules.length);

      animations[name] = 1;
    }
    return name;
  }

  function vendor(el, prop) {
    var s = el.style,
        pp,
        i;

    if(s[prop] !== undefined){
      return prop;
    } 
    prop = prop.charAt(0).toUpperCase() + prop.slice(1);
    
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop;
      if(s[pp] !== undefined){
        return pp;
      }
    }
  }

  function css(el, prop) {
    for (var n in prop){
      if(prop.hasOwnProperty(n)){
        el.style[vendor(el, n)||n] = prop[n];
      }
    }
    
    return el;
  }

  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def){
        if (obj[n] === undefined){
          obj[n] = def[n];
        }
      } 
    }
    return obj;
  }

  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop };
    while((el = el.offsetParent)){
      o.x+=el.offsetLeft;
      o.y+=el.offsetTop;
    }

    return o;
  }

  var defaults = {
    lines: 17,            // The number of lines to draw
    length: 2,            // The length of each line
    width: 2,             // The line thickness
    radius: 8,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#999',        // #rgb or #rrggbb
    speed: 1.2,             // Rounds per second
    trail: 63,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 990,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto'          // center horizontally
  };

  /** The constructor */
  var Spinner = function(o) {
    if (!this.spin){
      return new Spinner(o);
    }
    this.opts = merge(o || {}, Spinner.defaults, defaults);
  };

  Spinner.defaults = {};

  merge(Spinner.prototype, {
    spin: function(target) {
      this.stop();
      var self = this,
          o = self.opts,
          el = self.el = css(createEl(0, {className: o.className}), {position: 'relative', width: 0, zIndex: o.zIndex}),
          mid = o.radius+o.length+o.width,
          ep,
          tp; // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null);
        tp = pos(target);
        ep = pos(el);
        css(el, {
          left: (o.left === 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
          top: (o.top === 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid)  + 'px'
        });
      }

      el.setAttribute('aria-role', 'progressbar');
      self.lines(el, self.opts);

      if (!useCssAnimations) {
        var i = 0,
            fps = o.fps,
            f = fps/o.speed,
            ostep = (1-o.opacity) / (f*o.trail / 100),
            astep = f/o.lines;

        (function anim() {
          i++;
          for (var s=o.lines; s; s--) {
            var alpha = Math.max(1-(i+s*astep)%f * ostep, o.opacity);
            self.opacity(el, o.lines-s, alpha, o);
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps));
        }());
      }
      return self;
    },

    stop: function() {
      var el = this.el;
      if (el) {
        clearTimeout(this.timeout);
        if (el.parentNode){
          el.parentNode.removeChild(el);
          this.el = undefined;
        }
      }
      return this;
    },

    lines: function(el, o) {
      var i = 0,
          seg;

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        });
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, i, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        });

        if (o.shadow){
          ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}));
        } 

        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')));
      }
      return el;
    },

    opacity: function(el, i, val) {
      if (i < el.childNodes.length){
        el.childNodes[i].style.opacity = val;
      }
    }

  });

  ;(function() {

    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr);
    }

    var s = css(createEl('group'), {behavior: 'url(#default#VML)'});

    if (!vendor(s, 'transform') && s.adj) {

      sheet.addRule('.spin-vml', 'behavior:url(#default#VML)');

      Spinner.prototype.lines = function(el, o) {
        var r = o.length+o.width,
            s = 2*r;

        function grp() {
          return css(
            vml('group', {
              coordsize: s + ' ' + s,
              coordorigin: -r + ' ' + -r
            }),
            { width: s, height: s }
          );
        }

        var margin = -(o.width+o.length)*2 + 'px',
            g = css(grp(), {position: 'absolute', top: margin, left: margin}),
            i;

        function seg(i, dx, filter) {
          ins(g,
            ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
              ins(css(vml('roundrect', {arcsize: o.corners}), {
                  width: r,
                  height: o.width,
                  left: o.radius,
                  top: -o.width>>1,
                  filter: filter
                }),
                vml('fill', {color: o.color, opacity: o.opacity}),
                vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
              )
            )
          );
        }

        if (o.shadow){
          for (i = 1; i <= o.lines; i++){
            seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)');
          }
        }
          

        for (i = 1; i <= o.lines; i++){
          seg(i);
        } 
        return ins(el, g);
      };

      Spinner.prototype.opacity = function(el, i, val, o) {
        var c = el.firstChild;
        o = o.shadow && o.lines || 0;
        if (c && i+o < c.childNodes.length) {
          c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild;
          if (c){
            c.opacity = val;
          }
        }
      };
    }else{
      useCssAnimations = vendor(s, 'animation');
    }
  }());

//  if (typeof define === 'function' && define.amd){
//    define(function() { return Spinner; });
//  }else{
    window.Spinner = Spinner;
//  }
    

}(window, document));
/*

You can now create a spinner using any of the variants below:

$("#el").spin(); // Produces default Spinner using the text color of #el.
$("#el").spin("small"); // Produces a 'small' Spinner using the text color of #el.
$("#el").spin("large", "white"); // Produces a 'large' Spinner in white (or any valid CSS color).
$("#el").spin({ ... }); // Produces a Spinner using your custom settings.

$("#el").spin(false); // Kills the spinner.

*/
(function($) {
	$.fn.spin = function(opts, color) {
		var presets = {
			"tiny": { lines: 11, length: 2, width: 2, radius: 5 },
			"small": { lines: 17, length: 2, width: 2, radius: 8 },
			"large": { lines: 17, length: 8, width: 2, radius: 20 },
      "block-ui": { lines: 15, length: 3, width: 2, radius: 10, left: 20}
		};
		if (Spinner) {
			return this.each(function() {
				var $this = $(this),
					data = $this.data();

				if (data.spinner) {
					data.spinner.stop();
					delete data.spinner;
				}
				if (opts !== false) {
					if (typeof opts === "string") {
						if (opts in presets) {
							opts = presets[opts];
						} else {
							opts = {};
						}
						if (color) {
							opts.color = color;
						}
					}
					data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
				}
			});
		} else {
			throw "Spinner class not available.";
		}
	};
})(jQuery);