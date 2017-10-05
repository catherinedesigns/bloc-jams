//Store information such as album title, artist, label, songs, etc.
// Example Album
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

// Another Example Album
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

//Checkpoint 24 homework: 3rd album
var albumBeethoven = {
    title: 'The Symphonies',
    artist: 'Ludwig van Beethoven',
    label: 'Unknown',
    year: '1813',
    albumArtUrl: 'images/album_covers/09.png',
    songs: [
        { title: 'Symphony No.1', duration: '27:49' },
        { title: 'Symphony No.2', duration: '32:08' },
        { title: 'Symphony No.3', duration: '55:13'},
        { title: 'Symphony No.4', duration: '37:27' },
        { title: 'Symphony No.5', duration: '33:42'},
        { title: 'Symphony No.6', duration: '42:08'},
        { title: 'Symphony No.7', duration: '41:47'},
        { title: 'Symphony No.8', duration: '27:02'},
        { title: 'Symphony No.9', duration: '1:05:39'}
    ]
};


//Generate the song row content
var createSongRow = function(songNumber, songName, songLength) {
    var template =
       '<tr class="album-view-song-item">'
     + '  <td class="song-item-number">' + songNumber + '</td>'
     + '  <td class="song-item-title">' + songName + '</td>'
     + '  <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

    return template;
};


//Set the current album
// #1 Select all of the HTML elements required to display on the album page: title, artist, release info, image, and song list. We want to populate these elements with information. To do so, we assign the corresponding values of the album objects' properties to the HTML elements.
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

//Call this function when the window loads.
var setCurrentAlbum = function(album) {

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

 window.onload = function() {
     setCurrentAlbum(albumPicasso);

     var albums = [albumPicasso, albumMarconi, albumBeethoven];
     var index = 1; //declare index outside of the function so when it increases by 1, that state is remembered

     albumImage.addEventListener("click", function(event) {
       setCurrentAlbum(albums[index]);
       index++;
       if (index == albums.length) {
         index = 0;
       }
     });
 };
