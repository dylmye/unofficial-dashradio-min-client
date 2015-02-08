dashradio-min-client
====================
v3.0.1

DR-MC is a basic web app based on Bootstrap and jPlayer which allows access to anyone on nearly any device (read: any browser that supports javascript) to listen to the high-quality, non-commerical streams provided by DJ Skee. This project also makes no money, and gives direct access to the music from every station owned by Dash, without their clunky and desktop-only flash component. This web app makes use of jQuery, HTML and AJAX.

Made by dylmye / teamdaylo
Released under MIT

Instructions
====================
Download as a ZIP or Clone to your Desktop, then open index.html. It's that simple.

Known Issues
====================
* Chrome/ium doesn't allow access to local XML files.

> **Solution:** Change the AJAX url in index.html and DASH.js to
[this url.](https://dylmye.github.io/dashradio-min-client/allStations.xml)

* Some StatIDs seem to pull multiple names, due to the use of the "contains" selector.

> If you know how to solve this, please publish a fork or issue.
