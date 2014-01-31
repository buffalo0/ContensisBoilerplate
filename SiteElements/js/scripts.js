/**
 * Author: Bureau for Visual Affairs
 * URL: http://www.bureau-va.com/
 */
(function ($) {

	/* Detect JS */
	$('html').removeClass('no-js').addClass('js');


	/* Variables */
	var windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			$html = $('html'),
			isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

	/* Plugins */
	$.fn.tabs = function() {
		this.each(function(){

			// Our vars
			var $moduleHolder = $(this),
				$moduleControls = $moduleHolder.find('.js-tab-control'),
				$moduleContents = $moduleHolder.find('.js-tab-content'),
				$firstModuleControl = $moduleHolder.find('.js-tab-control:first-of-type'),
				$firstModuleContent = $moduleHolder.find('.js-tab-content:first');

			// Show our first tab
			$firstModuleContent.show();
			$firstModuleControl.addClass('active');

			// On click on tab control
			$moduleControls.click(function(e){
				e.preventDefault();

				var $this = $(this),
					$thisIndex = $(this).index(),
					$thisModuleContent = $('.js-tab-content').eq($thisIndex);
					//console.log($thisIndex);


				if( windowWidth < 769 ){
					//
					// Shift tabs in accordions
					if(!$(this).hasClass('active')){
						$moduleControls.removeClass('active');
						$moduleContents.hide();
					}

					$(this).toggleClass('active');
					$thisModuleContent.slideToggle();

					gMapsCallback();
					return;
				}

				//
				// usual tabs
				$moduleControls.removeClass('active');
				$moduleContents.hide();

				$this.addClass('active');
				$thisModuleContent.show();

				gMapsCallback();

			});

		});
	};

	$('.js-tab-area').tabs();

	$.fn.accordion = function() {
		this.each(function(){

			var $moduleHolder = $(this),
				$moduleControl = $moduleHolder.find('.js-accordion-control'),
				$firstModuleItem = $moduleHolder.find('.js-accordion-item:first'),
				$firstModuleContent = $moduleHolder.find('.js-accordion-content:first');

			// Show our first bit of content and activate the first item
			if( !$moduleHolder.hasClass('header') && !$moduleHolder.hasClass('footer') && !$moduleHolder.hasClass('tabs-module')){
				$firstModuleContent.show();
				$firstModuleItem.addClass('active');
			}

			// On click on module control
			$moduleControl.click(function(e){
				e.preventDefault();

				var $this = $(this),
					$thisModuleItem = $this.closest('.js-accordion-item'),
					$thisModuleContent = $this.next('.js-accordion-content'),
					$activeModuleItems = $moduleHolder.find('.js-accordion-item.active'),
					$activeModuleContents = $activeModuleItems.find('.js-accordion-content');

				//$thisModuleItem.toggleClass('active');

				// Open this module
				if (!$thisModuleItem.hasClass('active')) {
					$thisModuleItem.addClass('active');
					$thisModuleContent.stop(1,1).slideDown(300, "easeOutQuad");
				}

				// Deactivate open modules
				$activeModuleItems.removeClass('active');
				$activeModuleContents.slideUp(300, "easeOutQuad");

			});


		});
	};
	$('.js-accordion-area').accordion();

	$.fn.slideshow = function() {
		this.each(function(){

			var $moduleHolder = $(this),
				$moduleWrapper = $moduleHolder.find('.js-slideshow-wrapper'),
				$moduleItem = $moduleHolder.find('.js-slideshow-item'),
				$firstModuleItem = $moduleHolder.find('.js-slideshow-item:first'),
				moduleItemLength = $moduleItem.length,
				moduleHolderWidth = $moduleHolder.width(),
				accumalativeWidth = 0,
				current = 0,
				$moduleNavigation = $('<div class="slideshow-controller grid-2"><div class="prev grid-4"><a href="#" class="icon-prev disabled"><span>Prev</span></a></div><div class="next grid-4"><a href="#" class="icon-next"><span>Next</span></a></div></div>'),
				$navControls = $moduleNavigation.find('a'),
				$navPrev = $moduleNavigation.find('.icon-prev'),
				$navNext = $moduleNavigation.find('.icon-next');

			// Activate the first item
			$firstModuleItem.addClass('active');

			if (moduleItemLength > 1){

				// Adjust the item widths
				$moduleItem.width(moduleHolderWidth);


				// Get wrapper width
				$moduleItem.each(function(){
					var thisItemWidth = $(this).width();
					if(thisItemWidth > accumalativeWidth) {
						accumalativeWidth = thisItemWidth + 40;
					} else {
						accumalativeWidth += (thisItemWidth + 40);
					}
					$moduleWrapper.width(accumalativeWidth);
				});


				// Insert Navigation
				$moduleWrapper.before($moduleNavigation);


				// Animate to next slide
				$navNext.bind('click', function(e){
					e.preventDefault();
					if (current !== moduleItemLength-1) {
						current++;
						moveTo(current);
					}
				});


				// Animate to previous slide
				$navPrev.bind('click', function(e){
					e.preventDefault();
					if (current !== 0) {
						current--;
						moveTo(current);
					}
				});

			}


			// Animate slider
			function moveTo(current){

				var $el = $moduleItem.eq(current),
					pos = $el.position(),
					opt = { 'left': -pos.left };

				// Animate to new position
				$moduleWrapper.stop().animate(opt, 300, 'easeOutQuad');

				// If at the beginning or end
				$navControls.removeClass('disabled');
				if (current === 0) {
					$navPrev.addClass('disabled');
				} else if (current === moduleItemLength-1) {
					$navNext.addClass('disabled');
				}

				// Sort active classes
				$moduleItem.removeClass('active');
				$moduleItem.eq(current).addClass('active');

			}


		});
	};

	$('.js-slideshow-area').slideshow();


	/* Resize of Slideshows */
	$.fn.slideshowResize = function() {
		this.each(function(){

			var $moduleHolder = $(this),
				$moduleWrapper = $moduleHolder.find('.js-slideshow-wrapper'),
				$moduleItem = $moduleHolder.find('.js-slideshow-item'),
				$activeItem = $moduleHolder.find('.js-slideshow-item.active'),
				moduleHolderWidth = $moduleHolder.width(),
				accumalativeWidth = 0;

			// readjust widths
			$moduleItem.width(moduleHolderWidth);
			$moduleItem.each(function(){
				accumalativeWidth += $(this).width();
			});
			$moduleWrapper.width(accumalativeWidth);

			var $el = $activeItem,
				pos = $el.position();

			// animate to new position
			$moduleWrapper.css({ 'left': -pos.left });

		});
	};


	/* Make Custom Checkboxes */
	$.fn.checkboxes = function() {
		this.each(function(){

			var $customCheckbox = $(this),
				$fauxCheckbox = $('<div class="faux-checkbox"></div>');

			// Setup new checkbox
			$customCheckbox.hide();
			$customCheckbox.after($fauxCheckbox);

			// Click of checkbox
			$fauxCheckbox.click(function(){
				var $this = $(this);
				if (!$this.hasClass('active')) {
					$this.addClass('active');
					$customCheckbox.prop('checked', true);
					$customCheckbox.attr('checked', true);
				} else {
					$this.removeClass('active');
					$customCheckbox.prop('checked', false);
					$customCheckbox.attr('checked', false);
				}
			});

		});
	};

	$('.sys_cms-form-item.sys_checkbox input, .custom-checkbox').checkboxes();


	/* Make Custom Radio Buttons */
	$.fn.radios = function() {
		this.each(function(){

			var $customRadio = $(this),
				$allCustomRadios = $('.custom-radio'),
				$fauxRadio = $('<div class="faux-radio"></div>');

			// Setup new radio btn
			$customRadio.hide();
			$customRadio.after($fauxRadio);

			// Click of radio btn
			$fauxRadio.click(function(){
				var $this = $(this),
					thisGroup = $this.prev('.custom-radio').attr('name'),
					$theseCustomRadios = $('.custom-radio[name="'+thisGroup+'"]'),
					$theseFauxRadios = $theseCustomRadios.next('.faux-radio');

				$theseFauxRadios.removeClass('active');
				$theseCustomRadios.prop('checked', false);
				$theseCustomRadios.attr('checked', false);

				if (!$this.hasClass('active')) {
					$this.addClass('active');
					$customRadio.prop('checked', true);
					$customRadio.attr('checked', true);
				}

			});

		});
	};

	$('.sys_cms-form-item.sys_radio input, .custom-radio').radios();


	/* Rating */
	$('#star').raty({
		number:6,
		size:24,
		target:'#hint',
		targetKeep:true,
		path:'img'
	});


	/* Responsive videos */
	$(".video-container").fitVids();




	/* Setup Date Pickers */
	$.fn.datepickers = function() {
		this.each(function(){

			var $this = $(this),
				thisId = $this.attr('id'),
				whatField = $('#'+thisId)[0],
				today = moment().format('Do MM YYYY');

			var picker = new Pikaday({
				field: whatField,
				bound: true,
				format: 'DD.MM.YYYY',
				firstDay: 1,
				defaultDate: today,
				setDefaultDate: true
			});

		});
	};

	$('.date-picker').datepickers();


	/* Initialise Audio */
	$('audio').mediaelementplayer({
		enablePluginDebug: false,
		audioWidth: 960,
		audioHeight: 65,
	    startVolume: 0.7,
	    loop: false,
	    pluginPath: 'js/mediaelement/',
	    flashName: 'flashmediaelement.swf',
	    enableAutosize: true,
	    autosizeProgress: true,
	    features: ['playpause','current','progress','duration','volume'],
	    alwaysShowControls: true,
	    iPadUseNativeControls: false,
	    iPhoneUseNativeControls: false,
	    AndroidUseNativeControls: false,
	    alwaysShowHours: false,
	    showTimecodeFrameCount: false,
	    framesPerSecond: 25,
	    enableKeyboard: true,
	    pauseOtherPlayers: true
	});


	/* Initialise Custom Select */
	$('.sys_dropdown select, .sys_timesubelement select, .custom-dropdown').customSelect();

	//Zengenti - Image Selection Functionality
	$('.sys_cms-form-item.image-selection').each(function(index, el) {
		$formfields = el;
		//console.log(index);
		$('.form-container > .image-selection').eq(index).find('.image-wrap').each(function(index, el) {
			$imagedetails = el;
			$($formfields).find('span:eq('+index+')').append($($imagedetails)).find('img').unwrap();
		});
	});

	//
	// Enhance mobile menu
	$.fn.EnhanceMobMenu = function(){

		this.each(function(){
			var $menu = $(this).addClass('enhance'),
					$dropd = $menu.find('> ul, > .mobile-nav-container');

			$menu.click(function(e){
				$menu.toggleClass('active');
				$dropd.slideToggle(250);
			});

		});

	};

	//
	// Col height helper
	$.fn.fixColHeights = function() {

		this.each(function(){

			var $wrap = $(this),
					$els = $wrap.find('> li, .twitter-container').css('overflow','visible').height('auto'),
					oh,
					t = 0;

			$els.each(function(){
				var oh = $(this).outerHeight();
				if ( oh > t ){
					t = oh;
				}
			});

			$els.css('overflow','hidden').height(t);

		});
	};

	//
	// mobile smaller accordions / only come into play at 480
	$.fn.mobileAcords = function(){

		this.each(function(){

			var $menu = $(this),
					$dropd = $menu.next().hide();

			$menu.click(function(e){
				e.preventDefault();
				$menu.toggleClass('active');
				$dropd.slideToggle(250);
			});

		});
	}

	//
	// window re flow fixes / switching between mobile / tablet and desktop
	function rflow(){

		if(windowWidth < 691 ){
			$('.mobile-nav-container').attr('style','');
			$('.links-module ul.grid-8 > li').attr('style',''); //rm fix col heights
		}else{
			$('.mobile-nav-container, .keyword-container > ul, .related-video-container, .filter .gamma, .refine-column').css('display','block');
			$('.links-module ul.grid-8, .twitter-module').fixColHeights();
		}
	};



	//
	// mobile navigation fixes
	if(isTouch || windowWidth < 691){
		$('.nav, .mobile-nav, .mobile-footer').EnhanceMobMenu();
	}

	$('.keywords-module h3, .related-video-module h2, .directory-module .filter h3, .results-module h3.mobile-refine').mobileAcords();
	$('.payments-container ul').fixColHeights();

	//
	// Main resize function
	$(window).resize(function(){
		delay(function(){
			windowWidth = $(window).width();
			rflow();
			if (!$html.is('.lt-ie9')) {
				$('.js-slideshow-area').slideshowResize();
			}
		},100);
	});

	rflow();

})(jQuery);

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
  return -c *(t/=d)*(t-2) + b;
}});

var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

function gMapsCallback(){

	$('.js-map').each(function(){

		var $this = $(this),
			mymarkers = [],
			$tabsMap = $this.find('.map'),
			mapID = $tabsMap.attr('id'),
			$mapPoints = $this.find('.js-map-point'),
			mapOptions = {
				zoom: 10,
				center: new google.maps.LatLng(0, 0),
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false,
				maxZoom: 16
			},
			map = new google.maps.Map(document.getElementById(mapID), mapOptions),
			places = new Array();

		$mapPoints.each(function(n){
			var $thisPoint = $(this),
				pointLat = parseFloat($thisPoint.find('.js-map-point__lat').text()),
				pointLong = parseFloat($thisPoint.find('.js-map-point__long').text()),
				pointTitle = $thisPoint.find('.js-map-point__title').text(),
				pointDescription = $thisPoint.find('.js-map-point__description').html(),
				place = new Array(pointTitle,pointLat,pointLong,pointDescription);

			places.push(place);


			$thisPoint.click(function(e){
				e.preventDefault();
				openMarker(n);
			});

		});

		function setMarkers(map, locations) {
			var bounds = new google.maps.LatLngBounds(),
				infowindow = new google.maps.InfoWindow(),
				marker,
				image = new google.maps.MarkerImage("../img/retina-marker.png", null, null, null, new google.maps.Size(24,24));

			for (var i = 0; i < locations.length; i++) {

				var place = locations[i],
					myLatLng = new google.maps.LatLng(place[1], place[2]);

				marker = new google.maps.Marker({
					position: myLatLng,
					map: map,
					icon: image,
					title: place[0],
					html: "<h1>"+place[0]+"</h1>"+place[3]+""
				});

				mymarkers.push(marker);

				google.maps.event.addListener(marker, "click", function () {
					infowindow.setContent(this.html);
					infowindow.open(map, this);
				});

				bounds.extend(myLatLng);

			}

			map.fitBounds(bounds);
		}

		setMarkers(map, places);

		function openMarker(i){
			google.maps.event.trigger(mymarkers[i], 'click');
		}

	});
}



