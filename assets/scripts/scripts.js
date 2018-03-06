/*
libraries used: jQuery (DOM manipulation), progressbar.js (circle/line progress), howler.js (sound)
tested on: Chrome, FireFox and Edge
defining playlist variable, containing all the core information about songs.
@title: song title
@author: song author
@background: path, used for each song
@song: Howl object - containing source to song and onend event listener
*/
const playList = [
	{
		title: 'Mazurka in D Mayor, B. 4', 
		author: 'Frédéric Chopin',
		background: 'assets/backgrounds/5938870365_a0c951015b_o.jpg',
		song: new Howl({
			src: ['assets/music/chopin-mazurka-in-d-major-b4.mp3'],
			onend: function() {
				playNextSong();
			}
		}) 
	},
	{
		title: 'Mazurka in D Mayor, B. 71',
		author: 'Frédéric Chopin',
		background: 'assets/backgrounds/5966942286_682dcb45b6_o.jpg',
		song: new Howl({
			src: ['assets/music/chopin-mazurka-in-d-major-b71.mp3'],
			onend: function() {
				playNextSong();
			}
		})
	},
	{
		title: 'Andantino \'Spring\', B. 117',
		author: 'Frédéric Chopin',
		background: 'assets/backgrounds/6181316022_a513b78a87_o.jpg',
		song: new Howl ({
			src: ['assets/music/chopin-spring.mp3'],
				onend: function() {
				playNextSong();
			}
		}),
	},
	{
		title: 'Tarantelle, Op. 43',
		author: 'Frédéric Chopin',
		background: 'assets/backgrounds/6284055448_e0d5c1af67_o.jpg',
		song: new Howl ({
			src: ['assets/music/chopin-tarantelle-op43.mp3'],
				onend: function() {
				playNextSong();
			}
		})
	}
];

//progress bars and circles configuration
const circleProgress = new ProgressBar.Circle('#circleProgress', {
  strokeWidth: 1,
  easing: 'linear',
  duration: 1000,
  color: '#fff',
  trailColor: '#fff',
  trailWidth: 0.4,
  svgStyle: {width: '100%', height: '100%'}
});

const lineProgress = new ProgressBar.Line('#lineProgress', {
  strokeWidth: 1,
  easing: 'linear',
  duration: 1000,
  color: '#fff',
  trailColor: '#fff', 
  trailWidth: 0.4,
  svgStyle: null
});

//loading the first song by default
let currentSongIndex = 0;

//calculating current time of active song, always refers to current song. Returns current time in seconds
function calculateCurrentTime() {
	return Math.floor(playList[currentSongIndex].song.seek());
}

/*
calculating percent progress
params: @secondsInput, integer
returns secondsInput divided by duration of current song
*/
function calculateCurrentProgress(secondsInput) {
	return secondsInput / playList[currentSongIndex].song.duration();
}

/*
returns time converted to analog format (mm:ss). Called by updateComponents function
params: @secondsInput, integer
*/
function convertTime(secondsInput) {
  const seconds = secondsInput % 60;
  const minutes = Math.floor((secondsInput / 60) % 60);
  return (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
}
/*
updates song information (title, author, background). Called each time new song is played
params: song, object (refers individual object in playList array)
*/
function updateUserInterface(song) {
	$('#songStatus .title').text(song.title);
	$('#songStatus .author').text(song.author);
	$('.song').removeClass('selected');
	$($('.song')[currentSongIndex]).addClass('selected');
	$('#background').css('background-image', 'url('+song.background+')');
}

/*
calculates time & progress and updates application components (time, line and circle progressbars)
*/
function updateComponents() {
	const time = calculateCurrentTime();
	const progress = calculateCurrentProgress(time);
	$('.timer').text(convertTime(time));
	circleProgress.animate(progress);
	lineProgress.animate(progress);
}

//plays currentSong and calls updateUserInterface function
function playCurrentSong() {
	const currentSong = playList[currentSongIndex];
	updateUserInterface(currentSong);
	return currentSong.song.play();
}

//pauses current song
function pauseCurrentSong() {
	return playList[currentSongIndex].song.pause();
}

//stops current song
function stopCurrentSong() {
	return playList[currentSongIndex].song.stop();
}

//stops current song, updates currentSongIndex variable with next index and calls playCurrentSong function
function playNextSong() {
	stopCurrentSong();
	const nextIndex = (currentSongIndex === playList.length-1) ? 0 : currentSongIndex + 1;
	currentSongIndex = nextIndex;
	playCurrentSong();
}

//stops current song, updates currentSongIndex variable with previous index and calls playCurrentSong function
function playPreviousSong() {
	stopCurrentSong();
	const prevIndex = (currentSongIndex === 0) ? playList.length - 1  : currentSongIndex - 1;
	currentSongIndex = prevIndex;
	playCurrentSong();
}

//renders playlist depending on playList content
function renderPlayList() {
	const songList = $('#songList');
	songList.append('<hr>');
	playList.forEach(function(song) {
		songList.append('<div class=\"song\"><h3 class=\"title\">'+song.title+'</h3><p class=\"author\">'+song.author+'</p></div>');
	});
	songList.append('<hr>');
	songList.find('.song').first().addClass('selected'); //mark first song as
}


//set application behaviour

$(document).ready(function(){
	//listen to song status and update components accordingly - don't update before all data loads, thus timeOut
	setTimeout(function(){
		setInterval(function(){
			updateComponents();
		},500);
	}, 1000);

	//render playList
	renderPlayList();

	//listen to click on hamburger icon, animate & toggle visibility of components
	$('.hamb').on('click', function() {
	  $('.hamb').toggleClass('active');
	  $('#playerInterface').toggleClass('active');
	  $('#songStatus').toggleClass('active');
	  $('#circleProgress').toggleClass('active');
	  $('#innerCircle').toggleClass('active');
	  $('#songList').toggleClass('active');
	});

	//listen to click on playlist songs
	$('.song').on('click', function() {
		stopCurrentSong();
	  $('.song').removeClass('selected');
	  $(this).addClass('selected');
	  currentSongIndex = $(this).index('.song');
	  playCurrentSong();
	});

	//listen to click on play icon
	$('#play').on('click', function() {
		const currentSong = playList[currentSongIndex].song;
		if(currentSong.playing()) {
			currentSong.pause();
		} else {
			playCurrentSong();
		} 
	});

	//listen to click on next icon
	$('#nextSong').on('click', playNextSong);

	//listen to click onprevious icon
	$('#prevSong').on('click', playPreviousSong);
});
