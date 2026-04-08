let writingArea = document.getElementById('poem-form');

// following the example from https://github.com/typography-interaction-2526/forms-params-storage

let retrievePoems = () => {
	// making an array with objects in it from localStorage
	let poems = []

	// using Object.keys() here instead of cycling through localStorage with a simple for loop (just thought this was a better way of doing it): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	Object.keys(localStorage).forEach((key) => {
		// pushing object to array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
		poems.push({
			title: key,
			text: localStorage.getItem(key)
		})
	})
	// checking
	console.log(poems)
	// returning it so we can use it in displayPoems
	return poems
}

let displayPoems = () => {
	// running retrievePoems here so we have the retrieved poems from localStorage
	poems = retrievePoems()
	// checking
	console.log(poems)
	// the sort doesnt seem to actually sort it (?)
	poems.sort()
	console.log(poems)
	// creating an element for each poem
	poems.forEach((poem) => {
		let poemElement = document.createElement('section')
		poemElement.innerHTML = `<h2>${poem.title}</h2><p>${poem.text}</p>`
		document.body.appendChild(poemElement)
	})
}

let writePoem = () => {
	let poemID = localStorage.length + 1

	let poemTitle = document.getElementById('poem-title').value
	let poemText = document.getElementById('poem-text').value

	let poemInfo = {
		title: poemTitle,
		text: poemText
	}

	// https://developer.mozilla.orgq/en-US/docs/Web/API/Window/localStorage
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
	// just inserting the poemInfo object into localStorage returns [object Object] so I have to stringify it and parse it when I retrieve it
	localStorage.setItem(poemID, JSON.stringify(poemInfo))
}

writingArea.addEventListener('submit', (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	// I actually want it to refresh the page
	// event.preventDefault()
	
	// writing poem to localStorage on button submission
	writePoem()
})

// adding another function using this api i found to retrieve a random poem (might use this for something later): https://github.com/thundercomb/poetrydb/blob/master/README.md
// fetch is asynchronous so i have to use async/await here to prevent an error: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
let getRandomPoem = async () => {
	// using fetch method here with async/await: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	let response = await fetch('https://poetrydb.org/random')
	let randomPoem = await response.json()
	// checking
	console.log(randomPoem)
	// passing the poem to displayRandomPoem function
	return randomPoem
}

// function to display random poem on the page (will use this for something later)
let displayRandomPoem = async () => {
	// using await here so there's no error again when running getRandomPoem and passsing poem
	let randomPoem = await getRandomPoem()
	let selectedRandomPoem = randomPoem[0]
	// checking the json object
	console.log(selectedRandomPoem)
	// creating element
	let randomPoemElement = document.createElement('section')
	randomPoemElement.innerHTML = `<h2>${selectedRandomPoem.title}</h2><p>${selectedRandomPoem.lines}</p>`
	document.body.appendChild(randomPoemElement)
}

// display poems once the page loads
displayPoems()
displayRandomPoem()