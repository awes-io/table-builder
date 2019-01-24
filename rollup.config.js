const isDev = process.env.NODE_ENV === 'development'
const isModern = process.env.BROWSERSLIST_ENV === 'modern'

const vue = require('rollup-plugin-vue')
const uglify = require('rollup-plugin-terser').terser
const nodeResolve = require('rollup-plugin-node-resolve')
const json = require('rollup-plugin-json')
const commonJs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const license = require('rollup-plugin-license')
const postcss = require('rollup-plugin-postcss')

module.exports = {
    input: './resources/js/main.js',
    external: ['vue'],
    output: {
        file: isModern ? './dist/js/main.js' : './dist/js/main.legacy.js',
        format: 'iife',
        globals: {
            vue: 'Vue'
        },
    },
    plugins: [
        vue(),
        commonJs({
            include: 'node_modules/**'
        }),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        json(),
        postcss()
    ]
}

if ( ! isModern ) {
    module.exports.plugins.push( 
        babel({
            exclude: 'node_modules/**'
        })
    )
}

if ( ! isDev ) {
    module.exports.plugins = module.exports.plugins.concat([
        uglify(),
        license({
            banner: "Bundle of AWES <%= pkg.name %> " + (isModern ? '' : 'transpiled and polyfilled') + " \n Generated: <%= moment().format('YYYY-MM-DD') %> \n Version: <%= pkg.version %>"
        })
    ])
}
