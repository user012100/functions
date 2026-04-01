let writingArea = document.getElementById('poem-form');

// following the example from https://github.com/typography-interaction-2526/forms-params-storage

let storePoems = () => {
	// https://developer.mozilla.org/en-US/docs/Web/API/FormData
	let savePoem = new FormData(writingArea)

	savePoem.forEach((value, key) => {
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
		localStorage.setItem(key, value)
	})
}

let writePoem = () => {
	let poemText = document.getElementById('poem-text').value

	let poemID = localStorage.length + 1

	localStorage.setItem(poemID, poemText)
}

writingArea.addEventListener('submit', (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	event.preventDefault()

	writePoem()
})