# Font Custom Instructions

1. Install font custom with [these instructions](http://fontcustom.com)
2. Add SVG files to this directory
3. Run the CLI tool and copy SCSS to stylesheets directory:
  <pre>
    cd path/to/app/fontcustom
    fontcustom compile .; cp ../fonts/_fontcustom.scss ../sass/_fontcustom.scss
  </pre>