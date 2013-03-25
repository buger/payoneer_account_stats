require.config({
  shim: {
    underscore: {
      exports: '_'
    }
  }
})

require(['cs!app/app'], function (App) {
	new App()
});