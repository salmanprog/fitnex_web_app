const mix = require('laravel-mix');
const fs = require('fs-extra');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
 mix.js('resources/js/app.js', 'public/js').react()

//  mix.after(webpackStats => {
//     fs.copy('./public/js', './public/public/js')
//     .then(() => console.log('Files copied successfully!'))
//     .catch(err => console.error(err));
// });