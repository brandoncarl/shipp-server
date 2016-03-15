/**

  server

  The backbone of the server module. In development, this runs proxied through
  BrowserSync server.

  @param {Object} options Options passed on to "globals"
  @param {Function} next Called when server successfully initialized

**/

var reorg = require("reorg");

module.exports = reorg(function(options, next) {

  // Globals
  require("./globals")(options);

  var server     = global.express(),
      middleware = require("./middleware"),
      Utils      = require("./Utils");

  [
    // User-defined middleware
    middleware("beforeAll"),

    // Common middleware: logging, favicons, cookie parsing, sessions and body parsing
    require("./common")(),

    // User-defined middleware
    middleware("beforeRoutes"),

    // Static and compiled routes
    require("./routes")(),

    // Data-server
    require("./data-server")(),

    // User-defined middleware
    middleware("afterRoutes")

  ].forEach(function(library) {
    Utils.useMiddleware(server, library);
  });

  // Error handling: please see errors middleware for explanation of structure
  require("./errors")(server, middleware("errorHandler"));

  // Find open port and set up graceful shutdown
  require("./lifecycle")(server, next);

}, "object", ["function", function() {}]);
