// Checkpoint 31 homework
var setSong = function(songNumber){
  if (currentSoundFile) {
         currentSoundFile.stop(); // Stop multiple songs from playing concurrently. If click to play another song before current song is finished, stop current song.
     }
  // Not using var: re-assign the variable
  // Using var: re-declare the variable
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        // #1 assign a new [sound] object. Pass the audio file via the  [audioUrl] property on the [currentSongFromAlbum] object.
     currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2 pass in a settings object that has two properties, [formats] and [preload]
         // [format] is an array of strings with acceptable audio formats. Only include the 'mp3' string because all the songs are in mp3 format.
         // Setting preload to [true] tells Buzz to load the mp3s as soon as the page loads.
         formats: [ 'mp3' ],
         preload: true
     });
     setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};




// Checkpoint 31 homework
var getSongNumberCell = function(number){
  return $('.song-item-number[data-song-number="' + number + '"]');
  //return the song number element that corresponds to that song number
};

//Generate the song row content
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

     var $row = $(template);


// Checkpoint 31 refactor replaced by Checkpoint 32 refactor -- see below
// var clickHandler = function() {
//    var songNumber = parseInt($(this).attr('data-song-number'));
//
//    if (currentlyPlayingSongNumber !== null) {
//      // Revert to song number for currently playing song because user started playing new song.
//      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
//      currentlyPlayingCell.html(currentlyPlayingSongNumber);
//    }
//    if (currentlyPlayingSongNumber !== songNumber) {
//      // Switch from Play -> Pause button to indicate new song is playing.
//      $(this).html(pauseButtonTemplate);
//      setSong(songNumber);
//      updatePlayerBarSong();
//    } else if (currentlyPlayingSongNumber === songNumber) {
//      // Switch from Pause -> Play button to pause currently playing song.
//      $(this).html(playButtonTemplate);
//      $('.main-controls .play-pause').html(playerBarPlayButton);
//      currentlyPlayingSongNumber = null;
//      currentSongFromAlbum = null;
//    }
//  };


 // Checkpoint 32 refactor clickHandler
 var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing.
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play(); //play currentSoundFile
      updatePlayerBarSong();
    } else if (currentlyPlayingSongNumber === songNumber) {

          if (currentSoundFile.isPaused()) { // If currentSoundFile is paused
            $(this).html(pauseButtonTemplate);     //revert the icon in the song row to pause
            $('.main-controls .play-pause').html(playerBarPauseButton);  //revert the icon in the playerBar to pause
            currentSoundFile.play(); //start playing the song again

          } else { // If currentSoundFile is not paused
            $(this).html(playButtonTemplate);//set the icon in the song row to play
            $('.main-controls .play-pause').html(playerBarPlayButton); //set the icon in the playerBar to play
            currentSoundFile.pause();//pause currentSoundFile
          }
      }
  };


      //Checkpoint 31 refactor
      var onHover = function(event) {
           var songNumberCell = $(this).find('.song-item-number');
           var songNumber = parseInt(songNumberCell.attr('data-song-number'));
           //change currentlyPlayingSong to currentlyPlayingSongNumber because we have set a new var to be currentlyPlayingSongNumber
           if (songNumber !== currentlyPlayingSongNumber) {
               songNumberCell.html(playButtonTemplate);
           }
       };
       //Checkpoint 31 refactor
      var offHover = function(event) {
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));


         if (songNumber !== currentlyPlayingSongNumber) {
             songNumberCell.html(songNumber);
         }
        //  console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };

     // #1
     $row.find('.song-item-number').click(clickHandler);
     // #2
     $row.hover(onHover, offHover);
     // #3
     return $row;
};





//Set the current album
//Call this function when the window loads.
var setCurrentAlbum = function(album) {
      currentAlbum = album;
// Replace each instance of getElementsByClassName with a jQuery selector and use CSS-style syntax to select the elements. Add a $ to the start of each variable name because they now reference jQuery objects.
       var $albumTitle = $('.album-view-title');
       var $albumArtist = $('.album-view-artist');
       var $albumReleaseInfo = $('.album-view-release-info');
       var $albumImage = $('.album-cover-art');
       var $albumSongList = $('.album-view-song-list');


     // #2 Album details. Refactor using jQuery
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
     // attr() method changes the element attribute using the same arguments

     // #3 Clear contents of album song list container
     $albumSongList.empty();

     // #4 Build a list of songs from album JavaScript object
     for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
        //jQuery append() method changes the element attribute using the same arguments
     }
 };


// Checkpoint 31 Track the index of the current song
 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 // Checkpoint 31 Update playerBarSong
 var updatePlayerBarSong = function() {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

// Checkpoint 31 nextSong
var nextSong = function(){
  //Use the trackIndex() helper function to get the index of the current song
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Increment the song
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber;

  // Set a new current song
  // currentlyPlayingSongNumber = currentSongIndex + 1;
  // currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  // Update the player bar information
  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  //Update the HTML of the previous song's .song-item-number element with a number.
  $nextSongNumberCell.html(pauseButtonTemplate);

  //Update the HTML of the new song's .song-item-number element with a pause button.
  $lastSongNumberCell.html(lastSongNumber);
};


//Checkpoint 31 previousSong function
var previousSong = function(){
  //Use the trackIndex() helper function to get the index of the current song
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // Decrement the song
  currentSongIndex--;

  if(currentSongIndex < 0){
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  // Save the last song number before changing it
  var lastSongNumber = currentlyPlayingSongNumber

  // Set a new current song
  setSong(currentSongIndex + 1);
  currentSoundFile.play();

  // Update the player bar information
  updatePlayerBarSong();
  $('.main-controls .play-pause').html(playerBarPauseButton); // Revert the icon to pause

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);


  //Update the HTML of the previous song's .song-item-number element with a number.
  $previousSongNumberCell.html(pauseButtonTemplate);

  //Update the HTML of the new song's .song-item-number element with a pause button.
  $lastSongNumberCell.html(lastSongNumber);
};




// Checkpoint 32 homework
var togglePlayFromPlayerBar = function() {
   var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
   console.log($currentlyPlayingCell); // for debugging purposes only
    // if a song is paused && play button is clicked in the player bar
  if (currentSoundFile.isPaused() && $('.main-controls .play-pause').html(playerBarPlayButton)) {
    // change the song number cell to a pause button
    songNumberCell.html(pauseButtonTemplate);
    // change the html of the playerBar to a pause button
    $('.main-controls .play-pause').html(playerBarPauseButton);
    //play the song
    currentSoundFile.play();
  } else {
    // if a song is playing (currentSoundFile exists) && pause button is clicked in the playerBar
    // change the songNumberCell to a playButtonTemplate
    songNumberCell.html(playButtonTemplate);
    // change the html of the playerBar to a play button
    $('.main-controls .play-pause').html(playerBarPlayButton);
    // pause the song
    currentSoundFile.pause();
  }
};




 // Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//A set of variables in the global scope that hold current song and album information.
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80; // Set initial volume to 80



var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');


// Checkpoint 32 homework
// Create a variable to hold the $('.main-controls .play-pause') selector and add a click() event to it in the $(document).ready() block with togglePlayFromPlayerBar() as an event handler.

// Create a variable to hold the $('.main-controls .play-pause') selector
var $playPause = $('.main-controls .play-pause');
// in the $(document).ready() block

$(document).ready(function() {
      setCurrentAlbum(albumPicasso);
      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      // Checkpoint 32 homework
      // add a click() event to this variable, use togglePlayFromPlayerBar() as an event handler
      $playPause.click(togglePlayFromPlayerBar);
  });
