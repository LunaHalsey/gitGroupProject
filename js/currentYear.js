// script for updating the copyright year
document.getElementById('copyright').appendChild(document.createTextNode(new Date().getFullYear()));

/* Expanded code with comments *
// Get the element with the id 'copyright'
var copyrightElement = document.getElementById('copyright');

// Create a text node with the current year
var currentYearTextNode = document.createTextNode(new Date().getFullYear());

// Append the text node to the 'copyright' element
copyrightElement.appendChild(currentYearTextNode);
*/