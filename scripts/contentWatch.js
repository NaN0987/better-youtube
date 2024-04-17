console.log("youtube extension: watch")



//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier
const qs_progressBar = "#movie_player > div.ytp-chrome-bottom > div.ytp-progress-bar-container > div.ytp-progress-bar > div.ytp-scrubber-container > div"
const qs_videoPlayer = "#movie_player > div.html5-video-container > video"
const qs_skipAdButton = "button.ytp-ad-skip-button-modern"
const qs_adSelction = "#rendering-content > ytd-promoted-sparkles-web-renderer"
const qs_adSelctionBanner = "#companion > top-banner-image-text-icon-buttoned-layout-view-model"
const qs_youtubeShorts = "#contents > ytd-reel-shelf-renderer"
const qs_dislikeButton = "#top-level-buttons-computed > segmented-like-dislike-button-view-model > yt-smartimation > div > div > dislike-button-view-model > toggle-button-view-model > button-view-model > button"
// Regular expression to match the video ID
const regex = /[?&]v=([^&]+)/;


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

//deletes an array of elements in the page, mostly ads
function deleteElements(adSelection){
  if (adSelection) {
    // Remove the element from the DOM
    adSelection.forEach(function(element){
      if(element.style.display !== "none"){
        element.style.display = "none"
        console.log("hide" + element)
      }
    });
  }
}

function getDislikes(dislikeCounter){
  // Execute the regular expression on the URL
  const match = document.URL.match(regex);

  // Extract the video ID from the matched result
  const videoID = match && match[1];

  if (videoID !== currentDislike.videoID) {

    currentDislike.videoID = videoID
    const apiUrl = 'https://returnyoutubedislikeapi.com/votes?videoId=' + videoID;

    // Make a GET request using the Fetch API
    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json()
      })
      .then(userData => {
        // Process the retrieved user data
        console.log('Dislikes:', userData.dislikes);
        currentDislike.dislikeCount = userData.dislikes
        dislikeCounter.textContent = userData.dislikes
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  else {
    dislikeCounter.textContent = currentDislike.dislikeCount
  }
  
}

let currentDislike = {
  videoID: "2FJxjVedpq0&t=7s",
  dislikeCount: 0
}

//wait until user settings are obtained
chrome.storage.local.get(null, (settings) => {
  // Check every time something changes in the body
  const observer = new MutationObserver(function() {

    const dislikeButtonDocument = document.querySelector(qs_dislikeButton);

    //checking if the dislike button exists but it does not have its counter
    if (dislikeButtonDocument && (!dislikeButtonDocument.querySelector("div.yt-spec-button-shape-next__button-text-content"))) {
      dislikeButtonDocument.style.setProperty("width", "80px");
      dislikeButtonDocument.style.setProperty("gap", "3px");
      dislikeButtonDocument.style.setProperty("overflow", "initial")

      // Create a new div element
      const dislikeCounter = document.createElement('div');

      // Add the class to the div element
      dislikeCounter.className = 'yt-spec-button-shape-next__button-text-content';

      // Add counter container
      dislikeButtonDocument.appendChild(dislikeCounter);
    }

    if(dislikeButtonDocument?.querySelector("div.yt-spec-button-shape-next__button-text-content")){
      getDislikes(dislikeButtonDocument.querySelector("div.yt-spec-button-shape-next__button-text-content"))
    }
    
    //console.log("mutation detected")
    const adSelctionDocument = document.querySelectorAll(qs_adSelction);
    const adSelctionBannerDocument = document.querySelectorAll(qs_adSelctionBanner);
    const youtubeShortsDocument = document.querySelectorAll(qs_youtubeShorts);

    deleteElements(adSelctionDocument)
    deleteElements(adSelctionBannerDocument)
    deleteElements(youtubeShortsDocument)
    
    if(settings.skipAds){
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
    }
      
  })
  
  observer.observe(document.body, { childList: true, subtree: true });
})
