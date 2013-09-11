---
layout: post
title: "Why Isn't That Font Working in IE?"
description: "IE gets confused when @font-face fonts don't have identical family/fullnames. Fix that using FontForge."
---

I recently emerged from a `@font-face` rabbit hole where most of the typeface weights I needed were not rendering in IE8 and below.

The typeface itself was proprietary and blacklisted by FontSquirrel so I had convert the fonts myself from OTF to TTF/EOT/SVG/WOFF. I found a good [reference on github](https://github.com/zoltan-dulac/css3FontConverter) for how to go about doing all the conversions; I used a mix of fontforge, ttf2eot and Batik's ttf2svg.

<!--break-->

After I had all the weights converted, none would work in IE8. I tried all the different `@font-face` declaration methods (like smiley face, etc). However, still no IE8 support. IE9 was working; I tracked down a console error in an IE8 emulator:

{% highlight bash %}
CSS3111: @font-face encountered unknown error.
{% endhighlight %}

This error was raising for each weight of the typeface. Clearly there was an issue with how I created the EOT versions of the fonts.

I tried a paid service from [codeandmore.com](http://fontface.codeandmore.com/) that kept coming up on stackoverflow. But still, after converting all the fonts, still no IE8 support. Same CSS error in the console.

So maybe there was an issue with the original OTF fonts? After two more hours of googling I found an [obscure comment](https://code.google.com/p/ttf2eot/issues/detail?id=10) on the ttf2eot bug tracker:

> Boriss - Your problem is with the font itself. The NAME table doesn't conform to Microsoft's expectations and is therefore rejected by IE. Use the fontsquirrel.com generator instead. It fixes the NAME table issue for you.

This reminded me of something I had read once on the [TypeKit blog](http://blog.typekit.com/2011/06/27/new-from-typekit-variation-specific-font-family-names-in-ie-6-8/) about font families in IE; it needs unique family names per weight otherwise it gets confused.

I decided to try re-converting all the fonts again myself, but this time physically renaming the fonts name/family to be the same value.

Before, the font files looked like this:

* Font #1
  * Family: ProprietaryType Condensed
  * Fullname: ProprietaryType Condensed Semibold
* Font #2
  * Family: ProprietaryType Condensed
  * Fullname: ProprietaryType Condensed Semibold Italic

I needed them to have identical details; something like this:

* Font #1
  * Family: ProprietaryTypeCondensedSemibold
  * Fullname: ProprietaryTypeCondensedSemibold
* Font #2
  * Family: ProprietaryTypeCondensedSemiboldItalic
  * Fullname: ProprietaryTypeCondensedSemiboldItalic

The OTF file names already had definitions like that, so I rejiggered the fontforge conversion script to set the full name/family/postscript name to be the same as the file:

<script src="https://gist.github.com/keighl/5434540.js"></script>

Now when the final EOT font was generated from the renamed TTF, it worked in IE8!

To recap:

* Make sure your fonts have unique and identical Family and Fullnames
* Use FontForge to rename your original font files