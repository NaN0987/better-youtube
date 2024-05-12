console.log("youtube extension shorts is running")

const qs_shortsClickable = "#shorts-player"
const qs_shortsPlayer = '#shorts-player > div.html5-video-container';
const qs_shortsVideoElement = "#shorts-player > div.html5-video-container > video"
const qs_progressBar2 = "#progress-bar-line"
const qs_newProgressBar = "#shorts-player > div.html5-video-container > div.youtube-shorts-rewind-container"
const qs_videoContainer = "#shorts-player > div.html5-video-container > video"

const qs_progressBarRedPart = "#shorts-player > div.html5-video-container > div > div"

//Remove query strings (?) and fragment identifier (#)
//Returns string
function reformatURL(url){
  let result = url

  //remove query strings
  const queryStringIndex = result.indexOf('?')
  if (queryStringIndex !== -1){
    result = result.slice(0, queryStringIndex)
  } 
  
  //remove fragment identifiers
  const fragmentIndex = url.indexOf('#')
  if (fragmentIndex !== -1){
    result = result.slice(0, fragmentIndex)
  } 

  return result
}

function addProgressBar(){
  console.log("adding progress bar")

  const shortsPlayer = document.querySelectorAll(qs_shortsPlayer);

  if (shortsPlayer) {
    // Insert HTML content into each element
    shortsPlayer.forEach(function(element){
      element.insertAdjacentHTML('beforeend', "<div class=\"youtube-shorts-rewind-container\" style=\"width: 100%; height: 10px; z-index: 500; pointer-events: auto; background-color: rgb(255, 155, 155); position: absolute; left: 0px; right: 0px; top: 845px; transition: height 100ms ease 0s;\"><div class=\"youtube-shorts-rewind-container__inner\" style=\"background-color: rgb(255, 0, 0); z-index: 500; pointer-events: auto; position: absolute; left: 0px; top: 0px; bottom: 0px; width: 89.0312px;\"></div></div>");
      const newProgressBar = element.querySelector(qs_newProgressBar);
      newProgressBar.addEventListener("click", trackMouseMovement)
    });
  }
}




//wait until user settings are obtained
chrome.storage.local.get(null, (settings) => {
  if(settings.convertShorts){
    // Redirect user to video form
    chrome.runtime.sendMessage({
      action: "convertVideo", 
      details: 
      reformatURL(document.URL)
    })
  }
  
})


addProgressBar()

function trackMouseMovement(event){
  event.stopPropagation();
  const newProgressBar = document.querySelector(qs_newProgressBar);
  // Calculate the mouse position relative to the progress bar
  const rect = newProgressBar.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const progressBarWidth = rect.width;
  
  // Calculate the percentage of the progress bar where the mouse is
  const percentage = (mouseX / progressBarWidth) * 100;
  
  // Output the percentage (for testing)
  const video = document.querySelector(qs_shortsVideoElement)


  console.log('Mouse percentage:', video.duration * (percentage / 100));

  video.currentTime = video.duration * (percentage / 100)
}


// Function to update the progress bar width based on the video position
function updateProgressBar(width) {
  const progressBarInner = document.querySelector(qs_progressBarRedPart);
  if (progressBarInner) {
    // Update the width of the progress bar
    progressBarInner.style.width = width;
    //console.log("setting width" + width)
  }
}

const updateInterval = 75; // Update every 500 milliseconds (adjust as needed)

setInterval(() => {
  const video = document.querySelector(qs_shortsVideoElement)
  if (video && (!isNaN(video.duration))){
    width = (video.currentTime / video.duration)*100 + "%";

    // Update the progress bar width based on the current video position
    updateProgressBar(width);
  }
}, updateInterval);


chrome.storage.local.get(null, (settings) => {
  const observer = new MutationObserver(function() {
    const YTprogressBar = document.querySelectorAll(qs_progressBar2)
    if (YTprogressBar) {
      // Remove the element from the DOM
      YTprogressBar.forEach(function(element){
        if(element.style.display !== "none"){
          element.style.display = "none"
        }
      });
    }

})
  observer.observe(document.body, { childList: true, subtree: true });
})

