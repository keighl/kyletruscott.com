(function() {
  $(function() {
    var body, menu_toggle;
    body = $('body');
    menu_toggle = $('.header-menu-icon');
    return menu_toggle.bind("click", function(e) {
      body.toggleClass("menu-open");
      menu_toggle.toggleClass("icon-menu icon-close");
      if (body.hasClass("menu-open")) {
        window.scrollTo(0, 0);
      }
      return false;
    });
  });

}).call(this);
