let writingArea = document.getElementById('poem-form');

// following the example from https://github.com/typography-interaction-2526/forms-params-storage

let retrievePoems = () => {
	let poems = []

	// using Object.keys() here instead of cycling through localStorage with a simple for loop (just thought this was a better way of doing it): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	Object.keys(localStorage).forEach((key) => {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push
		poems.push({
			id: key,
			text: localStorage.getItem(key)
		})
	})

	console.log(poems)
}

let writePoem = () => {
	let poemText = document.getElementById('poem-text').value

	let poemTitle = document.getElementById('poem-title').value

	// https://developer.mozilla.orgq/en-US/docs/Web/API/Window/localStorage
	localStorage.setItem(poemTitle, poemText)
}

writingArea.addEventListener('submit', (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	event.preventDefault()
	
	writePoem()
})

retrievePoems()