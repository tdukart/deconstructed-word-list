# deconstructed-word-list
A list of words preprocessed with letter counts. Useful for descrambling.

Each word in the array is formatted like this:

```
[ "word", { W: 1, O: 1, R: 1, D: 1 } ]
```

where the second element of the array is an object that contains the count of each letter in the word.

There are a _lot_ of words here, and it results in a very large import. Since in many cases you don't need all of those words, you also have the ability to import just a subset based on length:

```
var wordList = ( 'deconstructed-word-list/up-to-10' ); // Words up to 10 letters long.
```
