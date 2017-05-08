	var start = (function () {
		var file_drop = document.getElementById('allsongs');
		var player;
		var audiofiles = [];
		var currentFile;
		var playlistNum = 0;
		var files = [];
		var lastIndex=0;
		var shuffle=false;
		var repeat=false;
//
//
		function handlePause(e) {
			player.pause();
		}

		function playFile(source) {

			var freader = new FileReader();
			var f = audiofiles[source];
			freader.onload = function (e) {
				//var player = document.getElementById('player');
				player.src = e.target.result;
				console.log(e.target.result);
				player.play();
				nowplayingtext(currentFile);
				console.log(player.duration);
			};
			currentFile = source;
			freader.readAsDataURL(f);

		}
	 function handleDrop(e) {
	        e.stopPropagation();
	        e.preventDefault();
	        files = e.dataTransfer.files;
	        var output=[];
	        var i,f;
	        for(i = 0; f = files[i]; i++) {
	            output.push('<li draggable=true><strong>', f.name.split(".")[0], '<'+'/strong> ', '<'+'/li>');
	            if(f.type === 'audio/mp3') {
	                audiofiles.push(f);
	            }
	        }

	        document.getElementById('filelistul').innerHTML +=output.join('');
	        listInitializer();
	    }

		function handleDragOver(e) {
			e.stopPropagation();
			e.preventDefault();
		}

		function handleEnded(e) {

			var state=currentFile;
			if(shuffle)
				currentFile=Math.floor((Math.random() * audiofiles.length));
			if(repeat)
				currentFile=state;
			if(!shuffle && !repeat){
				currentFile++;
				if (currentFile === audiofiles.length) {
					currentFile = 0;

				}
			}	
			playFile(currentFile);
			
		}

		function nowplayingtext(currentFile) {
			var ele = document.getElementById('nowplaying');
			ele.innerHTML = "<marquee>" + audiofiles[currentFile].name.split(".")[0] + "</marquee>";
		}

		function handleReverse(e) {
			currentFile--;
			if (currentFile === -1) {
				currentFile = audiofiles.length - 1;
			}
			playFile(currentFile);
		}

		function handlePlayerLoad(e) {
			//var player = document.getElementById('player');
			playFile(0);
		}

	function shufflefunc(e){
		shuffle=(!shuffle);
		
		var icon=document.getElementById('shuffle');
		if(shuffle)
			icon.setAttribute("src","shuffle_on.png");
		else
			icon.setAttribute("src","shuffle.png");

	}

	function repeatfunc(e){
		repeat=(!repeat);
		
		var icon=document.getElementById('repeat');
		if(repeat)
			icon.setAttribute("src","repeat_on.png");
		else
			icon.setAttribute("src","repeat.png");
	}
		function handlePlay(e) {
			//var player = document.getElementById('player');
			if (currentFile) {
				player.play();
			} else {
				playFile(0);
			}
			/*window.setTimeout(function () {
				return handleProgress({
					target: player
				});
			}, 1000);*/
		}

		function listInitializer() {
			var list = document.querySelectorAll('#filelistul > li');
			for (var i = 0; i < list.length; i++) {
				var id="s"+i;
				list[i].setAttribute("id", id);
				document.getElementById(id).addEventListener('dblclick', listclick);
				document.getElementById(id).addEventListener('dragend', handleDeleteEnd);
				lastIndex++;
			}
		}

		function listclick(e) {
			currentFile=e.path[1].id.substring(1);
			playFile(currentFile);
			console.log(audiofiles[currentFile]);

		}
		
		function handleDeleteEnd(e){
			e.dataTransfer.effectAllowed = 'move';
			var parent=document.getElementById('filelistul');
			var id=this.getAttribute("id").substring(1);
			audiofiles.splice(id,1);
			if(id<currentFile)
				currentFile--;
			parent.removeChild(this);
			listInitializer();
		}

		return {
			init: function () {
				var file_drop = document.getElementById('allsongs');
				var myplaylist = document.getElementById('playlistsongs');

				player = document.getElementById('player');
				file_drop.addEventListener('dragover', handleDragOver, false);
				file_drop.addEventListener('drop', handleDrop, false);
			
				/*myplaylist.addEventListener('dragover', handleDragOver, false);
				myplaylist.addEventListener('drop', handleDrop, false);*/
				player.addEventListener('ended', handleEnded, false);
				player.addEventListener('load', handlePlayerLoad, false);
				//document.querySelectorAll('#filelistul > li').addEventListener('click', listclick, false);
				document.getElementById('next').addEventListener('click', handleEnded, false);
				document.getElementById('prev').addEventListener('click', handleReverse, false);
				document.getElementById('play').addEventListener('click', handlePlay, false);
				document.getElementById('pause').addEventListener('click', handlePause, false);
				document.getElementById('shuffle').addEventListener('click', shufflefunc, false);
				document.getElementById('repeat').addEventListener('click', repeatfunc, false);

			}
		};
	})();