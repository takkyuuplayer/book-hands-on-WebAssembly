#!/bin/bash
emcc validate.cpp -O1 --no-entry -Wl,--export-table,--growable-table -o validate.wasm