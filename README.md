#Node Starter Kit
##All the code and configuration you need for a Node project with modern tooling

###What This Is
Any basic web project needs some basic modern tooling to make your work faster. The are the tools the web-dev community has aligned around, namely:

- [x] [Gulp](http://gulpjs.com/): Automate basic repetitive tasks, namely the ones listed below.
- [x] [Bower](http://bower.io/): Package manager to download and manage front-end dependencies.
- [x] [Sass](http://sass-lang.com/): Supercharge your CSS.
- [x] [Sass Lint](https://www.npmjs.com/package/gulp-sass-lint): Check your Sass automatically for basic style adherance.
- [x] [Babel](https://babeljs.io/): Use the most up-to-date Javascript (ES6 or ES2015) on both the front-end and back-end by transpiling to ES5.
- [x] [Node](https://nodejs.org/en/) and [Express](http://expressjs.com/): The basic start to any Node backend.
- [x] [Browser-Sync](https://www.npmjs.com/package/browser-sync) with [Nodemon](http://nodemon.io/): Automatically reload your webpage and restart your server upon making and saving changes.
- [x] [Webpack](https://webpack.github.io/): Combine all your front-end and back-end Javascript into single respective files.
- [x] [Uglify](https://github.com/mishoo/UglifyJS2): Minify your front-end Javascript for performance.
- [x] [Sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps): Map all these transpiled changes back to your original code for debugging.

Downloading and running the code in this repository, as explained below, will set up these tools for you automatically. You can then dive into your project just as you always would, but now with super-charged tools and capabilities.

###Installation
Clone this repository (`git clone git@github.com:ahadik/node_starter.git`) to start your project. Install dependencies with `npm install`.

###Running
`gulp` is used to build the code (compile Sass to CSS, transpile ES6 to ES5, pack all your Javascript with Webpack, etc), watch for changes in files and rebuild as necessary, and serve your project through Browser-Sync. If you do not have Gulp installed already, install it globally through `npm` with `npm install -g gulp`.

To build the the code only, and not continue to watch files or serve through Browser-Sync, run the command `gulp build`.

To build the code, and continue to watch files for changes, run the command `gulp`.

###Structure
There are some key files and directories to know about:

- `package.json`: List all your Node and Gulp dependencies here.
- `bower.json`: List all your front-end dependencies (like jQuery) here.
- `Gulpfile.js`: Define the tasks carried out by Gulp.
- `app.js`: The source Node.js server file. That is, make your changes to _this_ file only. Gulp packs and transpiles `app.js` and all its linked dependencies to a single file, `index.js`.
- `index.js`: _Don't_ edit this file. This is the transpiled and packed Node.js file output by Gulp.
- `src/`: The source front-end files to edit. All of these files will be processed and sent to `public/` by Gulp as part of the build task. The Node server already contains configuration to direct all file requests to the `public/` directory.
	- `index.html`: Just what you'd expect. You can add other HTML files here too if you like.
	- `images/`: Keep all your images here. They'll be minified by Gulp before before being sent to `public/`.
	- `js/`: All front-end Javascript files.
	- `sass/`: All of your styling in Sass syntax. These will be linted and compiled Gulp at build time.
		- `style.scss`: The root Sass file that must include all desired sub-files. This is the source file for compiling to CSS.
		- `objects/`: Styling for specific, descrete objects in your interface should be kept in separate files here.
		- `settings/`: Basic rules to apply across your entire interface, like breakpoints.
		- `utilities/`: Simple functions and maps applicable across your interface.
		- `views/`: Styling specific to a single view, like a homepage, kept in separate files for each view.
- `modules/`: All custom modules to be included in your Node server. These will be transpiled to ES5 (so use ES6 just as you like!) and packed into  the single `index.js` file.

###Using
Once `gulp` runs successfully with out errors (a few Sass Lint warnings may be produced due to typography styling), a browser window will be opened automatically displaying `index.html`.

If you make changes to any front-end file, such as the text of `index.html`, or the Sass itself, Gulp will automatically re-run and Browser-Sync will reload the webpage for you, provided you have loaded the page on port 8000.

If you make changes to any back-end file, such as `app.js`, Gulp will rebuild the code and Nodemon will restart your Node server.

A word of caution: If you create new files, you'll need to check that Gulp is configured to watch for that file, and if it is, restart Gulp to include that file into its watch list.