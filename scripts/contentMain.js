console.log("youtube extension: main")

//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier
const qs_ads = "#content > ytd-ad-slot-renderer"
const qs_bannerAds = '#rendering-content.style-scope.ytd-page-top-ad-layout-renderer';
const qs_videoTitle = "#video-title"
const qs_shortsRow = "#content > ytd-rich-shelf-renderer"
const qs_videoGrid = "#primary > ytd-rich-grid-renderer"

const maxTitleLength = 50;

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

//get parent element automatically
function getParent(parentNumber, element){
  for (let i = 0; i <= parentNumber; i++){
    element = element.parentElement
  }
  return element
}

//wait until user settings are obtained
chrome.storage.local.get(null, (settings) => {
  const observer = new MutationObserver(function() {
    if ((reformatURL(document.URL) === "https://www.youtube.com/") && (settings.filterHomePage)){
   
      // Select the element
      const elementToDelete = document.querySelectorAll(qs_ads);
      const elementToDelete2 = document.querySelectorAll(qs_shortsRow);
      const elementToDelete3 = document.querySelectorAll(qs_bannerAds);
      const elementToChange = document.querySelectorAll(qs_videoGrid)
      const elementToChange2 = document.querySelectorAll(qs_videoTitle)

      const root = document.documentElement;

  
      // Check if the element exists
      if (elementToChange) {
        //change row
        elementToChange.forEach(function(row){
          row.style.setProperty("--ytd-rich-grid-posts-per-row", "3");
          row.style.setProperty("--ytd-rich-grid-items-per-row", "3");
          row.style.setProperty("--ytd-rich-grid-slim-items-per-row", "0");
          row.style.setProperty("--ytd-rich-grid-game-cards-per-row", "0");
          root.style.setProperty('--ytd-rich-grid-item-margin', '10px');

        });
      }
      //Removes any characters that go over the maxTitleLength index in a title string
      //This makes it so videos will stay at a consistent size
    //   if (elementToChange2) {
    //     elementToChange2.forEach(function(element){
    //       if (element.textContent.length > maxTitleLength){
    //         element.textContent = element.textContent.substring(0, maxTitleLength) + "...";
    //       }
    //     });
    // }

      if (elementToDelete3) {
        // Remove the element from the DOM
        elementToDelete3.forEach(function(element){
          if(element.style.display !== "none"){
            element.style.display = "none"
            console.log(element)
          }
        });
      }

      if (elementToDelete2) {
        // Remove the element from the DOM
        elementToDelete2.forEach(function(element){
          if(element.style.display !== "none"){
            element.style.display = "none"
            console.log(element)
          }
        });
      }
  
      if (elementToDelete) {
        // Remove the element from the DOM
        elementToDelete.forEach(function(element){
          if(getParent(4, element).style.display !== "none"){
            getParent(4, element).style.display = "none"
          }
        });
      }
      else{
        console.log("ELEMENT DOES NOT EXIST")
      }
    }
  })
  observer.observe(document.body, { childList: true, subtree: true });
})
