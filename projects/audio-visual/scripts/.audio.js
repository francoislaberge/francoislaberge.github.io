var mySound;
var lastupdate;
var peakCount = 250;
var peakArray = new Array();
var peakElem = new Array();
var sfps = 240; // in milliseconds

soundManager.url = './flash/'; 
soundManager.flashVersion = 9;
soundManager.flash9Options.useEQData = true;
soundManager.flash9Options.useWaveformData = true;
soundManager.useHighPerformance = true;
soundManager.allowPolling = true;
soundManager.defaultOptions.whileplaying = sound_process_data;
soundManager.defaultOptions.usePeakData = true;
soundManager.debugMode = false;

function sound_create(filename) {
	mySound = soundManager.createSound({
		id: 'aSound',
		url: filename,
		volume: 50,
		//whileplaying : sound_process_data,
		//usePeakData: true,
		
		onbeforefinish : function() {$('#playbutton').val('play'); paused=true; }
	});	
} 

function sound_process_data() {
	

	for (var i=0; i<this.waveformData.length; i++) {
		waveformData[i] = this.waveformData[i];
	}
	for (var i=0; i<this.eqData.length; i++) {
		eqData[i] = this.eqData[i];
	}	

	var now = new Date().getTime();
	//if ( lastupdate && lastupdate > (now - (1000 / sfps)) ) {
	//	return;
	//} 
	lastupdate = now;
	
	if ( mySound ){
		canvas_set_peakdata(mySound.peakData.left);
	}
	else{
		canvas_set_modifier(0.0);
	}

	//$('#peakL').css('height',Math.floor(this.peakData.left*300)+'px');
	//$('#peakR').css('height',Math.floor(this.peakData.right*300)+'px');
//			render_graph(this.peakData);
}

function sound_toggle_playback() {
	if ( mySound.playState != 1 ) {
		mySound.play();
		$('#playbutton').val('pause');
		paused = false;
	} else { 
		mySound.togglePause();
		$('#playbutton').val('play');
		paused = true;
	}
}


soundManager.onload = function() {
	var songs = [
		'./media/watchingme.mp3',
		'./media/sample.mp3'];
	
	sound_create(songs[0]);
	
	if(!mySound){
		$('#messages').append(
		'<div style="background: grey; color: white; padding: 5px;">'+
			'<p>Couldn\'t load MP3</p>'+
			'<p>To fix this add the current URL to the white list of your Flash player<a href="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html">Here</a></p>'+
		'</div>');
	}
}