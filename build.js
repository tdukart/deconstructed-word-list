#!/usr/bin/env node

var fs = require( 'fs' );
var wordListPath = require( 'word-list' );
var JSON5 = require( 'json5' );

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
	var length = word.length;
	deconstructedWords[ length ] = deconstructedWords[ length ] || [];
	deconstructedWords[ length ].push( [ word, disassembleString( word ) ] );
} );

if ( !fs.existsSync( 'dist' ) ) {
	fs.mkdirSync( 'dist' );
}

var indexScript = [];
var upToLengthScripts = {};

indexScript.push( 'var words = [];' );

var lengths = Object.keys( deconstructedWords ).map( function ( length ) {
	return parseInt( length, 10 );
} );

var maxLength = Math.max.apply(null,lengths);

for ( var i = 2; i <= maxLength; i++ ) {
	upToLengthScripts[ i ] = [ 'var words = [];' ];
}

lengths.forEach( function ( length ) {
	var lengthScript = 'module.exports = ' + JSON5.stringify( deconstructedWords[ length ] );

	var fileName = 'length-' + length + '.js';

	fs.writeFileSync( 'dist/' + fileName, lengthScript );

	var concatCommand = 'words = words.concat( require( "./' + fileName + '" ) );';

	indexScript.push( concatCommand );
	for ( var i = length; i <= maxLength; i++ ) {
		upToLengthScripts[ i ].push( concatCommand );
	}

} );

indexScript.push( 'module.exports = words;' );

fs.writeFileSync( 'dist/index.js', indexScript.join( '\n' ) );

Object.keys( upToLengthScripts ).forEach( function ( length ) {
	var script = upToLengthScripts[ length ].join( '\n' );
	script += '\nmodule.exports = words;';
	fs.writeFileSync( 'dist/up-to-' + length + '.js', script );
} );
