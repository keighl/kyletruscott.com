$ ->

  body        = $ 'body'
  menu_toggle = $ '.header-menu-icon'

  menu_toggle.bind "click", (e) ->
    body.toggleClass "menu-open"
    menu_toggle.toggleClass "icon-menu icon-close"

    if body.hasClass "menu-open"
      window.scrollTo 0, 0

    return false
