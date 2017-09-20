#!/usr/bin/env node

var fs = require( 'fs' );
var wordListPath = require( 'word-list' );
var json5 = require('json5');

var disassembleString = function ( string ) {
	var filteredString = string.replace( /[^A-Z]/gi, '' ).toUpperCase();

	var components = {};
	filteredString.split( '' ).forEach( function ( letter ) {
		letter = letter.toUpperCase();
		components[ letter ] = components[ letter ] ? components[ letter ] + 1 : 1;
	} );

	return components;
};

var deconstructedWords = [];

fs.readFileSync( wordListPath, 'utf8' ).split( '\n' ).forEach( function ( word ) {
	deconstructedWords.push( [ word, disassembleString( word ) ] );
} );

if ( !fs.existsSync( 'dist' ) ) {
	fs.mkdirSync( 'dist' );
}

var indexScript = [];

indexScript.push( 'module.exports = ' + json5.stringify( deconstructedWords ) + ';' );

fs.writeFileSync( 'dist/index.js', indexScript.join( '\n' ) );
