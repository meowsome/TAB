window.addEventListener("load", function () {

    //Hashes
    window.location.hash = "main";

    $(window).on('hashchange', function () {
        $("html, body").animate({
            scrollTop: 0
        });
    });

    //Selector
    var timezone;
    $(".selector ul").click(function () {
        var clicks = $(this).data('clicks');
        if (clicks) {
            $(".selector li").removeClass("selector-active");
            $(".selector li").delay(100).hide(0);
        } else {
            $(".selector li").removeClass("selector-main");
            $(".selector li").show(0);
            $(".selector li").delay(100).addClass("selector-active");
        }
        $(this).data("clicks", !clicks);
    });
    $(".selector li").click(function () {
        timezone = $(this).attr('id');
        $(this).addClass("selector-main");
    });


    //Clock
    function updateClock() {
        var timezoneOffset = 0;
        var today = new Date();
        if (localStorage.getItem('timezone') && localStorage.getItem('timezone') !== "undefined") {
            var timezone = localStorage.getItem('timezone');
            if (timezone === "tz-mit") timezoneOffset = -11;
            if (timezone === "tz-hst") timezoneOffset = -10;
            if (timezone === "tz-ast") timezoneOffset = -9;
            if (timezone === "tz-pst") timezoneOffset = -8;
            if (timezone === "tz-pnt") timezoneOffset = -7;
            if (timezone === "tz-mst") timezoneOffset = -7;
            if (timezone === "tz-cst") timezoneOffset = -6;
            if (timezone === "tz-est") timezoneOffset = -5;
            if (timezone === "tz-iet") timezoneOffset = -5;
            if (timezone === "tz-prt") timezoneOffset = -4;
            if (timezone === "tz-cnt") timezoneOffset = -2.5;
            if (timezone === "tz-agt") timezoneOffset = -3;
            if (timezone === "tz-bet") timezoneOffset = -3;
            if (timezone === "tz-cat") timezoneOffset = -1;
            if (timezone === "tz-gmt") timezoneOffset = 0;
            if (timezone === "tz-uct") timezoneOffset = 0;
            if (timezone === "tz-ect") timezoneOffset = 1;
            if (timezone === "tz-eet") timezoneOffset = 2;
            if (timezone === "tz-art") timezoneOffset = 2;
            if (timezone === "tz-eat") timezoneOffset = 3;
            if (timezone === "tz-met") timezoneOffset = 3.5;
            if (timezone === "tz-net") timezoneOffset = 4;
            if (timezone === "tz-plt") timezoneOffset = 5;
            if (timezone === "tz-ist") timezoneOffset = 5.5;
            if (timezone === "tz-bst") timezoneOffset = 6;
            if (timezone === "tz-vst") timezoneOffset = 7;
            if (timezone === "tz-ctt") timezoneOffset = 8;
            if (timezone === "tz-jst") timezoneOffset = 9;
            if (timezone === "tz-act") timezoneOffset = 9.5;
            if (timezone === "tz-aet") timezoneOffset = 10;
            if (timezone === "tz-sst") timezoneOffset = 11;
            if (timezone === "tz-zst") timezoneOffset = 12;
            var utc = parseInt(today.getTime()) + parseInt(today.getTimezoneOffset() * 60000);
            var newDate = new Date(utc + (3600000 * timezoneOffset));
            today.setHours(newDate.getHours());
            today.setMinutes(newDate.getMinutes());
            today.setDate(newDate.getDate());
        }
        var twentyFourHours = today.getHours();
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var date = today.getDate();
        var daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var day = daysArray[today.getDay()];
        var monthsArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = monthsArray[today.getMonth()];
        var year = today.getFullYear();
        var timeExtra = 'PM';
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (hours > 12) {
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }
        if (twentyFourHours < 12) {
            timeExtra = 'AM';
        }
        if (date === 1 || date === 21 || date === 31) {
            var dateExtra = 'st'
        }
        if (date === 2 || date === 22) {
            var dateExtra = 'nd';
        }
        if (date === 3 || date === 23) {
            var dateExtra = 'rd';
        }
        if (date >= 4 && date <= 20 || date >= 24 && date <= 30) {
            var dateExtra = 'th';
        }
        document.getElementById('time').innerHTML = `${hours}:${minutes}`;
        document.getElementById('timeExtra').innerHTML = timeExtra;
        document.getElementById('date').innerHTML = `${day}, ${month} ${date}${dateExtra}, ${year}`;
        setTimeout(updateClock, 1000);
    }
    updateClock();

    //Check if connection successful
    if (typeof jQuery == 'undefined') {
        document.getElementById('weather').style.opacity = "1";
        document.getElementById('weather').innerHTML = '<div class="card-content"><h5>No Internet Connection</h5><p>There was a problem with your connection to the internet, so many things will fail to load. Please check your connection and try again!</p></div>';
        return;
    } else {

        //Background
        function background() {
            var background;
            if (localStorage.getItem('background')) {
                background = localStorage.getItem('background');
            } else {
                background = "images/background.jpg";
            }
            $(".background-image").css('background-image', `url('${background}'`);
        }
        background();

        //Gradient
        function gradient() {
            var gradient;
            if (localStorage.getItem('gradientColor1') && localStorage.getItem('gradientColor2')) {
                gradient = `linear-gradient(180deg, rgba(${localStorage.getItem('gradientColor1')}, 0.2), rgba(${localStorage.getItem('gradientColor2')}, 1))`;
            } else {
                gradient = "linear-gradient(180deg, rgba(86, 180, 211, 0.2), rgba(0, 102, 65, 1))";
            }
            $(".background-gradient").css('background', gradient);
        }
        gradient();


        //Weather
        function weather() {
            var weatherCheck1 = false;
            var weatherCheck2 = false;
            var locationString;
            if (localStorage.getItem('location')) {
                locationString = localStorage.getItem('location');
                document.getElementById('weather-location').innerHTML = `<b>${locationString}</b>`;
                weatherCheck1 = true;
            } else {
                $.getJSON('http://ip-api.com/json/').done(function (location) {
                    locationString = location.city + "," + location.regionName;
                    document.getElementById('weather-location').innerHTML = `<b>${locationString}</b>`;
                    weatherCheck1 = true;

                    setTimeout(function () {
                        $.getJSON('http://api.openweathermap.org/data/2.5/weather', {
                            lat: location.lat,
                            lon: location.lon,
                            units: 'imperial',
                            appid: 'edfe0a04393769fa1ce02028e805580f'
                        }).done(function (weather) {
                            document.getElementById('temperature').innerHTML = weather.main.temp.toFixed(0);
                            document.getElementById('temperatureExtra').innerHTML = '&deg;F';
                            document.getElementById('weather-description').innerHTML = weather.weather[0].main;
                            document.getElementById('weather-icon').src = `images/weather/${weather.weather[0].icon}.svg`;
                            document.getElementById('weather-high').innerHTML = `High: ${weather.main.temp_max.toFixed(0)}&deg;F&nbsp;&nbsp;|&nbsp;&nbsp;`;
                            document.getElementById('weather-low').innerHTML = `Low: ${weather.main.temp_min.toFixed(0)}&deg;F`;
                            weatherCheck2 = true;
                        });
                    }, 500);
                });
            }
            //Weather if error
            setTimeout(function () {
                if (!weatherCheck1 || !weatherCheck2) {
                    document.getElementById('weather-icon').src = "images/weather/3200.svg";
                    document.getElementById('weather-description').innerHTML = 'Weather Error';
                    document.getElementById('weather-high').innerHTML = 'There was a problem with retrieving the weather information. Please try again later.';
                    document.getElementById('weather-low').innerHTML = '';
                    document.getElementById('temperature').innerHTML = '';
                    document.getElementById('temperatureExtra').innerHTML = '';
                }
            }, 1500)
        }
        weather();
        //Weather refresh
        $('#weather-refresh').click(function () {
            weather();
            $('.notification').html('<h7>Updated&nbsp;&nbsp;<i class="fa fa-check"></i></h7>').show(0).delay(100).addClass('notification-visible');
            setTimeout(function () {
                $('.notification').removeClass('notification-visible').delay(100).hide(0);
            }, 5000);
        });

        //News
        function news(ajaxurl) {
            var newsFeeds;
            if (localStorage.getItem('news')) {
                newsFeeds = localStorage.getItem('news').toLocaleLowerCase().replace(/ /g, "+");
            } else {
                newsFeeds = "worldnews+news+uncensorednews";
            }
            $.ajax({
                method: 'GET',
                url: `https://www.reddit.com/r/${newsFeeds}/.json`,
                dataType: 'json',
                success: function (data) {
                    for (var i = 0; i < 7; i++) {
                        var thumbnail;
                        if (data.data.children[i].data.thumbnail_height !== null) {
                            thumbnail = `<img class="card-image" src="${data.data.children[i].data.preview.images[0].source.url}">`;
                        } else {
                            thumbnail = "";
                        }
                        $('#main-content').append(`<a href="${data.data.children[i].data.url}" target="_blank" class="newsPost"><div class="card full-width">${thumbnail}<div class="card-content"><h6>${data.data.children[i].data.title.slice(0,50)}...</h6><p>${data.data.children[i].data.title}</p></div></div></a>`);
                    }
                    //Card animation
                    for (i = 1; i < $('.card').length + 1; i++) {
                        $(`a:nth-child(${i}) .card`).addClass(`slidein-0-${i}s`);
                    }
                },
                error: function () {
                    $('#main-content').append('<div class="card full-width newsPost"><div class="card-content"><h5>News Error</h5><p>There was an error generating the top news stories. Please try again later.</p></div></div>');
                    for (i = 1; i < $('.card').length + 1; i++) {
                        $(`a:nth-child(${i}) .card`).addClass(`slidein-0-${i}s`);
                    }
                }
            })
        }
        news();



        //Parallax
        var scrolled = $(window).scrollTop();
        var half = $('.parallax').height() * -0.05;
        $('.parallax').css('background-position', 'center ' + (half - (scrolled * .25)) + 'px');
        $(window).on('scroll', function () {
            var scrolled = $(window).scrollTop();
            var half = $('.parallax').height() * -0.05;
            if (scrolled < 500) {
                $('.parallax').css('background-position', 'center ' + (half - (scrolled * .25)) + 'px');
            }
        });


        //Ripple
        !(function (a) {
            a(".ripple-dark").mousedown(function (b) {
                var c = a(this);
                0 === c.find(".dark").length &&
                    c.append("<span class='dark'></span>");
                var d = c.find(".dark");
                if ((d.removeClass("animate"), !d.height() && !d.width())) {
                    var e = Math.max(c.outerWidth(), c.outerHeight());
                    d.css({
                        height: e,
                        width: e
                    });
                }
                var f = b.pageX - c.offset().left - d.width() / 2,
                    g = b.pageY - c.offset().top - d.height() / 2;
                d.css({
                    top: g + "px",
                    left: f + "px"
                }).addClass("animate");
            });
        })(jQuery);
        !(function (a) {
            a(".ripple-light").mousedown(function (b) {
                var c = a(this);
                0 === c.find(".light").length &&
                    c.append("<span class='light'></span>");
                var d = c.find(".light");
                if ((d.removeClass("animate"), !d.height() && !d.width())) {
                    var e = Math.max(c.outerWidth(), c.outerHeight());
                    d.css({
                        height: e,
                        width: e
                    });
                }
                var f = b.pageX - c.offset().left - d.width() / 2,
                    g = b.pageY - c.offset().top - d.height() / 2;
                d.css({
                    top: g + "px",
                    left: f + "px"
                }).addClass("animate");
            });
        })(jQuery);

        //Form Thing
        $('.form-section input, .form-section textarea').on('input focusin focusout', function () {
            if ($(this).val().length || this === document.activeElement) {
                $(this).next().css('transform', 'translate(10px,10px)');
            } else {
                $(this).next().css('transform', 'translate(10px,40px)');
            }
        });
        setTimeout(function () {
            $(".form-section input").each(function () {
                if ($(this).val().length) {
                    $(this).next().css('transform', 'translate(10px,10px)');
                } else {
                    $(this).next().css('transform', 'translate(10px,40px)');
                }
            })
        }, 250);

        //Settings
        if (localStorage.getItem('timezone') && localStorage.getItem('timezone') !== "undefined") {
            $(`#tz-default`).removeClass("selector-main");
            $(`#${localStorage.getItem('timezone')}`).addClass("selector-main");
        }
        if (localStorage.getItem('background')) {
            $('#background').val(localStorage.getItem('background'));
        }
        if (localStorage.getItem('gradientColor1') && localStorage.getItem('gradientColor2')) {
            $('#gradientColor1').val(localStorage.getItem('gradientColor1'));
            $('#gradientColor2').val(localStorage.getItem('gradientColor2'));
        } else if (localStorage.getItem('gradientColor1')) {
            localStorage.removeItem('gradientColor1');
        } else if (localStorage.getItem('gradientColor2')) {
            localStorage.removeItem('gradientColor2');
        }
        if (localStorage.getItem('location')) {
            $('#location').val(localStorage.getItem('location'));
        }
        if (localStorage.getItem('news')) {
            $('#news').val(localStorage.getItem('news'));
        }
        $('#settingsSave').click(function (e) {
            if (timezone !== "tz-default") {
                localStorage.setItem('timezone', timezone);
            } else {
                localStorage.removeItem('timezone');
            }
            localStorage.setItem('background', $('#background').val());
            localStorage.setItem('gradientColor1', $('#gradientColor1').val());
            localStorage.setItem('gradientColor2', $('#gradientColor2').val());
            localStorage.setItem('location', $('#location').val());
            localStorage.setItem('news', $('#news').val());
            $(".newsPost").remove();
            gradient();
            background();
            news();
            weather();
            window.location.hash = "main";
            $('.notification').html('<h7>Saved&nbsp;&nbsp;<i class="fa fa-check"></i></h7>').show(0).delay(100).addClass('notification-visible');
            setTimeout(function () {
                $('.notification').removeClass('notification-visible').delay(100).hide(0);
            }, 5000);
            return false;
        });
        $('#settingsReset').click(function () {
            window.localStorage.clear();
            $(".selector li").removeClass("selector-main");
            $("#tz-default").addClass("selector-main");
            $('#background, #gradientColor1, #gradientColor2, #location, #news').val("");
            $(".newsPost").remove();
            gradient();
            background();
            news();
            weather();
            window.location.hash = "main";
            $(".form-section input").each(function () {
                $(this).next().css('transform', 'translate(10px,40px)');
            })
            $('.notification').html('<h7>Saved&nbsp;&nbsp;<i class="fa fa-check"></i></h7>').show(0).delay(100).addClass('notification-visible');
            setTimeout(function () {
                $('.notification').removeClass('notification-visible').delay(100).hide(0);
            }, 5000);
            return false;
        });
        $('#settingsCancel').click(function () {
            window.location.hash = "main";
            return false;
        });
    }
});
