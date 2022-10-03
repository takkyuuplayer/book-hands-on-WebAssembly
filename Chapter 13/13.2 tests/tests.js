// Node.jsで実行されているかを確認する（そうでなければブラウザで実行されている）
const IS_NODE = (typeof process === 'object' && typeof require === 'function');

// Node.jsで実行されている場合の処理（before関数でオブジェクトを読み込む）
if (IS_NODE) {
  let chai = null;
  let Module = null;
}
else { // ブラウザで実行されている場合の処理
  // Emscriptenから生成されたJavaScriptのコードから参照するためvarを使用する
  var Module = {
    // Emscriptenから生成されたJavaScriptのコードの準備ができたらテストを実行する
    onRuntimeInitialized: () => { mocha.run(); }
  };  
}

describe("Testing the validate.wasm module from chapter 4", () => {

  before(() => {
    if (IS_NODE) {
      // Chaiを読み込む
      chai = require('chai');
      
      // Emscriptenが生成したJavaScriptのコードを読み込む
      // すぐには読み込まれない可能性があるため準備ができるまでPromiseで待機する
      return new Promise((resolve) => {
        Module = require('./validate.js');
        Module['onRuntimeInitialized'] = () => {
          resolve();
        }  
      }); // Promiseの末尾
    } // if文の末尾
  }); // before関数の末尾

  it("Pass an empty string", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "";
    const expectedMessage = "A Product Name must be provided.";
    
    const isValid = Module.ccall('ValidateName',
        'number',
        ['string', 'number', 'number'],
        [name, 50/*MAXIMUM_NAME_LENGTH*/, errorMessagePointer]);

    let errorMessage = "";
    if (isValid === 0) { errorMessage = Module.UTF8ToString(errorMessagePointer); }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });

  it("Pass a string that's too long", () => {
    const errorMessagePointer = Module._malloc(256);
    const name = "Longer than 5 characters";
    const expectedMessage = "";
    
    const isValid = Module.ccall('ValidateName',
        'number',
        ['string', 'number', 'number'],
        [name, 50/*MAXIMUM_NAME_LENGTH*/, errorMessagePointer]);

    let errorMessage = "";
    if (isValid === 0) { errorMessage = Module.UTF8ToString(errorMessagePointer); }

    Module._free(errorMessagePointer);

    chai.expect(errorMessage).to.equal(expectedMessage);
  });
});