#!/bin/bash
rm -rf dist
node build.js
cp LICENSE README.md dist
tar -czf dist/deconstructed-word-list.tar.gz dist/*
