var APP; // debug
$(function() {

    var k = {
        init_follow_demo_speed: 30000,
    }

    var fclock = (function() {
        var clock = {
            speed: k.init_follow_demo_speed
        }

        clock.init = function() {
            clock.data = model.plane3.data;
            clock.results = model.plane3.results;
            clock.fire = map.fire('fire 1', clock.results.FIRE_LATITUDE, clock.results.FIRE_LONGITUDE, clock.results.FIRE_NAME);
            clock.plane = map.plane('plane 3', clock.data[0]['Latitude'], clock.data[0]['Longitude'], clock.data[0]['Heading'])
            $('#progress').attr('max', clock.data.length - 1);
            view.set_start_label(clock.data[0].DateTime);
            clock.start();
        }

        clock.tick = function() {
            var data = clock.data,
                results = clock.results,
                fire = clock.fire,
                plane = clock.plane;

            var i = parseInt($('#progress').val()),
                pos = new google.maps.LatLng(data[i]['Latitude'], data[i]['Longitude']);


            // check for events
            if (data[i].Pickup && !data[i - 1].Pickup) { // very hacky way to avoid double scoop
                view.event(data[i].DateTime, 'PICKUP', null, 'alert-info')
            }
            if (data[i].FIRST_REP_DATE) {
                view.event(data[i].DateTime, "FIRE REPORTED", {
                    Name: results.FIRE_NAME,
                    Latitude: data[i].Latitude,
                    Longitude: data[i].Longitude
                }, 'alert-danger');
            } else if (data[i].SERVICE_BEGINS) {
                view.event(data[i].DateTime, 'SERVICE BEGIN', {
                    Origin: results.AIRPORT_DISP
                }, 'alert-warning')
            } else if (data[i].ARRIVE_OS) {
                view.event(data[i].DateTime, 'ARRIVE ON SCENE', {
                    BTF_Distance: results.BF_DIST,
                    BTF_Time: results.BF_TIME
                }, 'alert-warning')
            } else if (data[i].LEAVE_SCENE) {
                view.event(data[i].DateTime, 'LEAVE SCENE', null, 'alert-warning')
            } else if (data[i].SERVICE_ENDS) {
                view.event(data[i].DateTime, 'SERVICE ENDS', {
                    FTB_Distance: results.FB_DIST,
                    FTB_Time: results.FB_TIME,
                    Service_time: results.SERVICE_TIME,
                    Drops: results.NUM_DROPS,
                    Destination: results.AIRPORT_ARRV
                }, 'alert-success')
                clock.stop()
            }

            view.set_altitude_label(clock.data[i].Altitude);
            view.set_speed_label(clock.data[i].Speed);
            chart.altitude.series.append(new Date().getTime(), data[i + 1].Altitude); // HACK: load the next interval since chart has delay
            chart.speed.series.append(new Date().getTime(), data[i + 1].Speed); // HACK: load the next interval since chart has delay

            plane.setOptions({
                position: pos,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    rotation: data[i]['Heading'],
                    strokeColor: data[i].Marker.icon.strokeColor,
                }
            });

            map.Map.panTo(pos);

            $('#progress').val(parseInt($('#progress').val()) + 1);

            view.update_time_label(data[i].DateTime)
            // view.update_time_label(data[i].DateTime, data[i + 1].DateTime, clock.speed)
        }

        clock.start = function() {
            clock.playing = true;
            clock.tick();
            console.log('started')
            clock.ticker = setInterval(function() {
                clock.tick()
            }, clock.speed)
        }

        clock.reset = function() {
            // view.update_progress(0);
        }

        clock.stop = function() {
            clock.playing = false;
            clearInterval(clock.ticker)
        }

        return clock;
    }())

    var bindings = (function() {
        var bindings = {}

        bindings.init = function() {
            $('#play').click(bindings.click_play)
            $('#simple').click(bindings.click_simple)
            $('#follow').click(bindings.click_follow)
            $('#play, #simple, #follow').click(view.disable_buttons);
            $('#animate').click(bindings.click_animate)
            $('#speed').change(bindings.speed_change)
            $('#progress').change(bindings.progress_change)
        }

        bindings.speed_change = function() {
            var speed = Math.max($('#speed').val() * 10, 1);
            k.follow_demo_speed = 30000 / speed;
            $('#speed-label').html(speed + 'x');
            fclock.speed = k.follow_demo_speed;
            if (fclock.playing) {
                fclock.stop();
                fclock.start();
            }

            if (speed != 0) {
                chart.speed.smoothie.delay = k.follow_demo_speed;
                chart.altitude.smoothie.delay = k.follow_demo_speed;
            };

        }

        bindings.click_play = function() {
            map.clear();
            clock.time = model.data[0].DateTime;
            clock.end_time = model.data[model.data.length - 1].DateTime;
            clock.start();
        }

        bindings.click_simple = function() {
            map.clear();
            var interval = setInterval(function() {
                $('#progress').val(parseInt($('#progress').val()) + 1)
                map.draw_index($('#progress').val());
            }, 200)
        }

        bindings.click_follow = function() {
            map.clear();
            map.zoom(12);
            fclock.init();
        }

        bindings.click_animate = function() {
            model.split_plane_data();
            map.clear();

            // marker
            var pos = new google.maps.LatLng(model.plane1_data[0]['Latitude'], model.plane1_data[0]['Longitude']);
            var marker = new google.maps.Marker({
                map: map.Map,
                position: pos,
                title: 'id: ' + i,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    rotation: model.plane1_data[0]['Heading'],
                    strokeColor: 'yellow',
                },
            });
            $('#progress').attr('max', model.plane1_data.length - 1);

            // loop
            var time_per_mark = 2000;
            var frames_per_mark = 10;
            var frame = 0;
            var delta_lat = 0;
            var delta_lng = 0;
            var interval = setInterval(function() {

                var i = $('#progress').val();

                if (frame % frames_per_mark == 0) {
                    // console.log('new point')
                    $('#progress').val(parseInt($('#progress').val()) + 1);
                    console.log(model.plane1_data[i + 1]['Latitude'] - model.plane1_data[i]['Latitude'])
                    delta_lat = (model.plane1_data[i + 1]['Latitude'] - model.plane1_data[i]['Latitude']) / frames_per_mark;
                    delta_lng = (model.plane1_data[i + 1]['Longitude'] - model.plane1_data[i]['Longitude']) / frames_per_mark;
                    // console.log(delta_lat)
                    // console.log(delta_lng)
                } else {

                }

                // if (model.plane1_data[i].Pickup) {
                //     console.log('Ssccooop!')
                // };

                var pos = new google.maps.LatLng(
                    model.plane1_data[i + 1]['Latitude'] + delta_lat,
                    model.plane1_data[i + 1]['Longitude'] + delta_lng
                );

                marker.setOptions({
                    icon: {
                        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 2,
                        rotation: model.plane1_data[i + 1]['Heading'],
                        strokeColor: model.plane1_data[i + 1].Marker.icon.strokeColor,
                    }
                });
                marker.setPosition(pos);
                map.Map.panTo(pos);

                frame++;
            }, time_per_mark / frames_per_mark)

        }

        bindings.progress_change = function() {
            fclock.tick()
            // if (clock.playing) clock.stop();
            // map.clear()
            // console.log($(this).val())
            // map.draw_index($(this).val())
        }

        return bindings;
    }())

    var view = (function() {
        var view = {
            progress: 0,
        }

        view.init = function() {

        }

        view.event = function(time, msg, details, type) {
            var html = time + '<br>' + msg + (details ? '<br>' + JSON.stringify(details) : '')
            $('<div>', {
                class: 'alert ' + type,
                html: html
            }).prependTo('#events');

            function parse_event(msg) {

            }
        }

        view.update_time_label = function(now, then, speed) {
            $('#current-time-label').html(now)
            // clearInterval(view.clock)
            // var i = 0,
            //     j = (then - now) / fclock.speed,
            //     dt = (then - now) / fclock.speed, // seconds
            //     t = now;
            // view.clock = setInterval(function() {
            //     if (i >= j) {
            //         clearInterval(view.clock)
            //     } else {
            //         t.setSeconds(t.getSeconds() + dt);
            //         $('#time-label').html(t)
            //     }
            // }, dt)
        }

        view.set_start_label = function(t) {
            $('#start-time-label').html(t)
        }

        view.set_altitude_label = function(n) {
            $('#current-altitude-label').html(n)
        }

        view.set_speed_label = function(n) {
            $('#current-speed-label').html(n)
        }

        view.update_progress = function(n) {
            $('#progress').val(n)
        }

        view.disable_buttons = function() {
            $('button').attr('disabled', true);
        }

        return view;
    }())

    var clock = (function() {
        var clock = {
            time: new Date(),
            end_time: new Date(),
            speed: 1000,
            ticker: {},
            playing: false,
        }

        clock.init = function() {

        }

        clock.reset = function() {
            view.update_progress(0);
        }

        clock.start = function() {
            clock.playing = true;
            clock.tick();
            clock.ticker = setInterval(function() {
                clock.tick()
            }, clock.speed)
        }

        clock.stop = function() {
            clock.playing = false;
            clearInterval(clock.ticker)
        }

        clock.tick = function() {
            var old = clock.time;
            clock.time = new Date(old.getTime() + 180000);
            map.draw_interval(old, clock.time);

            if (clock.time >= clock.end_time) {
                clock.stop();
            }
        }

        return clock;
    }())

    var map = (function() {
        var map = {
            Map: {} // google map object
        }

        map.init = function() {
            var mapOptions = {
                center: new google.maps.LatLng(49.667872, -85.915853),
                zoom: 5,
                mapTypeId: google.maps.MapTypeId.SATELLITE
            };
            map.Map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        }

        map.zoom = function(i) {
            map.Map.setOptions({
                zoom: i
            })
        }

        map.fire = function(id, lat, lng, html) {
            var marker = new google.maps.Marker({
                map: map.Map,
                title: id,
                position: new google.maps.LatLng(lat, lng),
                scale: 2,
                icon: 'img/fire.png'
            });
            // google.maps.event.addListener(marker, 'mouseover', function() {
            //     infoWindow.setContent(html);
            //     infoWindow.open(map.Map, marker);
            // });
            model.fires.push(marker);
            return marker;
        }

        map.plane = function(id, lat, lng, heading) {
            var marker = new google.maps.Marker({
                map: map.Map,
                position: new google.maps.LatLng(lat, lng),
                title: id,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    rotation: heading,
                    strokeColor: 'yellow',
                },
            });
            return marker;
        }

        map.draw_index = function(i) {
            model.data[i].Marker.setVisible(true);
        }

        map.draw_indices = function(i, j) {
            for (i = i; i < j; i++) {
                model.data[i].Marker.setVisible(true);
            }
        }

        map.draw_interval = function(start, end) {
            $.each(model.data, function(i, x) {
                // if (x.DateTime >= start && x.DateTime <= end) {
                if (x.DateTime <= end) {
                    x.Marker.setVisible(true);
                    view.update_progress(i);
                } else {
                    x.Marker.setVisible(false);
                }
            })
        }

        map.draw_all = function() {
            for (i = 0; i < model.data.length; i++) {
                model.data[i].Marker.setVisible(true);
            }
        }

        map.draw_marker = function(marker) {
            marker.setVisible(true);
        }

        map.clear = function() {
            for (i = 0; i < model.data.length; i++) {
                model.data[i].Marker.setVisible(false);
            }
        }

        map.fade_out = function(marker) {
            marker.fadeOut();
        }

        map.fit_bounds = function() {
            var bounds = new google.maps.LatLngBounds();
            for (i = 0; i < model.data.length; i++) {
                bounds.extend(model.data[i].Marker.getPosition());
            }
            map.Map.fitBounds(bounds);
        }

        return map;
    }())

    var model = (function() {
        var model = {
            data: [],
            fires: []
        }

        model.init = function() {
            $.getJSON('data.json', function(data) {
                model.setup(data)
                model.add_tanker_markers(data);
                model.detect_drops(data); // async problems?
                model.data = data;
                model.split_plane_data();
            })
        }

        model.split_plane_data = function(data) {
            model.plane1 = {}
            model.plane2 = {}
            model.plane3 = {}

            model.plane1.data = model.data.filter(function(x) {
                return x.TankerId == "MNR4867"
            })
            model.plane2.data = model.data.filter(function(x) {
                return x.TankerId == "MNR4935"
            })
            model.plane3.data = model.data.filter(function(x) {
                return x.TankerId == "MNR47D4"
            })

            // FIXME: HACK: Detecting pickup during landing
            model.plane3.data['203'].Pickup = 0;
            model.plane3.data['203'].Marker.setOptions({
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 2,
                    rotation: model.plane3.data['203']['Heading'],
                    strokeColor: 'yellow',
                },
            })
            // END HACK

            $.getJSON('MNR47D4.json', function(res) {
                model.plane3.results = res;
                // assign events to markers
                $.each({
                    SERVICE_BEGINS: new Date(res.SERVICE_BEGINS),
                    ARRIVE_OS: new Date(res.ARRIVE_OS),
                    LEAVE_SCENE: new Date(res.LEAVE_SCENE),
                    SERVICE_ENDS: new Date(res.SERVICE_ENDS),
                    FIRST_REP_DATE: new Date(res.FIRST_REP_DATE)
                }, function(ri, rv) {
                    $.each(model.plane3.data, function(di, dv) {
                        if (dv.DateTime > rv) {
                            dv[ri] = true;
                            console.log(dv)
                            return false; // break
                        };
                    });
                });
                model.plane3.data[model.plane3.data.length - 1].SERVICE_ENDS = true;
            })
        }

        model.setup = function(data) {
            for (i = 0; i < data.length; i++) {
                data[i].DateTime = new Date(data[i].DateTime);
            }
            data.sort(function(a, b) {
                return a.DateTime - b.DateTime;
            })
        }

        model.add_tanker_markers = function(data) {
            for (i = 0; i < data.length; i++) {
                data[i]['Marker'] = map.plane('id: ' + i, data[i]['Latitude'], data[i]['Longitude'], data[i]['Heading'])
            }
        }

        model.detect_drops = function(data) {
            for (i = 4; i < data.length - 20; i++) {
                if (data[i - 2]['Altitude'] <= data[i - 3]['Altitude'] && data[i - 2]['Altitude'] <= data[i - 4]['Altitude'] && data[i - 2]['Altitude'] <= data[i - 1]['Altitude'] && data[i - 2]['Altitude'] <= data[i]['Altitude'] && data[i - 2]['Speed'] >= 30 && data[i - 2]['Speed'] <= 110) {
                    data[i - 2]['Pickup'] = 1;
                    data[i - 2]['Marker'].setOptions({
                        icon: {
                            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 2,
                            rotation: data[i]['Heading'],
                            strokeColor: 'cyan',
                        },
                    });
                } else {
                    data[i - 2]['Pickup'] = 0;
                }
            }
        }

        return model;

    }())

    var chart = (function() {
        var chart = {};

        chart.init = function() {
            chart.altitude = chart.simple('altitude-chart', 1000, 3500); // FIXME: hardcoded for demo
            chart.speed = chart.simple('speed-chart', 0, 300); // FIXME: hardcoded for demo
        }

        chart.simple = function(canvas_id, min, max) {
            var smoothie = new SmoothieChart({
                labels: {
                    fillStyle: '#9cfcc6'
                },
                // maxValue: max,
                // minValue: min
            });
            smoothie.streamTo(document.getElementById(canvas_id), 500);
            var line1 = new TimeSeries();
            smoothie.addTimeSeries(line1, {
                lineWidth: 2,
                strokeStyle: '#00ff00'
            });
            return {
                series: line1,
                smoothie: smoothie
            };
        }

        return chart;
    }())

    var app = (function() {
        var app = {
            clock: clock,
            model: model,
            map: map,
            bindings: bindings,
            view: view,
            k: k,
            fclock: fclock,
            chart: chart
        }

        app.init = function() { // TODO check the async on these
            map.init(); // load the map
            model.init(); // load the data
            clock.init(); // start the clock
            bindings.init();
            view.init();
            chart.init();
            //map.extend_bounds(); // proper zoom
        }

        return app;
    }())

    app.init()

    APP = app; // DEBUG

})