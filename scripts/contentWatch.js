console.log("youtube extension: watch")

//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier
const qs_progressBar = "#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-scrubber-container > div"
const qs_videoPlayer = "#movie_player > div.html5-video-container > video"
const qs_skipAdButton = "span.ytp-ad-skip-button-container"

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

//wait until user settings are obtained
chrome.storage.local.get(null, (settings) => {
  // Check every time something changes in the body
  const observer = new MutationObserver(function() {
    //console.log("mutation detected")

    // Try to select the progress bar
    const progressBar = document.querySelector(qs_progressBar);
  
    if(progressBar){

      const progressBarStyle = window.getComputedStyle(progressBar)

      // If the progress bar is yellow (ad)
      if(progressBarStyle.backgroundColor === "rgb(255, 204, 0)"){

        // Get the video
        const video = document.querySelector(qs_videoPlayer)

        // End the ad
        if((video.duration !== video.currentTime) && (!isNaN(video.duration))){
          video.currentTime = video.duration
          console.log("ad skipped")
        }

        // Automatically click skip button
        const skipButton = document.querySelector(qs_skipAdButton)
        skipButton?.click()
      
      }

    }
      
  })
  
  observer.observe(document.body, { childList: true, subtree: true });
})
