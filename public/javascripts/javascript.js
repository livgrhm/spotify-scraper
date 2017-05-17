$(document).ready(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);

    while(e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  function logout() {
    $.ajax({
      url: 'auth/refresh_token',
      data: {
        'refresh_token': refresh_token
      }
    }).done(function(data) {
      $('.unauth').each(function(){
        $(this).show();
      });
      $('.auth').each(function(){
        $(this).hide();
      });
      $('#playlists').html('');
      window.location.hash = '';
      access_token = '';
      refresh_token = '';
    });
  }

  /**
   * AJAX request to Spotify
   * Gets user data using auth token
   */
  function showUserData() {
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        var userData = response;
        console.log(userData);

        // Show user avatar
        $('#avatar').attr('src', userData.images[0].url);

        $('#title').html(userData.display_name);
        $('#title').attr('href', userData.external_urls.spotify);

        // Show auth nav
        $('#logout').click(function() {
          logout();
        });

        $('#scrape').click(function() {
          listPlaylists(userData.id);
        });
      },
      error: function() {
        alert('Access Token Error');
      }
    });
  }

  function createUl(list) {
    var newUl = $('<ul/>');
    $.each(list, function(key, value) {
      var newLi = $('<li/>');
      newLi.append('<a href="#">' + value + '</a>');
      newUl.append(newLi);
    });
    return newUl;
  }

  function listPlaylists(userId) {
    $.ajax({
      url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        var raw = response.items;
        var playlists = [];
        $.each(raw, function(key, value) {
          playlists.push(value.name);
        });
        var playlistsUl = createUl(playlists);
        $('#playlists').html(playlistsUl);
      }
    });
  }

  // Get URL Params
  var params = getHashParams();

  // Get Tokens/errors
  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  // Control Display
  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // 1. get user's auth data to display
      showUserData();
      // Display the page appropriately
      $('.unauth').each(function(){
        $(this).hide();
      });
      $('.auth').each(function(){
        $(this).show();
      });
    } else {
      $('.unauth').each(function(){
        $(this).show();
      });
      $('.auth').each(function(){
        $(this).hide();
      });
    }
  }
});
