#!/usr/bin/env node

var fs = require( 'fs' );
var wordListPath = require( 'word-list' );

var disassembleString = function ( string ) {
	var filteredString = string.replace( /[^A-Z]/gi, '' ).toUpperCase();

	var components = {};
	filteredString.split( '' ).forEach( function ( letter ) {
		letter = letter.toUpperCase();
		components[ letter ] = components[ letter ] ? components[ letter ] + 1 : 1;
	} );

	return components;
};

var deconstructedWords = {};

fs.readFileSync( wordListPath, 'utf8' ).split( '\n' ).forEach( function ( word ) {
	var firstLetter = word.toLowerCase().substr( 0, 1 );
	deconstructedWords[ firstLetter ] = deconstructedWords[ firstLetter ] || [];
	deconstructedWords[ firstLetter ].push( [ word, disassembleString( word ) ] );
} );

if ( !fs.existsSync( 'dist' ) ) {
	fs.mkdirSync( 'dist' );
}

var scriptList = [];
var indexScript = [ 'var words = [];' ];

Object.keys( deconstructedWords ).forEach( function ( firstLetter ) {
	var letterScript = 'module.exports = ' + JSON.stringify( deconstructedWords[ firstLetter ] ) + ';';

	fs.writeFileSync( 'dist/' + firstLetter + '.js', letterScript );

	indexScript.push( 'words.concat(require("./' + firstLetter + '.js"));' );
} );

indexScript.push( 'module.exports = words;' );

fs.writeFileSync( 'dist/index.js', indexScript.join( '\n' ) );