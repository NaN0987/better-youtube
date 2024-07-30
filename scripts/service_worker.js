//default settings
const defaultSettings = {
  skipAds: true,
  filterSearch: true,
  filterHomePage: true,
  showDislikes: true,
  convertShorts: true,
  agressiveAdBlocking: false
}

//Convert the current short to video format
function convertVideo(string){
  
  // Divide url up by slashes
  string = string.split("/")

  // Extract the video ID from the URL
  let videoId = string.pop();

  // Remove "shorts"
  string.pop()

  // Construct the new URL string with the "watch?v=" format
  let newUrl = string.join("") + "/watch?v=" + videoId;

  console.log(newUrl); 

  chrome.tabs.update({url: newUrl});
}

// Function for setting default options when new options are added
async function setDefaultSettings(){
  //await chrome.storage.local.clear()
  const settings = await chrome.storage.local.get(null)
  console.log(settings)
  //every key in defaultSettings that doesn't exist in settings is added to settings
  for(const key in defaultSettings){
    if(!settings.hasOwnProperty(key)){
      chrome.storage.local.set({ [key]: defaultSettings[key] })
    }
  }
}

//Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    //run code on first install
    setDefaultSettings()
  }
  else if(details.reason == "update"){
    //run code on update
    setDefaultSettings()
  }
})

//Sleeping function for testing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

//Listener for recieving messages
chrome.runtime.onMessage.addListener(function(message){
  console.log("message recieved!")
  
  //"message.action" contains what the service worker should do
  switch(message.action){
    case "convertVideo":
      convertVideo(message.details)
      break

    default:
      console.warn("Unknown message: ", message.action)
      break
  }

})
