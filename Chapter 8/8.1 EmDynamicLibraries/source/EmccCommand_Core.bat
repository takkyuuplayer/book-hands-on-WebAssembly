emcc validate_core.cpp --js-library mergeinto.js -s MAIN_MODULE=2 -s MODULARIZE=1 -s "EXPORTED_FUNCTIONS=['_strlen','_atoi']" -s "EXPORTED_RUNTIME_METHODS=['ccall','stringToUTF8','UTF8ToString']" -o validate_core.js