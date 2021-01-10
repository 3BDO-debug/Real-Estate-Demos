"use strict";

function pieChart() {
	
	//circle progress bar
	if (jQuery().easyPieChart) {
		var count = 0 ;
		// var colors = ['#55bce9', '#7370b5', '#6496cf'];
		var colors = ['#c14240'];

		jQuery('.chart').each(function(){
			
			var imagePos = jQuery(this).offset().top;
			var topOfWindow = jQuery(window).scrollTop();
			if (imagePos < topOfWindow+900) {

				jQuery(this).easyPieChart({
			        barColor: colors[count],
					trackColor: '#ffffff',
					scaleColor: false,
					scaleLength: false,
					lineCap: 'butt',
					lineWidth: 20,
					size: 270,
					rotate: 0,
					animate: 3000,
					onStep: function(from, to, percent) {
							jQuery(this.el).find('.percent').text(Math.round(percent));
						}
			    });
			}
			count++;
			if (count >= colors.length) { count = 0};
		});
	}
}

function affixSidebarInit() {
	var $affixAside = jQuery('.affix-aside');
	if ($affixAside.length) {
			
			//on stick and unstick event
			
			$affixAside.on('affix.bs.affix', function(e) {
				var affixWidth = $affixAside.width();
				var affixLeft = $affixAside.offset().left;
				$affixAside
					.width(affixWidth)
					.css("left", affixLeft);
			}).on('affix-top.bs.affix affix-bottom.bs.affix', function(e) {
				$affixAside.css({"width": "", "left": ""});
			});
			

			//counting offset
			var offsetTop = $affixAside.offset().top - jQuery('.page_header').height();
			var offsetBottom = jQuery('.page_footer').outerHeight(true) + jQuery('.page_copyright').outerHeight(true);
			
				$affixAside.affix({
					offset: {
						top: offsetTop,
						bottom: offsetBottom
					},
				});

			$affixAside.affix('checkPosition');
			jQuery(window).trigger('resize');


			jQuery(window).on('resize', function() {

				$affixAside.css({"width": "", "left": ""});

				var offsetTop = $affixAside.offset().top - jQuery('.page_header').height();
				var offsetBottom = jQuery('.page_footer').outerHeight(true) + jQuery('.page_copyright').outerHeight(true);
				
				$affixAside.data('bs.affix').options.offset.top = offsetTop;
				$affixAside.data('bs.affix').options.offset.bottom = offsetBottom;
				
				$affixAside.affix('checkPosition');

			});

	}//eof checking of affix sidebar existing
}

//function that initiating template plugins on document.ready event
function documentReadyInit() {
	///////////
	//Plugins//
	///////////
    //contact form processing
    jQuery('form.contact-form').on('submit', function( e ){
        e.preventDefault();
        var $form = jQuery(this);
        jQuery($form).find('span.contact-form-respond').remove();

        //checking on empty values
        jQuery($form).find('[aria-required="true"], [required]').each(function(index) {
        	if (!jQuery(this).val().length) {
        		jQuery(this).addClass('invalid').on('focus', function(){jQuery(this).removeClass('invalid')});
        	}
        });
        //if one of form fields is empty - exit
        if ($form.find('[aria-required="true"], [required]').hasClass('invalid')) {
        	return;
        }


        //sending form data to PHP server if fields are not empty
        var request = $form.serialize();
        var ajax = jQuery.post( "contact-form.php", request )
            .done(function( data ) {
                jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">'+data+'</span>');
        	})
            .fail(function( data ) {
                jQuery($form).find('[type="submit"]').attr('disabled', false).parent().append('<span class="contact-form-respond highlight">Mail cannot be sent. You need PHP server to send mail.</span>');
        	})
    });


	//search modal
	jQuery(".search_modal_button").on('click', function(e){
		e.preventDefault();
		jQuery('#search_modal').modal('show').find('input').first().focus();
	});
	
	//search form processing
    jQuery('form.searchform').on('submit', function( e ){
        
        e.preventDefault();
        var $form = jQuery(this);
        var $searchModal = jQuery('#search_modal');
        $searchModal.find('div.searchform-respond').remove();

        //checking on empty values
        jQuery($form).find('[type="text"]').each(function(index) {
        	if (!jQuery(this).val().length) {
        		jQuery(this).addClass('invalid').on('focus', function(){jQuery(this).removeClass('invalid')});
        	}
        });
        //if one of form fields is empty - exit
        if ($form.find('[type="text"]').hasClass('invalid')) {
        	return;
        }

        $searchModal.modal('show');
        //sending form data to PHP server if fields are not empty
        var request = $form.serialize();
        var ajax = jQuery.post( "search.php", request )
	        .done(function( data ) {
	            $searchModal.append('<div class="searchform-respond">'+data+'</div>');
	    	})
	        .fail(function( data ) {
	        	$searchModal.append('<div class="searchform-respond">Search cannot be done. You need PHP server to search.</div>');
	            
	    	})
    });
    
    //mailchimp subscribe form processing
    jQuery('.signup').on('submit', function( e ) {
        e.preventDefault();
        var $form = jQuery(this);
        // update user interface
        $form.find('.response').html('Adding email address...');
        // Prepare query string and send AJAX request
        jQuery.ajax({
            url: 'mailchimp/store-address.php',
            data: 'ajax=true&email=' + escape($form.find('.mailchimp_email').val()),
            success: function(msg) {
                $form.find('.response').html(msg).fadeIn().delay(3000).fadeOut();;
            }
        });
    });
	
	//twitter
	//slide tweets
	jQuery('#tweets .twitter').bind('loaded', function(){
		jQuery(this).addClass('flexslider').find('ul').addClass('slides');
	});
	if (jQuery().tweet) {
		jQuery('.twitter').tweet({
			modpath: "./twitter/",
		    count: 2,
		    avatar_size: 48,
		    loading_text: 'loading twitter feed...',
		    join_text: 'auto',
		    username: 'ThemeForest', 
		    template: "{avatar}<div class=\"tweet_right\">{time}{join}<span class=\"tweet_text\">{tweet_text}</span></div>"
		});
	}


	//mainmenu
	if (jQuery().superfish) {
		jQuery('ul.sf-menu').superfish({
			delay:       300,
			animation:   {opacity:'show'},
			animationOut: {opacity: 'hide'},
			speed:       'fast',
			disableHI:   false,
			cssArrows:   true,
			autoArrows:  true
		});
	}

	//toggle mobile menu
	jQuery('.toggle_menu').on('click', function(){
		jQuery('.toggle_menu').toggleClass('mobile-active');
		jQuery('.page_header').toggleClass('mobile-active');
	});

	jQuery('.mainmenu a').on('click', function(){
		if (!jQuery(this).hasClass('sf-with-ul')) {
			jQuery('.toggle_menu').toggleClass('mobile-active');
			jQuery('.page_header').toggleClass('mobile-active');
		}
	});
		
    
	//single page localscroll and scrollspy
	var navHeight = jQuery('.page_header').outerHeight(true);
	jQuery('body').scrollspy({
		target: '.mainmenu_wrapper',
		offset: navHeight
	});
	if (jQuery().localScroll) {
		jQuery('.mainmenu, #land').localScroll({
			duration:900,
			easing:'easeInOutQuart',
			offset: -navHeight+10
		});
	}

	//toTop
	if (jQuery().UItoTop) {
        jQuery().UItoTop({ easingType: 'easeOutQuart' });
    }

	//parallax
	if (jQuery().parallax) {
		jQuery('.parallax').parallax("50%", 0.01);
	}
	
    //prettyPhoto
    if (jQuery().prettyPhoto) {
	   	jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({
	   		hook: 'data-gal',
			theme: 'facebook' /* light_rounded / dark_rounded / light_square / dark_square / facebook / pp_default*/
	  	});
	}


   	//carousel
   	if (jQuery().carousel) {
		jQuery('.carousel').carousel();
	}

	//owl carousel
	if (jQuery().owlCarousel) {
		jQuery('.owl-carousel').each(function() {
			var $carousel = jQuery(this);
			var loop = $carousel.data('loop') ? $carousel.data('loop') : false;
			var margin = ($carousel.data('margin') || $carousel.data('margin') == 0) ? $carousel.data('margin') : 30;
			var nav = $carousel.data('nav') ? $carousel.data('nav') : false;
			var dots = $carousel.data('dots') ? $carousel.data('dots') : false;
			var themeClass = $carousel.data('themeclass') ? $carousel.data('themeclass') : 'owl-theme';
			var center = $carousel.data('center') ? $carousel.data('center') : false;
			var items = $carousel.data('items') ? $carousel.data('items') : 4;
			var autoplay = $carousel.data('autoplay') ? $carousel.data('autoplay') : false;
			var responsiveXs = $carousel.data('responsive-xs') ? $carousel.data('responsive-xs') : 1;
			var responsiveSm = $carousel.data('responsive-sm') ? $carousel.data('responsive-sm') : 2;
			var responsiveMd = $carousel.data('responsive-md') ? $carousel.data('responsive-md') : 3;
			var responsiveLg = $carousel.data('responsive-lg') ? $carousel.data('responsive-lg') : 4;
			// var responsive = $carousel.data('responsive') ? jQuery.parseJSON($carousel.data('responsive')) : {0:{items:1},767:{items:2},992:{items:2},1200:{items: 4}};

			$carousel.owlCarousel({
				loop: loop,
				margin: margin,
				nav: nav,
				autoplay: autoplay,
				dots: dots,
				themeClass: themeClass,
				center: center,
				items: items,
				responsive: {
					0:{
						items: responsiveXs
					},
					767:{
						items: responsiveSm
					},
					992:{
						items: responsiveMd
					},
					1200:{
						items: responsiveLg
					}
				},
			})
			//custom nav
			// .find('.owl-dots:not([style*="none"])')
			// .wrap('<div class="owl-custom-nav"/>')
			// .before('<div class="owl-custom-prev"><i class="arrow-icon-left-open-big"></i></div>')
			// .after('<div class="owl-custom-next"><i class="arrow-icon-right-open-big"></i></div>')
			// .end()
			// .find(".owl-custom-prev").on('click', function(){
			// 	console.log('prev');
			// 	$carousel.trigger('prev.owl.carousel');
			// })
			// .end()
			// .find(".owl-custom-next").on('click', function(){
			// 	console.log('next');
			// 	$carousel.trigger('next.owl.carousel');
			// });
		});

	} //eof owl-carousel

	//comingsoon counter
	if (jQuery().countdown) {
		//today date plus month for demo purpose
		var demoDate = new Date();
		demoDate.setMonth(demoDate.getMonth()+1);
		jQuery('#comingsoon-countdown').countdown({until: demoDate});
	}


	/////////
	//shop///
	/////////
	jQuery('#toggle_shop_view').on('click', function( e ) {
		e.preventDefault();
		jQuery(this).toggleClass('grid-view');
		jQuery('#products').toggleClass('grid-view list-view');
	});
	
	//zoom image
	if (jQuery().elevateZoom) {
		jQuery('#product-image').elevateZoom({
			gallery: 'product-image-gallery',
			cursor: 'pointer', 
			galleryActiveClass: 'active', 
			responsive:true, 
			loadingIcon: 'img/AjaxLoader.gif'
		});
	}
	
	//add review button
	jQuery('.review-link').on('click', function( e ) {
		var thisLink = jQuery(this);
		var reviewTabLink = jQuery('a[href="#reviews_tab"]');
		//show tab only if it's hidden
		if (!reviewTabLink.parent().hasClass('active')) {
			reviewTabLink
				.tab('show')
				.on('shown.bs.tab', function (e) {
					jQuery(window).scrollTo(jQuery(thisLink).attr('href'), 400);
				})
		}
		jQuery(window).scrollTo(jQuery(thisLink).attr('href'), 400);
	});

	//product counter
	jQuery('.plus, .minus').on('click', function( e ) {
		var numberField = jQuery(this).parent().find('[type="number"]');
		var currentVal = numberField.val();
		var sign = jQuery(this).val();
		if (sign === '-') {
			if (currentVal > 1) {
				numberField.val(parseFloat(currentVal) - 1);
			}
		} else {
			numberField.val(parseFloat(currentVal) + 1);
		}
	});
	
	//remove product from cart
	jQuery('a.remove').on('click', function( e ) {
		e.preventDefault();
		jQuery(this).closest('tr, .media').remove();
	});

	//price filter
	if (jQuery().slider) {
		jQuery( ".slider-range-price" ).slider({
	      range: true,
	      min: 0,
	      max: 100000,
	      values: [ 1500, 30000 ],
	      slide: function( event, ui ) {
	        	jQuery( ".slider_price_min" ).val( ui.values[ 0 ] );
	        	jQuery( ".slider_price_max" ).val( ui.values[ 1 ] );
	      }
	    });
	    jQuery( ".slider_price_min" ).val( jQuery( ".slider-range-price" ).slider( "values", 0 ) );
	    jQuery( ".slider_price_max" ).val( jQuery( ".slider-range-price" ).slider( "values", 1 ) );
	}

	//color filter 
	jQuery(".color-filters").find("a[data-background-color]").each(function() {
		jQuery(this).css({"background-color" : jQuery(this).data("background-color")});
	});

	//adding CSS classes for elements that needs different styles depending on they widht width
	//see 'plugins.js' file
	jQuery('#mainteasers .col-lg-4').addWidthClass({
		breakpoints: [500, 600]
	});


	//background image teaser
	jQuery(".bg_teaser").each(function(){
		var $teaser = jQuery(this);
		var imagePath = $teaser.find("img").first().attr("src");
		$teaser.css("background-image", "url(" + imagePath + ")");
		if (!$teaser.find('.bg_overlay').length) {
			$teaser.prepend('<div class="bg_overlay"/>');
		}
	});

	//bootstrap tab - show first tab 
	jQuery('.nav-tabs').each(function() {
		jQuery(this).find('a').first().tab('show');
	});
	jQuery('.tab-content').each(function() {
		jQuery(this).find('.tab-pane').first().addClass('fade in');
	});

	//bootstrap collapse - show first tab 
	jQuery('.panel-group').each(function() {
		jQuery(this).find('a').first().filter('.collapsed').trigger('click');
	});
}//eof documentReadyInit

//function that initiating template plugins on window.load event
function windowLoadInit() {
	//tooltip
   	if (jQuery().tooltip) {
		jQuery('[data-toggle="tooltip"]').tooltip();
	}
		
	//chart
	pieChart();

	
	//flexslider
	if (jQuery().flexslider) {
		var $introSlider = jQuery(".intro_section .flexslider");
		$introSlider.each(function(index){
		// if ($introSlider.length) {
				var $currentSlider = jQuery(this);
				$currentSlider.flexslider({
				animation: "fade",
				pauseOnHover: true, 
				useCSS: true,
				controlNav: true,   
				directionNav: false,
			    prevText: "",
			    nextText: "",
				smoothHeight: false,
				slideshowSpeed:10000,
				animationSpeed:600,
				start: function( slider ) {
						slider.find('.slide_description').children().css({'visibility': 'hidden'});
							slider.find('.flex-active-slide .slide_description').children().each(function(index){
							var self = jQuery(this);
							var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
							setTimeout(function(){
								self.addClass("animated "+animationClass);
							}, index*200);
						});
					},
				after :function( slider ){
						slider.find('.flex-active-slide .slide_description').children().each(function(index){
							var self = jQuery(this);
							var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
							setTimeout(function(){
								self.addClass("animated "+animationClass);
							}, index*200);
						});
					},
				end :function( slider ){
						slider.find('.slide_description').children().each(function() {
							var self = jQuery(this);
							var animationClass = !self.data('animation') ? 'fadeInRight' : self.data('animation');
							self.removeClass('animated ' + animationClass).css({'visibility': 'hidden'});
							// jQuery(this).attr('class', '');
						});
					},
				
				// });
			})
			//wrapping nav with container
			.find('.flex-control-nav')
				.wrap('<div class="container nav-container"/>')
			//adding custom nav
			// .find('.flex-control-nav')
			// 	.wrap('<div class="flex-custom-nav"/>')
			// 	.before('<a class="flex-custom-prev flex-custom-link" href="#"><i class="arrow-icon-left-open-big"></i></a>')
			// 	.after('<a class="flex-custom-next flex-custom-link" href="#"><i class="arrow-icon-right-open-big"></i></a>');
			
			// //custom nav processing
			// $currentSlider.find('.flex-custom-prev').on('click', function(e){
			// 	e.preventDefault();
			// 	$currentSlider.flexslider('prev');
			// });
			// $currentSlider.find('.flex-custom-next').on('click', function(e){
			// 	e.preventDefault();
			// 	$currentSlider.flexslider('next');
			// });
		
		});

		//}//eof introSlider check

		jQuery(".flexslider").each(function(index){
			var $currentSlider = jQuery(this);
			//exit if intro slider already activated 
			if ($currentSlider.find('.flex-active-slide').length) {
				return;
			}
			$currentSlider.flexslider({
				animation: "fade",
				useCSS: true,
				controlNav: false,   
				directionNav: true,
			    prevText: "Previous",
			    nextText: "Next",
				smoothHeight: false,
				slideshowSpeed:5000,
				animationSpeed:800,
				// after :function( slider ){
				// }
			})
			//adding custom nav
			// .find('.flex-control-nav')
			// 	.wrap('<div class="flex-custom-nav"/>')
			// 	.before('<a class="flex-custom-prev flex-custom-link" href="#"><i class="arrow-icon-left-open-big"></i></a>')
			// 	.after('<a class="flex-custom-next flex-custom-link" href="#"><i class="arrow-icon-right-open-big"></i></a>');
			
			// //custom nav processing
			// $currentSlider.find('.flex-custom-prev').on('click', function(e){
			// 	e.preventDefault();
			// 	$currentSlider.flexslider('prev');
			// });
			// $currentSlider.find('.flex-custom-next').on('click', function(e){
			// 	e.preventDefault();
			// 	$currentSlider.flexslider('next');
			// });
		});
	}

	////////////////////
	//header processing/
	////////////////////
		//stick header to top
			//wrap header with div for smooth sticking
	var $header = jQuery('.page_header').first();
	if ($header.length) {
		var headerHeight = $header.outerHeight();
		$header.wrap('<div class="page_header_wrapper"></div>').parent().css({height: headerHeight}); //wrap header for smooth stick and unstick

			//get offset
		var headerOffset = 0;
		//check for sticked template headers
		// if (!jQuery(document).scrollTop()) {
		// if (jQuery(document).scrollTop() < $header.offset().top) {
			headerOffset = $header.offset().top;

		// }
		// }
		jQuery($header).affix({
			offset: {
				top: headerOffset,
				bottom: 0
			}
		});
			//if header has different height on afixed and affixed-top positions - correcting wrapper height
		jQuery($header).on('affixed-top.bs.affix', function () {
			$header.parent().css({height: $header.outerHeight()});
		});
	}

	///////////////
	//aside affix//
	///////////////
	affixSidebarInit();

	//preloader
	jQuery(".preloaderimg").fadeOut();
	jQuery(".preloader").delay(200).fadeOut("slow").delay(200, function(){
		jQuery(this).remove();
	});

	jQuery('body').scrollspy('refresh');


	
	//animation to elements on scroll
	if (jQuery().appear) {
		jQuery('.to_animate').appear();
		jQuery('.to_animate').filter(':appeared').each(function(index){
			var self = jQuery(this);
			var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
			var animationDelay = !self.data('delay') ? 210 : self.data('delay');
			setTimeout(function(){
				self.addClass("animated " + animationClass);
			}, index * animationDelay);
		});

		jQuery('body').on('appear', '.to_animate', function(e, $affected ) {
			jQuery($affected).each(function(index){
				var self = jQuery(this);
				var animationClass = !self.data('animation') ? 'fadeInUp' : self.data('animation');
				var animationDelay = !self.data('delay') ? 210 : self.data('delay');
				setTimeout(function(){
					self.addClass("animated " + animationClass);
				}, index * animationDelay);
			});
		});
	}

	//counters init on scroll
	if (jQuery().appear) {
		jQuery('.counter').appear();
		jQuery('.counter').filter(':appeared').each(function(index){
			if (jQuery(this).hasClass('counted')) {
				return;
			} else {
				jQuery(this).countTo().addClass('counted');
			}
		});
		jQuery('body').on('appear', '.counter', function(e, $affected ) {
			jQuery($affected).each(function(index){
				if (jQuery(this).hasClass('counted')) {
					return;
				} else {
					jQuery(this).countTo().addClass('counted');
				}
				
			});
		});
	}

	//bootstrap animated progressbar
	if (jQuery().appear) {
		if (jQuery().progressbar) {
			jQuery('.progress .progress-bar').appear();
			jQuery('.progress .progress-bar').filter(':appeared').each(function(index){
				jQuery(this).progressbar({
			        transition_delay: 300
			    });
			});
			jQuery('body').on('appear', '.progress .progress-bar', function(e, $affected ) {
				jQuery($affected).each(function(index){
					jQuery(this).progressbar({
				        transition_delay: 300
				    });
				});
			});
			//animate progress bar inside bootstrap tab
			jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
				jQuery(jQuery(e.target).attr('href')).find('.progress .progress-bar').progressbar({
			        transition_delay: 300
			    });
			});
		}
	}


	//flickr
	// use http://idgettr.com/ to find your ID
	if (jQuery().jflickrfeed) {
		jQuery("#flickr").jflickrfeed({
			flickrbase: "http://api.flickr.com/services/feeds/",
			limit: 8,
			qstrings: {
				id: "131791558@N04"
			},
			itemTemplate: '<a href="{{image_b}}" data-gal="prettyPhoto[pp_gal]"><li><img alt="{{title}}" src="{{image_s}}" /></li></a>'
		}, function(data) {
			jQuery("#flickr a").prettyPhoto({
				hook: 'data-gal',
				theme: 'facebook'
	   		});
		});
	}


	//video images preview
	jQuery('.embed-placeholder').each(function(){
		jQuery(this).on('click', function(e) {
			e.preventDefault();
			jQuery(this).replaceWith('<iframe class="embed-responsive-item" src="'+ jQuery(this).attr('href') + '?rel=0&autoplay=1'+ '"></iframe>');
		});
	});

	//select change color
	jQuery('#select').css('color','#bebebe');
	jQuery('#select').change(function() {
		var current = $('#select').val();
		if (current != 'null') {
		  	jQuery('#select').css({
			   	'color' : '#1a1a1a',
			   	'font-style' : 'normal'
			});
		  	//$('#select').css('font-style','normal');
		} else {
		  	$('#select').css('color','#bebebe');
		}
	}); 
	jQuery('.select_custom_color','form').css('color','#bebebe');
	jQuery('.select_custom_color','form').change(function() {
		var current = $(this).val();
		if (current != 'null') {
		  	jQuery(this).css({
			   	'color' : '#1a1a1a',
			   	'font-style' : 'normal'
			});
		  	//$('#select').css('font-style','normal');
		} else {
		  	$(this).css('color','#bebebe');
		}
	}); 

	
}//eof windowLoadInit


function googlemap_init() {

	if (jQuery('#google_map_init').length > 0) {
		var infowindow = null;

	    function initialize() {

	        var centerMap = new google.maps.LatLng(40.604211, -74.133907);

	        var styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

	        var myOptions = {
	            zoom: 16,
	            center: centerMap,
	            styles: styles,
	            scrollwheel: false,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        }

	        var map = new google.maps.Map(document.getElementById("map"), myOptions);

	        setMarkers(map, sites);
	        infowindow = new google.maps.InfoWindow({
	                content: "loading..."
	            });

	        var bikeLayer = new google.maps.BicyclingLayer();
	        bikeLayer.setMap(map);
	    }


	    if (jQuery("#map.idxmap").length > 0) {
		    var sites = [
			    ['Staten Island', 40.603017, -74.134514, 4, '44 Fillmore Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.603750, -74.137969, 2, '290 Sheraden Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.605966, -74.129858, 1, '234 Perry Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.600723, -74.136601, 5, '89 Joseph Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.600747, -74.129060, 6, '197 Graves St, Staten Island, NY 10314, USA','images/icons/google_marker.png']
			];
		} 
	    if (jQuery("#map.colormap_icon").length > 0) {
		    var sites = [
			    ['Staten Island', 40.603017, -74.134514, 4, '44 Fillmore Ave, Staten Island, NY 10314, USA','images/icons/g-m-1.png'],
			    ['Staten Island', 40.603750, -74.137969, 2, '290 Sheraden Ave, Staten Island, NY 10314, USA','images/icons/g-m-2.png'],
			    ['Staten Island', 40.605966, -74.129858, 1, '234 Perry Ave, Staten Island, NY 10314, USA','images/icons/g-m-3.png'],
			    ['Staten Island', 40.600723, -74.136601, 5, '89 Joseph Ave, Staten Island, NY 10314, USA','images/icons/g-m-4.png'],
			    ['Staten Island', 40.600747, -74.129060, 6, '197 Graves St, Staten Island, NY 10314, USA','images/icons/g-m-5.png'],
			    ['Staten Island', 40.607106, -74.134856, 7, '244-248 Kell Ave, Staten Island, NY 10314, USA','images/icons/g-m-6.png'],
			    ['Staten Island', 40.606707, -74.139600, 3, '183 Martin Ave, Staten Island, NY 10314, USA','images/icons/g-m-7.png']
			];
		} 
		if (jQuery("#map.default").length > 0) {
		    var sites = [
			    ['Staten Island', 40.603017, -74.134514, 4, '44 Fillmore Ave, Staten Island, NY 10314, USA','images/icons/g-m-1.png'],
			    ['Staten Island', 40.603750, -74.137969, 2, '290 Sheraden Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.605966, -74.129858, 1, '234 Perry Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.600723, -74.136601, 5, '89 Joseph Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.600747, -74.129060, 6, '197 Graves St, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.607106, -74.134856, 7, '244-248 Kell Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png'],
			    ['Staten Island', 40.606707, -74.139600, 3, '183 Martin Ave, Staten Island, NY 10314, USA','images/icons/google_marker.png']
			];
		}

		 
	    function setMarkers(map, markers) {

	        for (var i = 0; i < markers.length; i++) {
	            var sites = markers[i];
	            var siteLatLng = new google.maps.LatLng(sites[1], sites[2]);
	            var marker = new google.maps.Marker({
	                position: siteLatLng,
	                map: map,
	                icon: sites[5],
	                //icon: 'images/1/google_marker.png',
	                title: sites[0],
	                zIndex: sites[3],
	                html: sites[4]
	            });

	            var contentString = "Some content";

	            google.maps.event.addListener(marker, "click", function () {
	                // alert(this.html);
	                infowindow.setContent(this.html);
	                infowindow.open(map, this);
	            });
	        }
	    }
    	//googlemap button hide
	    if (jQuery('#googlemap_hide > .googlemap_button:not(.open)').length > 0) {
	        jQuery('#googlemap_hide').on('click', '.googlemap_button', function () {
	            "use strict";
	            jQuery(this).toggleClass("open");
	            jQuery(".googlemap" ,".googlemap_idx").toggleClass("hide");
	            if(!jQuery(this).next().hasClass('itited')) {
	                jQuery(this).next().addClass('itited');
	                setTimeout(function () { initialize(); }, 300);
	            }
			    return false;
	        });
	    } else {
	    	initialize();
	    }
	    // if (jQuery('#googlemap_hide > .googlemap_button.open').length > 0) {
     //        "use strict";
     //        initialize();
	    // }
	}
	
}


jQuery(document).ready(function() {
	documentReadyInit();
	googlemap_init();
}); //end of "document ready" event


jQuery(window).load(function(){
   	windowLoadInit();
}); //end of "window load" event

jQuery(window).resize(function(){

	jQuery('body').scrollspy('refresh');

	//header processing
	var $header = jQuery('.page_header').first();
		//checking document scrolling position
	if ($header.length && !jQuery(document).scrollTop() && $header.first().data('bs.affix')) {
		$header.first().data('bs.affix').options.offset.top = $header.offset().top;
	}
	jQuery(".page_header_wrapper").css({height: $header.first().outerHeight()}); //editing header wrapper height for smooth stick and unstick

	
});

jQuery(window).scroll(function() {
	//circle progress bar
	pieChart();
});