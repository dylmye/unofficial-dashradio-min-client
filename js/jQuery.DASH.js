$(document).ready(function(){
    /*
    DASH RADIO MIN CLIENT
    v3.4.0 # MIT
    
    jQuery.Dash
    grabs data for the current station
    */
    /*
        INTRO - Getting Query Strings and basic information
    */
    

    var currURL = window.location.href;
    
    // funct GetQueryStringParams - get value for specified qs, returns empty if doesn't exist
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
    
    var statid = GetQueryStringParams("statid"); // get station identifier
    
    if(! statid) { window.location.replace("index.html"); }
    else { console.log("statid fine: " + statid); }
    
    /*
        PARSING
    */
    
    // funct parseStationXml - use for loadStation
    function parseStationXml(xml, statid) {
        var thexml = $(xml).find( 'station-object[statid="' + statid + '"]' );

        station = {
            name : $(thexml).find('name').text(),
            genre : $(thexml).find('genre').text(),
            logo : $(thexml).find('icon').text(),
            cover : $(thexml).find('cover').text(),
            description : $(thexml).find('description').text(),
            server : $(thexml).find('server').text(),

            stream : 'http://' + $(thexml).find('server').text() + '.securenetsystems.net/DASH' + statid,
            history : 'http://streamdb5web.securenetsystems.net/player_status_update/DASH' + statid + '_history_rss.xml',
            nowPlaying : 'http://streamdb5web.securenetsystems.net/player_status_update/DASH' + statid + '.xml'
        };
        $("#Player").html('<audio controls autoplay><source type="audio/mpeg" src="' + station.stream + '"><em>Sorry, your browser doesn&apos;t support this stream. Upgrade your browser, it&apos;s 2015!</em></audio>');
        $("#PlayingHistory").rss(station.history, {
          limit: 5, // only top 5
          layoutTemplate: '<p class="dl-horizontal">{entries}</p>',
          entryTemplate: '<p><span>{title} {body}</span></p> <hr>'
        }).show();    
    }
    
    // funct getNowPlaying - uses player_status_update to get current info.
    function getNowPlaying(statid) {
        return $.ajax({
            type: "GET",
            url: station.nowPlaying,
            dataType: "xml",
            success: function(xml) {
                var songxml = $(xml).find( 'playlist' );
                var currentSong = {
                    title : $(songxml).find('title').text(),
                    artist : $(songxml).find('artist').text(),
                    album : $(songxml).find('album').text(),
                    art : $(songxml).find('cover').text(),
                    buy : {
                        itunes : "https://fnd.io/#/search?mediaType=music&term=" + encodeURIComponent($(songxml).find('title').text()),
                        playMusic : "https://play.google.com/store/search?c=music&q=" + encodeURIComponent($(songxml).find('title').text() + " - " + $(songxml).find('artist').text()) 
                    },
                    share : encodeURIComponent("#NowPlaying " + $(songxml).find('title').text() + " by " + $(songxml).find('artist').text() + " - "),
                    cover : $(songxml).find('cover').text()
                };
                var twittershare = "https://twitter.com/intent/tweet?text=" + currentSong.share + "&url=" + encodeURIComponent(currURL) + "&via=" + encodeURIComponent("dash_radio");
                var facebookshare = "http://www.facebook.com/sharer/sharer.php?t=" + currentSong.share + "&u=" + encodeURIComponent(currURL);
                $("#Cover").attr("src", currentSong.art);
                $("#Cover").attr("alt", currentSong.title);
                $("#Cover").attr("title", currentSong.title);
                
                // buy links
                $('#BuyiTunes').attr("href", currentSong.buy.itunes);
                $('#BuyPlay').attr("href", currentSong.buy.playMusic);
                
                // share links
                $("#ShareTweet").attr("href", currentSong.share.twitter);
                $("#ShareFB").attr("href", currentSong.share.facebook);
                
                // now playing
                $("#PlayingData").html("<strong>" + currentSong.title + "</strong><br>By " + currentSong.artist);
                $("#PlayingFN").html("Now Playing on " + station.name);
            }
        });
    }
    
    /*
        GATHERING
    */

    // funct getAllStations - AJAX decoupling
    function getAllStations() {
         return $.ajax({
            type: "GET",
            url: './allStations.xml',
            dataType: "xml",
            success: function(xml) {
                parseStationXml(xml, statid); 
                
                setInterval(function updateNowPlaying(){ getNowPlaying(statid) }, 10000); // update every 10 seconds
            }
         });
    }
    getAllStations();
}); // end of on doc.ready