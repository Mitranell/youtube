module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                reporter: require('jshint-stylish')
            },
            build: ['Gruntfile.js', 'client/src/**/*.js', '!client/src/js/main.js'] //main.js gives error, but does work (hence the '!')
        },
        uglify: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'client/dist/js/main.min.js': 'client/src/js/main.js'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'client/src/scss',
                    cssDir: 'client/dist/css'
                }
            }
        },

        nodemon: {
            dev: {
                script: 'index.js'
            }
        },
        watch: {
            css: {
                files: ['client/src/scss/*.scss'],
                tasks: ['compass']
            },
            scripts: {
                files: 'client/src/js/**/*.js',
                tasks: ['jshint', 'uglify','browserify']
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        },
        browserify: {
          'client/src/js/main.js': ['client/src/js/client.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint'); //JSLinter
    grunt.loadNpmTasks('grunt-contrib-uglify'); //Minifiying JS
    grunt.loadNpmTasks('grunt-contrib-compass'); //Sass Compiling
    grunt.loadNpmTasks('grunt-contrib-cssmin'); //Minifiying CSS
    grunt.loadNpmTasks('grunt-contrib-watch'); //Watch files
    grunt.loadNpmTasks('grunt-nodemon'); //Node handler
    grunt.loadNpmTasks('grunt-concurrent'); //Run node and watch and share command line output
    grunt.loadNpmTasks('grunt-browserify'); //Browserify for browser modules

    grunt.registerTask('default', ['concurrent']);
};
