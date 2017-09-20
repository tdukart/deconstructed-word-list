#!/bin/bash
node build.js
tar -czf dist/deconstructed-word-list.tar.gz dist/*.js
