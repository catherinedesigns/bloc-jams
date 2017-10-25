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

    return template;
};





//Checkpoint26 - change the song number to the pause button
// var findParentByClassName = function(element, targetClass){
//   if(element){
//     var currentParent = element.parentElement;
//     while (currentParent.className !== targetClass && currentParent.className !== null) {
//       currentParent = currentParent.parentElement;
//     }
//     return currentParent;
//   }
// };





// Checkpoint26 Homework
var findParentByClassName = function(element, targetClass) {
  if (element) {
    var currentParent = element.parentElement;
    //declare a variable named currentParent
    if(!currentParent){
      console.log("No parent found");
    } // If currentParent doesn't exist, print "No parent found"
    while (currentParent.className !== targetClass && currentParent.className !== null) {
        currentParent = currentParent.parentElement;
        //assign a new value to currentParent
        //If current parent under a specific class has a value, but it's not the same as the targetClass
        if(currentParent === null){
          console.log("No parent found with that class name");
        }//In the above situation, check if currentParent has a value. If it doesn't, print "No parent found with that class name"
    }
    return currentParent;
    //If an element is present, it will return [element.parentElement] unless the condition for the [while] loop is met. If the condition for the [while loop] is met, it will return the last thing that [currentParent] was reassigned to.
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
  // #1 Select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list. We want to populate these elements with information. To do so, we assign the corresponding values of the album objects' properties to the HTML elements.
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


     // #2 Assign values to each part of the album (title, artist, year, images)
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);


     // #3 Clear contents of album song list container
     albumSongList.innerHTML = '';

     // #4 Build a list of songs from album JavaScript object
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
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
