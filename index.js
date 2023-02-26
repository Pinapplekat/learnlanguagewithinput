// var relativePathPrefix = '../'
// document.getElementById("folder").addEventListener(
//   "change",
//   function (event) {
//     var output = document.querySelector("ul");
//     var files = event.target.files;

//     for (var i = 0; i < files.length; i++) {
//       var item = document.createElement("li");
//       //   item.innerHTML = files[i];
//       //   output.appendChild(item);
//       console.log(files[i]);
//       if (!files[i].name.includes(".")) {
//         const directoryTitle = document.createElement("")
//       }
//     }
//   },
//   false
// );
var subs;
function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        console.log(file);
        const urlObj = URL.createObjectURL(file);
        console.log(urlObj);
        const video = document.createElement("video");

        // Clean up the URL Object after we are done with it
        video.addEventListener("load", () => {
          URL.revokeObjectURL(urlObj);
        });
        document.body.appendChild(video);
        video.controls = "true";
        video.src = urlObj;
        video.id = "video";
        video.style.width = "calc(100vw - 10px)";
        video.style.height = "calc(100vh - 10px)";
        document.getElementById("drop_zone").remove();
        const srtSelect = document.createElement("input");
        srtSelect.type = "file";
        srtSelect.accept = ".vtt";
        document.body.appendChild(srtSelect);
        srtSelect.onchange = (e) => {
          subs = e.target.files[0];
          const track = document.createElement("track");
          var subsUrl = URL.createObjectURL(subs);
          track.kind = "captions";
          track.src = subsUrl;
          track.srclang = "en";
          track.label = "Captions";
          track.default = "default";
          video.appendChild(track);
          var fr = new FileReader();
          fr.onload = function () {
            // console.log(fr.result);
            convertVttToJson(fr.result).then((result) => {
              console.log(result);
              subs = result;
            });
          };

          fr.readAsText(subs);
        };
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {});
  }
}
function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

// setInterval(() => {
//   var video = document.getElementById("video")
//   var subtitles = document.getElementById("subtitles")
//   var seconds = video.currentTime % 60;
//   // seconds = seconds * 1000
//   // seconds = Math.floor(seconds)
//   // seconds = seconds / 1000
//   // console.log(seconds)
//   subs.forEach(function(x){
//     if(x.start > (seconds-0.01) && x.start < (seconds+0.01)){
//     // if(x.start == seconds){
//       subtitles.innerHTML = x.text
//     }
//     if(x.end > (seconds-0.01) && x.end < (seconds+0.01)){
//       subtitles.innerHTML = ''
//     }
//   })
// },1)
var sentence;
setInterval(() => {
  var video = document.getElementById("video");
  if (video.currentTime == video.duration) {
    if (sentence) return;
    console.log("Video finished, selecting random sentence.");
    subkeys = Object.keys(subs);
    sentence = subs[Math.floor(Math.random() * subs.length)];
    console.log(sentence.part + " - " + sentence.start);
    alert("You will now be set back to the random sentence of the video");
    goto(sentence.start, sentence.end);
  }
}, 1);

function goto(start, end) {
  var video = document.getElementById("video");
  console.log("start: " + start / 1000);
  video.currentTime = start / 1000;
  video.play();
  console.log("end: " + end / 1000);
  console.log(video.currentTime);
  var isStopped = false;
  setInterval(() => {
    if (isStopped == true) return;
    if (video.currentTime > end / 1000) {
      console.log("stopping video");
      video.pause();
      isStopped = true;
      var another = confirm("Find another?");
      if (another == true) {
        subkeys = Object.keys(subs);
        sentence = subs[Math.floor(Math.random() * subs.length)];
        console.log(sentence.part + " - " + sentence.start);
        goto(sentence.start, sentence.end);
      } else {
        console.log("user does not want to find another sentence")
      }
    }
  }, 1);
}
