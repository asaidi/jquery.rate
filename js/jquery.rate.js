// ---------------------------------
// ---------- Plugin Name ----------
// ---------------------------------
// Brief plugin description
// ------------------------

;
(function($, window, document, undefined) {

	var pluginName = 'rate',
		defaults = {
			onComplete: function (obj) {},
			itemClass : 'star',
			activeClass : 'active',
	};

	// Create the plugin constructor
	function Plugin(element, options) {
		this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.rate.defaults;
        this.options = $.extend({}, defaults, options);
        
        this.init();
	}

	// Avoid Plugin.prototype conflicts
	$.extend(Plugin.prototype, {
		// Initialization logic
		init: function() {
			this.buildCache();
			this.bindEvents();
			this._updateRate(this.initialRate);
		},
		// Remove plugin instance completely
		destroy: function() {
			this.unbindEvents();
			this.$element.removeData();
		},
		// Cache DOM nodes for performance
		buildCache: function() {
			this.$element = $(this.element);
			this.initialRate = this.$element.attr('data-rating');
			this.rate = null;
			this.$items = $(this.$element).find('.'+this.options.itemClass);
			this.$itemsRated = $( (this.$items).eq(this.rate).prevAll() ); 

			this._setToActive( this.$itemsRated );
		},
		// Bind events that trigger methods
		bindEvents: function() {
			var plugin = this;

			plugin.$items.on('click' + '.' + this._name, function(event) {
				$this = $(this);
				plugin._setToActive($this);
				plugin._setToActive($this.prevAll());
				plugin.rate = $this.index() + 1 ;
				
				plugin._updateRate(plugin.rate);
				plugin.callback();
				return this;
			});

			plugin.$items.on('mouseover' + '.' + this._name, function(event) {
				$this = $(this);

				plugin._setToOut( plugin.$items);
				plugin._setToActive($this);
				plugin._setToActive($this.prevAll());
				return	this;
			});
			
			plugin.$items.on('mouseout' + '.' + this._name, function(event) {
				event.stopPropagation();
			});

			plugin.$element.on('mouseout' + '.' + this._name, function(event) {
				plugin._updateRate(plugin.rate);
				return this;
			});
		},
		// Unbind events that trigger methods
		unbindEvents: function() {
			this.$element.off('.' + this._name);
		},
		// setToActive item method
		_setToActive: function(item) {
			$(item).addClass('active');
		},
		// setToOut item method
		_setToOut: function(item) {
			$(item).removeClass('active');
		},
		// setToHover element method
		_updateRate: function(rate) {
				rate = rate || this.initialRate;
				console.log(rate);
				this._setToOut(this.$items);
			
				this._setToActive(this.$items.eq(rate - 1));
				this._setToActive(this.$items.eq(rate - 1).prevAll());
				
				this.$element.attr('data-rating', rate);

		},
		// Callback method
		callback: function() {
			// Cache onComplete option
			var onComplete = this.options.onComplete;
			onComplete.call(this);
		}

	});

	$.fn.rate = function(options) {
		this.each(function() {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
		return this;
	};

})(jQuery, window, document);