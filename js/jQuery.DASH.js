/*
jQuery.DASH
v3.2.5
** Pulls data about current station and
** history to display to users
**** licensed under ISC *****
*/

$(document).ready(function(){
  if(STATID == '') { // if user just visited w/o params
    window.location.href("index.html");
  }

  // pull params for data entry
  function GetQueryStringParams(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam)
      {
        return sParameterName[1];
      }
    }
  }

  $.expr[':'].textEquals = function(a, i, m) {
    return $(a).text().match("^" + m[3] + "$");
};

  var STATID = GetQueryStringParams('statid'); // station ident
  var STATSRV = GetQueryStringParams('server'); // station server
  var AUTH = GetQueryStringParams('auth'); // history auth key
  $("#VLC").attr("href", 'vlc://' + 'http://' + STATSRV + '.securenetsystems.net/' + STATID + '?type=.flv:80');

  // main function: player_status_update poller
  var refInterval = window.setInterval(function() {
    $.ajax({
      type: "GET",
      url: "http://streamdb5web.securenetsystems.net/player_status_update/"+ STATID +".xml",
      dataType: "xml",
      success: function(xml) {
        $(xml).find('playlist').each(function(){
          var NowPlayingTitle = $(this).find('title').text(); // title of current song
          var NowPlayingArtist = $(this).find('artist').text(); // artist of current song
          var NowPlayingArtwork = $(this).find('cover').text(); // album cover of current song

          if(NowPlayingArtwork !== ""){ // sometimes no art is provided;
              $('#Cover').attr('src', NowPlayingArtwork); // if there is art, apply it;
          }
          else if(NowPlayingTitle == "The Shane Show"){
              $('#Cover').attr('src', "./img/shaneshowcover.jpg"); // Shane Show is regular enough to give it artwork
          }
          else {
            $('#Cover').attr('src', "./img/fallbackcover.png"); // otherwise use a placeholder
          }
        // debug only -- console.log('Updated at ' + jQuery.now() + ' using key ' + AUTH + STATID);
        $('#Cover').attr('alt', NowPlayingTitle); // accessibility - put title in cover tags
        $('#Cover').attr('title', NowPlayingTitle);
        document.title = "▶ " + NowPlayingTitle + " - " + NowPlayingArtist + " | Playing on DASH Radio";
        $('#BuyiTunes').attr("href", "https://itunes.com/" + encodeURIComponent(NowPlayingTitle) + encodeURIComponent(" - ") + encodeURIComponent(NowPlayingArtist)); // iTunes link
        $('#BuyPlay').attr("href", "https://play.google.com/store/search?c=music&q=" + encodeURIComponent(NowPlayingTitle) + encodeURIComponent(" by ") + encodeURIComponent(NowPlayingArtist)); // iTunes link

        // get human name for station: fn poller
        $.ajax({
          url:'allStations.xml',
          success:function(xml) {
            var STATFN = $(xml).find(":contains(" + STATID + ") > name").text(); // get fn from id - uses contain however :'(
            $("#PlayingFN").html('Now Playing on ' + STATFN); // report fn
          }
        });
        $("#PlayingData").html('<strong>' + NowPlayingTitle + '</strong><br>By ' + NowPlayingArtist); // report song data

        // sharing stuff
        var currURL = window.location.href;
        var shareText = "#NowPlaying " + NowPlayingTitle + " By " + NowPlayingArtist + " - ";

        $("#ShareTweet").attr("href", "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareText) + "&url=" + encodeURIComponent(currURL) + "&via=" + encodeURIComponent("dash_radio")); // share to Twitter
        $("#ShareFB").attr("href", "http://www.facebook.com/sharer/sharer.php?t=" + encodeURIComponent(shareText) + "&u=" + encodeURIComponent(currURL)); // share to Facebook

        });
      }
    });
  }, 4000); // poll every 4 seconds

  // Playing History
$("#PlayingHistory").rss("https://radio.securenetsystems.net/dx/get_playlist_history.cfm?stationCallSign=" + STATID + "&authTokenWeb=" + AUTH + "&rss=true", {
  limit: 5, // only top 5
  layoutTemplate: '<p class="dl-horizontal">{entries}</p>',
  entryTemplate: '<p><span>{title} {body}</span></p> <hr>'
}).show();
});
