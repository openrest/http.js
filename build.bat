java -jar ./tools/compiler/compiler.jar --js src/web/*.js --js_output_file=dist/http-web.js
java -jar ./tools/compiler/compiler.jar --js src/titanium/*.js --js_output_file=dist/http-titanium.js
pause