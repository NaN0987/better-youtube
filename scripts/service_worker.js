
//default settings
const defaultSettings = {
  setting1: "foo",
  setting2: "bar"
}

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

chrome.runtime.onMessage.addListener(function(message){
  console.log("message recieved!")
  
})
