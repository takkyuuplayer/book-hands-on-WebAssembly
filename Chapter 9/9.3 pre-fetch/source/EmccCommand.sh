#!/bin/bash
emcc calculate_primes.cpp -O1 -std=c++11 -s MODULARIZE=1 -o calculate_primes.js