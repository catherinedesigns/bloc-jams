//Store information such as album title, artist, label, songs, etc.
// 1st Album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// 2nd Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

// Checkpoint 24 homework: 3rd album
// var albumBeethoven = {
//     title: 'The Symphonies',
//     artist: 'Ludwig van Beethoven',
//     label: 'Unknown',
//     year: '1813',
//     albumArtUrl: 'images/album_covers/09.png',
//     songs: [
//         { title: 'Symphony No.1', duration: '27:49' },
//         { title: 'Symphony No.2', duration: '32:08' },
//         { title: 'Symphony No.3', duration: '55:13'},
//         { title: 'Symphony No.4', duration: '37:27' },
//         { title: 'Symphony No.5', duration: '33:42'},
//         { title: 'Symphony No.6', duration: '42:08'},
//         { title: 'Symphony No.7', duration: '41:47'},
//         { title: 'Symphony No.8', duration: '27:02'},
//         { title: 'Symphony No.9', duration: '1:05:39'}
//     ]
// };


//Generate the song row content
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

     return $(template);
};





//Checkpoint26 - change the song number to the pause button
var findParentByClassName = function(element, targetClass){
  if(element){
    var currentParent = element.parentElement;
    while (currentParent.className !== targetClass && currentParent.className !== null) {
      currentParent = currentParent.parentElement;
    }
    return currentParent;
  }
};


//Checkpoint26 - getSongItem() method
var getSongItem = function(element){
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
        return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
        return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
        return element;
    default:
        return;
  }
};


var clickHandler = function(targetElement) {

 var songItem = getSongItem(targetElement);

 if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
       } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
       songItem.innerHTML = playButtonTemplate;
       currentlyPlayingSong = null;

     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
  };





//Set the current album
//Call this function when the window loads.
var setCurrentAlbum = function(album) {
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




 // Elements we'll be adding listeners to
 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');

 // Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
//We set it to null so that no song is identified as playing until we click one.
var currentlyPlayingSong = null;

 window.onload = function() {
      setCurrentAlbum(albumPicasso);

      songListContainer.addEventListener('mouseover', function(event) {
        // #1 target stores the DOM where the event occurred
        //The console output shows that moused-over elements will fire an event that eventually registers with the table's event listener.
        // Only target individual song rows during event delegation
                if (event.target.parentElement.className === 'album-view-song-item') {
                  var songItem = getSongItem(event.target);

                      if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                      songItem.innerHTML = playButtonTemplate;
                      }
                }
          });

              for (var i = 0; i < songRows.length; i++) {
                  songRows[i].addEventListener('mouseleave', function(event) {
                      // Revert play button back to numbers when the mouse leaves
                      // #1 we've cached the song item that we're leaving in a variable. Referencing  getSongItem() repeatedly causes multiple queries that can hinder performance. We've done the same with the song number.
                      var songItem = getSongItem(event.target);
                      var songItemNumber = songItem.getAttribute('data-song-number');

                      // #2 we've added the conditional that checks that the item the mouse is leaving is not the current song, and we only change the content if it isn't.
                      if (songItemNumber !== currentlyPlayingSong) {
                          songItem.innerHTML = songItemNumber;
                      }
                  });
                  songRows[i].addEventListener('click', function(event) {
                    clickHandler(event.target);
                  });
            }
  };
