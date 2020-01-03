class HelloWorldPlugin {
  apply(compiler) {
    console.log(7777);
    compiler.hooks.done.tap('Hello World Plugin', function(stats) {
      console.log(11);
    });
  }
}

module.exports = HelloWorldPlugin;
