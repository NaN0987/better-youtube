console.log("youtube extension: search")

//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier

const blacklistArray = ["People also watched", "For you", "Channels new to you", "Previously watched", "Popular today", "From related searches"]


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
  for (let i = 0; i < parentNumber; i++){
    element = element.parentElement
  }
  return element
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

function deleteElement(adSelection){
  if (adSelection) {
    // Remove the element from the DOM
      if(adSelection.style.display !== "none"){
        adSelection.style.display = "none"
        console.log("hide" + adSelection)
      }
  }
}


//wait until user settings are obtained
chrome.storage.local.get(null, (settings) => {
  const observerTest = new MutationObserver(function() {
    if (reformatURL(document.URL).endsWith(".youtube.com/results") && (settings.filterSearch)){
      //console.log("Mutation detected")
  
      // Select the element
      const elementToDelete = document.querySelectorAll("#title");
      const adToDelete = document.querySelectorAll("#fulfilled-layout > ytd-in-feed-ad-layout-renderer")
  
      deleteElements(adToDelete)
  
      elementToDelete.forEach(function(element){
        if(blacklistArray.includes(element.textContent)){
          deleteElement(getParent(5, element))
        }
      })
      
    }
  })
  observerTest.observe(document.body, { childList: true, subtree: true });
})
