console.log("youtube extension shorts is running")

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

  if(settings.convertShorts){
    // Redirect user to video form
    chrome.runtime.sendMessage({
      action: "convertVideo", 
      details: 
      reformatURL(document.URL)
    })
  }
  
})
