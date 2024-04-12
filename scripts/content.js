console.log("youtube extension is running")

//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier

qs_QueryExample = "html"

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

})
