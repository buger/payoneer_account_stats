require.config({
  shim: {
    underscore: {
      exports: '_'
    }
  }
})

require(['jquery','underscore','cs!app/app'], function ($, _, App) {
	app = new App
});