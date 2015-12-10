(function() {
    angular.module('BOT', [
            'ui.router'
        ])
        .config([
            '$stateProvider', '$urlRouterProvider',
            function(
                $stateProvider, $urlRouterProvider) {
                //$urlRouterProvider.otherwise('en/services');
                $urlRouterProvider.otherwise('/');
                var states = {};
                states.home = {
                    name: 'home',
                    url: '/',
                    templateUrl: 'client/html/view-home.html'
                };
                states.login = {
                    name: 'blog',
                    url: '/blog',
                    templateUrl: 'client/html/view-blog.html'
                };

                $stateProvider.state(states.home);
            }
        ]);
})();
