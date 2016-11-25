module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    env: {
      dev: {
        NODE_ENV: 'dev'
      },
      prod: {
        NODE_ENV: 'prod',
        SERVER_PORT: 4568,
        DB_PORT: 27017,
        DB_HOST: 'mongo'
      }
    },

    clean: [ 'public/dist/' ],

    concat: {
      client: {
        files: {
          'public/dist/build.js': [ 'public/client/**/*.js' ],
          'public/dist/lib.js': [
            'public/lib/jquery.js',
            'public/lib/underscore.js',
            'public/lib/backbone.js',
            'public/lib/handlebars.js'
          ]
        },
      }
    },

    copy: {
      client: {
        files: [ // includes files within path
          { expand: true, flatten: true, cwd: 'public/', src: [ '*.png', '*.gif' ], dest: 'public/dist', filter: 'isFile' }
        ]
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [ 'test/**/*.js' ]
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      'dynamic_mappings': {
        // Grunt will search for "**/*.js" under "lib/" when the "uglify" task
        // runs and build the appropriate src-dest file mappings then, so you
        // don't need to update the Gruntfile when files are added or removed.
        files: [
          {
            expand: true,          // Enable dynamic expansion.
            cwd: 'public/dist/',   // Src matches are relative to this path.
            src: ['**/*.js'],      // Actual pattern(s) to match.
            dest: 'public/dist/',  // Destination path prefix.
            ext: '.min.js',        // Dest filepaths will have this extension.
            extDot: 'first'        // Extensions in filenames begin after the first dot
          },
        ],
      },
    },

    eslint: {
      target: [
        'server.js',
        'server-config.js',
        'app/*.js',
        'lib/*.js',
        'views/**/*.js',
        'public/client/**/*.js',
        'public/lib/**/*.js',
        'test/*.js'
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/',
          src: [ '*.css', '!*.min.css' ],
          dest: 'public/dist/',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: [ 'cssmin' ]
      }
    },

    shell: {
      prodServer: {
        command: 'node server.js'
      },
      uploadDroplet: {
        command: 'git push live master'
      },
      mochaTest: {
        command: 'node_modules/mocha/bin/mocha test/ServerSpec.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'env:dev', 'nodemon', 'watch' ]);
  });
  grunt.registerTask('server-prod', function (target) {
    grunt.task.run([ 'env:prod', 'shell:prodServer' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'shell:mochaTest'
  ]);

  // build and test
  grunt.registerTask('build', function (n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'env:prod', 'clean', 'eslint', 'concat', 'copy', 'uglify', 'cssmin', 'test' ]);
    } else {
      grunt.task.run([ 'env:dev', 'eslint', 'test' ]);
    }
  });

  // upload to droplet
  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'shell:uploadDroplet' ]);
    }
  });

  // Development: dev build and run dev server
  // Production: prod build and upload to droplet
  grunt.registerTask('deploy', function (n) {
    if (grunt.option('prod')) {
      grunt.task.run([ 'env:prod', 'build', 'upload' ]);
    } else {
      grunt.task.run([ 'env:dev', 'build', 'server-dev' ]);
    }
  });

};
