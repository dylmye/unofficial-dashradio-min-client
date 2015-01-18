// v2.3
$(document).ready(function(){
  $("#loadspin").show().delay(3500).fadeOut();
  $("#"+ STATID).append('<div id="ImageHolder"></div>');
  var refInterval = window.setInterval(function() {
    $.ajax({
      type: "GET",
      url: "http://streamdb5web.securenetsystems.net/player_status_update/"+ STATID +".xml",
      dataType: "xml",
      success: function(xml) {
        $(xml).find('playlist').each(function(){
          var SCS = $(this).find('stationCallSign').text();
          var NowPlayingTitle = $(this).find('title').text();
          var NowPlayingArtist = $(this).find('artist').text();
          var NowPlayingArtwork = $(this).find('cover').text();

          if(NowPlayingArtwork !== ""){

            $('#Cover').html('<img id="CoverIMG" src="' + NowPlayingArtwork + '" />');
          }
          else {
            $('#Cover').html('<img id="CoverIMG" src="' + STATCOVER + '" />');
            var NowPlayingArtwork = STATCOVER;
          }
          console.log('Updated at' + jQuery.now());
        $("#PlayingData").html('<span>Now Playing on ' + STATID + '<br><strong>' + NowPlayingTitle + '</strong><br>By ' + NowPlayingArtist + '</span>');
        });
      }
    });
    //remove the ()?
  }, 4000); // 4 seconds
$("#PlayingHistory").rss("https://radio.securenetsystems.net/dx/get_playlist_history.cfm?stationCallSign="+ STATID +"&authTokenWeb=" + AUTH + "&rss=true", {
  limit: 10,
  layoutTemplate: '<dl class="dl-horizontal">{entries}</dl>',
  entryTemplate: '<dt><span>{title} by {body}</span></dt>'
}).show();
});
