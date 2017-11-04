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


// seek() uses the Buzz setTime() method to change the position in a song to a specified time.
var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

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
      '  <tr class="album-view-song-item">'
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      '  <td class="song-item-title">' + songName + '</td>'
      '  <td class="song-item-duration">' + songLength + '</td>'
      '  <td class="song-item-duration">' + filterTimeCode(songLength) + '<td>';
      '  </tr>'
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

        // Trigger this method whenever a song plays
        updateSeekBarWhileSongPlays();
      }

      if (currentlyPlayingSongNumber !== songNumber) {
        // Switch from Play -> Pause button to indicate new song is playing.
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
        currentSoundFile.play(); //play currentSoundFile
        updatePlayerBarSong();

        var $volumeFill = $('.volume .fill');
        var $volumeThumb = $('.volume .thumb');
        $volumeFill.width(currentVolume + '%');
        $volumeThumb.css({left: currentVolume + '%'});

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




// Checkpoint 33
var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10 bind() the [timeupdate] event to [currentSoundFile]. [timeupdate] is a custom Buzz event that fires repeatedly while time elapses during song playback.
         currentSoundFile.bind('timeupdate', function(event) {
             // #11 Calculate the seekBarFillRatio. Use [getTime()] method to get the current time of the song. Use [getDuration()] method to get the total length of the song. Both values return time in seconds.
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });
     }
 };


// Checkpoint 33
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
   var offsetXPercent = seekBarFillRatio * 100;
   // #1
   offsetXPercent = Math.max(0, offsetXPercent); //make sure percentage isn't less than zero
   // how math.max() works: return the largest of 0 or other numbers
   offsetXPercent = Math.min(100, offsetXPercent); //make sure percentage doesn't exceed 100
   // how math.min() works: return the smallest of 100 or other numbers
   // #2
   var percentageString = offsetXPercent + '%'; // Convert percentage to a string and add %
   $seekBar.find('.fill').width(percentageString);
   $seekBar.find('.thumb').css({left: percentageString});
};


// Checkpoint 33
var setupSeekBars = function() {
    // #6 Use jQuery to find all elements in the DOM with a class of "seek-bar" that are contained within the element with a class of "player-bar". This will return a jQuery wrapped array containing both the song seek control and the volume control.
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3 See Checkpoint diagram
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;

        // Checkpoint 33 Checks the class of the seek bar's parent to determine whether the current seek bar is changing the volume or seeking to a song position
        if ($(this).parent().attr('class') == 'seek-control') {    // If it's the playback seek bar
          seek(seekBarFillRatio * currentSoundFile.getDuration()); // seek to the position of the song determined by [seekBarFillRatio]
        } else {                                                  // Otherwise
          setVolume(seekBarFillRatio * 100);                      // set the volume based on [seekBarFillRatio]
        }

        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
    });

        // #7  Find elements with a class of [.thumb] inside $seekBars and add an event listener for the [mousedown] event. A [click] event fires when a mouse is pressed and released quickly, but the [mousedown] event will fire as soon as the mouse button is pressed down. The [mouseup] event is the opposite: it fires when the mouse button is released.
        $seekBars.find('.thumb').mousedown(function(event) {
            // #8 Take the context of the event and wrap it in jQuery. In this scenario, [this] will be equal to the [.thumb] node that was clicked. Because we are attaching an event to both the song seek and volume control, this is an important way for us to determine which of these nodes dispatched the event. Use the  parent method, which will select the immediate parent of the node. This will be whichever seek bar this [.thumb] belongs to.
            var $seekBar = $(this).parent();

            // #9 bind() behaves similarly to addEventListener() in that it takes a string of an event instead of wrapping the event in a method. bind() allows you to namespace event listeners.
            // Attach the mousemove event to $(document) to drag the thumb after mousing down, even when the mouse leaves the seek bar.
            $(document).bind('mousemove.thumb', function(event){
                var offsetX = event.pageX - $seekBar.offset().left;
                var barWidth = $seekBar.width();
                var seekBarFillRatio = offsetX / barWidth;

                // Checkpoint 33 Checks the class of the seek bar's parent to determine whether the current seek bar is changing the volume or seeking to a song position
                if ($seekBar.parent().attr('class') == 'seek-control') {  // If it's the playback seek bar
                 seek(seekBarFillRatio * currentSoundFile.getDuration()); // seek to the position of the song determined by [seekBarFillRatio]
                } else {                                                  // Otherwise
                 setVolume(seekBarFillRatio);                             // set the volume based on [seekBarFillRatio]
                }

                updateSeekPercentage($seekBar, seekBarFillRatio);
            });

            // #10 Bind the mouseup event with a [.thumb] namespace
            $(document).bind('mouseup.thumb', function() {
                $(document).unbind('mousemove.thumb');
                $(document).unbind('mouseup.thumb');
            });
      });
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

  // Trigger this method whenever a song plays
  updateSeekBarWhileSongPlays();


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

  // Trigger this method whenever a song plays
  updateSeekBarWhileSongPlays();


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






// Checkpoint 32 homework Hovsep
var togglePlayFromPlayerBar = function() {
  var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
  if (currentSoundFile.isPaused()){ //If a song is paused
    $currentlyPlayingCell.html(pauseButtonTemplate); // Change the songNumberCell to a pause button
    $(this).html(playerBarPauseButton); // Change the html of the playerBar to a pause button
    currentSoundFile.play(); // and play the song
  } else { // If a song is playing
    $currentlyPlayingCell.html(playButtonTemplate); // Change the songNumberCell to a play button
    $(this).html(playerBarPlayButton); // Change the html of the playerBar to a play button
    currentSoundFile.pause(); // and pause the song
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


// Checkpoint 33 homework
//#1
var setCurrentTimeInPlayerBar = function(currentTime) {
  // set the text of the element with the [.current-time] class to the current time in the song
  $('.current-time').text(currentTime);
};
//Add the method to updateSeekBarWhileSongPlays() so the current time updates with song playback.
updateSeekBarWhileSongPlays(setCurrentTimeInPlayerBar);

//#2
var setTotalTimeInPlayerBar = function(totalTime){
  $('.total-time').text(totalTime);
};
//Add the method to updatePlayerBarSong() so the total time is set when a song first plays.
updatePlayerBarSong(setTotalTimeInPlayerBar);

//#3
var filterTimeCode = function(timeInSeconds){
  // Use the parseFloat() method to get the seconds in numbers format
  parseFloat(timeInSeconds);
  // Store variables for whole seconds and whole minutes. Use Math.floor() method
  var seconds = "0" + math.floor(timeInSeconds % 60);
  var minutes = math.floor(timeInSeconds / 60);
  // return time in XX:XX format
  return minutes + ":" + seconds.slice(-2); // Negative means a position starting from the end of the set. Index of first number is 0.
};


//#4 Wrap the arguments passed to [setCurrentTimeInPlayerBar()] and [setTotalTimeInPlayerBar()] in a filterTimeCode() call so the time output below the seek bar is formatted.
setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
setTotalTimeInPlayerBar(filterTimeCode(this.getTime()));

//#5 Wrap the [songLength] variable in createSongRow() in a filterTimeCode() call so the time lengths are formatted.
setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));







$(document).ready(function() {
      setCurrentAlbum(albumPicasso);
      setupSeekBars();
      $previousButton.click(previousSong);
      $nextButton.click(nextSong);
      // Checkpoint 32 homework
      // add a click() event to this variable, use togglePlayFromPlayerBar() as an event handler
      $playPause.click(togglePlayFromPlayerBar);
  });
