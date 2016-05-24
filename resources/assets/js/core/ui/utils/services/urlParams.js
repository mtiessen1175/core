/**
 * @namespace dias.ui.utils
 * @ngdoc service
 * @name urlParams
 * @memberOf dias.ui.utils
 * @description Manages URL parameters after a #
 */
angular.module('dias.ui.utils').service('urlParams', function () {
        "use strict";

        var state = {};
        var slug = location.pathname.split('/');
        slug = slug[slug.length - 1];

        // transforms a URL parameter string like #a=1&b=2 to an object
        var decodeState = function () {
            var params = location.hash.replace('#', '').split('&');

            var state = {};

            params.forEach(function (param) {
                // capture key-value pairs
                var capture = param.match(/(.+)\=(.+)/);
                if (capture && capture.length === 3) {
                    state[capture[1]] = decodeURIComponent(capture[2]);
                }
            });

            return state;
        };

        // transforms an object to a URL parameter string
        var encodeState = function (state) {
            var params = '';
            for (var key in state) {
                params += key + '=' + encodeURIComponent(state[key]) + '&';
            }
            return params.substring(0, params.length - 1);
        };

        var pushState = function () {
            var hash = encodeState(state);
            history.pushState(state, '', slug + (hash) ? ('#' + hash) : '');
        };

        var replaceState = function () {
            var hash = encodeState(state);
            history.replaceState(state, '', slug + (hash) ? ('#' + hash) : '');
        };

        this.pushState = function (s) {
            slug = s;
            pushState();
        };

        // sets a URL parameter and updates the history state
        this.set = function (params) {
            for (var key in params) {
                state[key] = params[key];
            }
            replaceState();
        };

        this.unset = function (key) {
            delete state[key];
            replaceState();
        };

        // returns a URL parameter
        this.get = function (key) {
            return state[key];
        };

        state = history.state;

        if (!state) {
            state = decodeState();
        }
    }
);