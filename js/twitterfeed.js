(function (window, $) {

  $.fn.twitterfeed = function (options) {
    var opts = $.extend({}, $.fn.twitterfeed.defaults, options);

    if (!opts.url) {
        throw "Twitterfeed: option 'url' is required";
    }


    // Implement the rest of the logic

    this.html("Twitter Feed starting");

    var element = this;
    var refreshtimer;
    if (opts.autorefresh) {
        refreshtimer = setInterval(function () {
            gettwitterjson(opts, element);
        }, opts.refreshinterval);
    }

    gettwitterjson(opts, element);

  };

  $.fn.twitterfeed.defaults = {
    autorefresh: true,
    url: "coblezc-tweets.txt",
    displaylimit: 50,
    showretweets: true,
    showtweetlinks: true,
    autorefresh: false,
    refreshinterval: 60000
  };




  function gettwitterjson(opts, element) {

      var showretweets = opts.showretweets;
      var showtweetlinks = opts.showtweetlinks;
      var displaylimit = opts.displaylimit;

      var headerHTML = '';
      var loadingHTML = '';


      //Enter path to tweet cache
      $.getJSON(opts.url + "?" + Math.random(),
          function (feeds) {
              feeds = feeds.statuses; //search returns an array of statuses
              //alert(feeds);
              var feedHTML = '';
              var displayCounter = 1;
              for (var i = 0; i < feeds.length; i++) {
                  var tweetscreenname = feeds[i].user.name;
                  var tweetusername = feeds[i].user.screen_name;
                  var profileimage = feeds[i].user.profile_image_url_https;
                  var status = feeds[i].text;
                  var isaretweet = true;
                  var isdirect = true;
                  var tweetid = feeds[i].id_str;

                  //If the tweet has been retweeted, get the profile pic of the tweeter
                  if (typeof feeds[i].retweeted_status != 'undefined') {
                      profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
                      tweetscreenname = feeds[i].retweeted_status.user.name;
                      tweetusername = feeds[i].retweeted_status.user.screen_name;
                      tweetid = feeds[i].retweeted_status.id_str
                      isaretweet = true;
                  };


                  if (((showretweets == true) || ((isaretweet == false) && (showretweets == false)))) {
                      if ((feeds[i].text.length > 1) && (displayCounter <= displaylimit)) {
                          if (showtweetlinks == true) {
                              status = addlinks(status);
                          }

                          if (displayCounter == 1) {
                              feedHTML += headerHTML;
                          }

                          feedHTML += '<div class="twitter-article">';
                          feedHTML += '<div class="twitter-pic"><a href="https://twitter.com/' + tweetusername + '" ><img src="' + profileimage + '"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
                          feedHTML += '<div class="twitter-text"><p><span class="tweetprofilelink"><strong><a href="https://twitter.com/' + tweetusername + '" >' + tweetscreenname + '</a></strong> <a href="https://twitter.com/' + tweetusername + '" >@' + tweetusername + '</a></span><span class="tweet-time"><a href="https://twitter.com/' + tweetusername + '/status/' + tweetid + '">' + relative_time(feeds[i].created_at) + '</a></span><br/>' + status + '</p></div>';
                          feedHTML += '</div>';
                          displayCounter++;
                      }
                  }
              }

              element.html(feedHTML);
          });
  }

  //Function modified from Stack Overflow

  function addlinks(data) {
      //Add link to all http:// links within tweets
      data = data.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function (url) {
          return '<a href="' + url + '" >' + url + '</a>';
      });

      //Add link to @usernames used within tweetss
      data = data.replace(/\B@([_a-z0-9]+)/ig, function (reply) {
          return '<a href="http://twitter.com/' + reply.substring(1) + '" style="font-weight:lighter;" >' + reply.charAt(0) + reply.substring(1) + '</a>';
      });
      return data;


      //To do: add link to #hashtags used within tweets
      //need to fix the regex
      /*data = data.replace(/\B#\w*([a-zA-Z])+\w*, function(hashtag) {
return '<a href="http://twitter.com/search?q=%23'+hashtag.substring(1)+'" style="font-weight:lighter;" >'+hashtag.charAt(0)+hashtag.substring(1)+'</a>';
});
return data;*/
  }


  function relative_time(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
      var shortdate = time_value.substr(4, 2) + " " + time_value.substr(0, 3);
      delta = delta + (relative_to.getTimezoneOffset() * 60);

      if (delta < 60) {
          return '1m';
      } else if (delta < 120) {
          return '1m';
      } else if (delta < (60 * 60)) {
          return (parseInt(delta / 60)).toString() + 'm';
      } else if (delta < (120 * 60)) {
          return '1h';
      } else if (delta < (24 * 60 * 60)) {
          return (parseInt(delta / 3600)).toString() + 'h';
      } else if (delta < (48 * 60 * 60)) {
          //return '1 day';
          return shortdate;
      } else {
          return shortdate;
      }
  }})(window, jQuery);
