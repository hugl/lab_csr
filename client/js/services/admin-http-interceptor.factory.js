'use strict';

var ng = require('angular');

module.exports = ['$q', 'utils', 'i18nFactory',
    function ($q, utils, i18nFactory) {

        return {

            /**
             * Intercepts any outbound requests and determines if the request requires authorization.
             * @param  {object} config
             * @return {object}
             */
            request: function (config) {
                return config;
            },

            /**
             * If a request fails because of an authorization error, then rediret user to ID's denied page.
             *
             * TODO We want to log the auth error and point the user towards getting access if needed.  Ideally,
             * users should not have access to any requests that they don't have permissions for.
             *
             * @param  {object} response
             * @return {promise}
             */
            responseError: function (response) {

                // Indicates that the bearer token is invalid.
                if (response.status === 401) {
                    utils.displayMessage(i18nFactory.get("tokenInvalid"));
                    window.opener.location.reload();
                }

                // Error is not because of unauthorization.
                return $q.reject(response);
            }
        };
    }
];
