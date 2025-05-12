/*(function($) {
    $(function() {
        var jcarousel = $('.jcarousel').jcarousel();

        $('.jcarousel-control-prev')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-control-next')
            .on('jcarouselcontrol:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        var setup = function(data) {
            var html = '<ul>';

            $.each(data.items, function() {
                html += '<li><img src="' + this.src + '" alt="' + this.title + '"></li>';
            });

            html += '</ul>';

            // Append items
            jcarousel
                .html(html);

            // Reload carousel
            jcarousel
                .jcarousel('reload');
        };

        //$.getJSON('data.json', setup);
    });
})(jQuery);*/


(function($) {
    $(function() {
        var jcarousel = $('.jcarousel');

        jcarousel
            /*.on('jcarousel:reload jcarousel:create', function () {
                var carousel = $(this),
                    width = carousel.innerWidth();

					
                if (width >= 800) {
                    width = width / 6;
				} else {
					if (width >= 400) {
						width = width / 1;		
					}
                }

                carousel.jcarousel('items').css('width', Math.ceil(width) + 'px');
            })*/
            .jcarousel({
                wrap: 'circular'
            });
			
					//Enable swiping...
					$(".jcarousel").swipe( {
						//Generic swipe handler for all directions
						swipeLeft:function(event, direction, distance, duration, fingerCount) {
							target: '-=1' 
						},
						swipeRight: function() {
							target: '+=1'
						},
						//Default is 75px, set to 0 for demo so any distance triggers swipe
						threshold:0
					});		

        $('.jcarousel-control-prev')
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-control-next')
            .jcarouselControl({
                target: '+=1'
            });

        /*$('.jcarousel-pagination')
            .on('jcarouselpagination:active', 'a', function() {
                $(this).addClass('active');
            })
            .on('jcarouselpagination:inactive', 'a', function() {
                $(this).removeClass('active');
            })
            .on('click', function(e) {
                e.preventDefault();
            })
            .jcarouselPagination({
                perPage: 1,
                item: function(page) {
                    return '<a href="#' + page + '">' + page + '</a>';
                }
            });*/
    });
})(jQuery);





(function($) {
    $(function() {
        var jcarousel = $('.jcarousel-pp').jcarousel();

        $('.jcarousel-pp-control-prev')
            .on('jcarouselcontrol-pp:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol-pp:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '-=1'
            });

        $('.jcarousel-pp-control-next')
            .on('jcarouselcontrol-pp:active', function() {
                $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol-pp:inactive', function() {
                $(this).addClass('inactive');
            })
            .jcarouselControl({
                target: '+=1'
            });

        var setup = function(data) {
            var html = '<ul>';

            $.each(data.items, function() {
                html += '<li><img src="' + this.src + '" alt="' + this.title + '"></li>';
            });

            html += '</ul>';

            // Append items
            jcarousel
                .html(html);

            // Reload carousel
            jcarousel
                .jcarousel('reload');
        };

        //$.getJSON('data.json', setup);
    });
})(jQuery);
