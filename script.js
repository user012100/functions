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

let displayPoems = (poems) => {
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
	let poemText = document.getElementById('poem-text').value

	let poemTitle = document.getElementById('poem-title').value

	// https://developer.mozilla.orgq/en-US/docs/Web/API/Window/localStorage
	localStorage.setItem(poemTitle, poemText)
}

writingArea.addEventListener('submit', (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	// I actually want it to refresh the page
	// event.preventDefault()
	
	// writing poem to localStorage on button submission
	writePoem()
})

// display poems once the page loads
displayPoems()