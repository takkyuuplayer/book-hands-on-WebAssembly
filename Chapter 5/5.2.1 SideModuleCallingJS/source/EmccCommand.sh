#!/bin/bash
emcc validate.cpp -O1 --no-entry -s ERROR_ON_UNDEFINED_SYMBOLS=0 -o validate.wasm