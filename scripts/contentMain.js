console.log("youtube extension is running")

//querySelector constants
//if the website changes and we have to chanage the queryselectors, these constants should make that easier

qs_QueryExample = "html"



const observer = new MutationObserver(function() {
  console.log("hello")
  //advertisement?.remove()
    // Select the element
    
    const elementToDelete = document.querySelectorAll('#rendering-content');


    // Check if the element exists
    if (elementToDelete) {
        // Remove the element from the DOM
        elementToDelete.forEach(function(element){
          element.style.display = "none"
          element.parentElement.parentElement.parentElement.parentElement.parentElement.style.display = "none"
         // element.hide()
          console.log(element)
        });
        

        }
    else{
      console.log("ELEMENT DOES NOT EXIST")
    }
    
})
observer.observe(document.body, { childList: true, subtree: true });


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
