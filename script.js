let writingArea = document.getElementById('poem-form')
let poemText = document.getElementById('poem-text')
let submitButton = document.getElementById('submit')
let h2 = document.querySelector('h2')

// from stackoverflow (option 2): https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
// using scrollHeight in event listener to get the height of the text content and setting it as the height of the textarea
poemText.addEventListener('input', () => {
	poemText.style.height = '2rem'
	poemText.style.height = poemText.scrollHeight

	let randomPoem = document.querySelector('.random-poem')
	// checking if the textarea has any text to change color of button
	if (poemText.value !== '') {
		submitButton.classList.add('allow')

		// instead of just adding display none i want to fade them
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event 
		h2.style.opacity = '0'
		h2.addEventListener('transitionend', () => {
			if (h2.style.opacity === '0') {
				h2.classList.add('hidden')
			}
			// adding once: true to make event liostener run once: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#once
		}, { once: true })

		// same thing for fading out random poem
		randomPoem.style.opacity = '0'
		randomPoem.addEventListener('transitionend', () => {
			if (randomPoem.style.opacity === '0') {
				randomPoem.classList.add('hidden')
			}
		}, { once: true })

	} else {
		submitButton.classList.remove('allow')

		// fade in h2
		h2.style.display = ''
		requestAnimationFrame(() => { 
			h2.style.opacity = '1' 
		})

		// fade in random poem
		if (localStorage.length === 0) {
			randomPoem.classList.remove('hidden')
			requestAnimationFrame(() => { 
				randomPoem.style.opacity = '1' 
			})
		}
	}
})

// following the example from https://github.com/typography-interaction-2526/forms-params-storage

let retrievePoems = () => {
	// making an array with objects in it from localStorage
	let poems = []

	// using Object.keys() here instead of cycling through localStorage with a simple for loop (just thought this was a better way of doing it): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
	Object.keys(localStorage).forEach((key) => {
		// pushing object to array: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push

		// parsing through localStorage object
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse 
		let poemInfo = JSON.parse(localStorage.getItem(key))

		poems.push({
			id: key,
			// removing titles for now
			// title: poemInfo.title,
			text: poemInfo.text
		})
	})

	// checking
	console.log(poems)
	// returning it so we can use it in displayPoems
	return poems
}

// adding clear input parameter to clear textarea only when submitting
let displayPoems = (clearInput = false) => {
	// clearing poems so we dont have to refresh the page
	let poemSections = document.querySelectorAll('.poem')

	poemSections.forEach(section => {
		section.remove()
	})

	// only clear the textarea when a new poem was just submitted
	if (clearInput) {
		document.getElementById('poem-text').value = ''
		document.getElementById('poem-text').style.height = '2rem'
	}

	// running retrievePoems here so we have the new retrieved poems from localStorage
	poems = retrievePoems()
	// checking
	// console.log(poems)
	// sorting poems by id in descending order so the most recent poem is at the top
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	poems.sort((a, b) => b.id - a.id)
	
	// creating an element for each poem
	poems.forEach((poem) => {
		let poemElement = document.createElement('section')
		poemElement.classList.add('poem')
		// console.log(poem.text)
		// making a loop to parse thru each line to display on a new line
		let lines = poem.text

		lines.forEach((line, id) => {
			let lineElement = document.createElement('input')
			lineElement.value = line

			// event listener when the user clicks out of the input (after editing)
			// https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event
			lineElement.addEventListener('blur', (event) => {
				lines[id] = lineElement.value
				// writing the updated poem back to localStorage
				localStorage.setItem(poem.id, JSON.stringify({
					id: poem.id,
					// title: poem.title,
					text: lines
				}))
			})
			// adding lines to poem element
			poemElement.appendChild(lineElement)
		})

		// adding delete button
		let deleteButton = document.createElement('button')
		deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>'
		deleteButton.addEventListener('click', (event) => {
			localStorage.removeItem(poem.id)
			// 'refresh' the poems displayed
			displayPoems()
		})

		poemElement.appendChild(deleteButton)

		// adding print button
		// let printButton = document.createElement('button')
		// printButton.textContent = '\u{1F5A8}'
		// printButton.addEventListener('click', (event) => {
		// 	window.print()
		// })

		// poemElement.appendChild(printButton)

		// share button w/ web share api
		let shareButton = document.createElement('button')
		shareButton.textContent = '\u{1F517}'

		// this function needs to be asyncronous to work like in my last project
		let sharing = false

		poemElement.appendChild(shareButton)

		// using example from my last project:
		shareButton.addEventListener('click', async (event) => {
			if (navigator.share) {
				if (sharing) return
				sharing = true
				try {
					await navigator.share({
						// title: poem.title,
						text: poem.text
					})
				} finally {
					sharing = false
				}
			}
		})

		document.body.appendChild(poemElement)
	})
}

let writePoem = () => {
	// using numerical ids for poem key in localStorage
	// let poemID = localStorage.length + 1
	// using a timestamp-based key instead so new poems never reuse the same localStorage key
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now
	// console.log(Date.now())
	let poemID = Date.now()

	// let poemTitle = document.getElementById('poem-title').value
	let poemText = document.getElementById('poem-text').value
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
	// using the split function to split by line breaks (similar to how poems are stored in the random poem api i used)
	let poemLines = []
	poemLines = poemText.split('\n')

	let poemInfo = {
		// title: poemTitle,
		text: poemLines
	}

	// https://developer.mozilla.orgq/en-US/docs/Web/API/Window/localStorage
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
	// just inserting the poemInfo object into localStorage returns [object Object] so I have to stringify it and parse it when I retrieve it
	localStorage.setItem(poemID, JSON.stringify(poemInfo))
}

writingArea.addEventListener('submit', (event) => {
	// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
	event.preventDefault()

	// checking for value in textarea before writing
	if (poemText.value == '') {
		// console.log('no text entered')
		poemText.focus()
		return
	} else {
		submitButton.classList.remove('allow')
	}
	
	// writing poem to localStorage on button submission
	writePoem()
	// changing clearInput to true so the textarea only clears when a new poem is submitted
	displayPoems(true)
})

// adding another function using this api i found to retrieve a random poem (might use this for something later): https://github.com/thundercomb/poetrydb/blob/master/README.md
// fetch is asynchronous so i have to use async/await here to prevent an error: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
let getRandomPoems = async () => {
	// fetching 10 random poems at once instead of just 1
	let response = await fetch('https://poetrydb.org/random/10')
	let poems = await response.json()
	console.log(poems)
	return poems
}

// function to display random poem (now displaying 10 poems) on the page (will use this for something later)
let displayRandomPoem = async () => {
	let poems = await getRandomPoems()
	let currentIndex = 0

	// creating element
	let randomPoemElement = document.createElement('section')
	randomPoemElement.classList.add('random-poem')

	// helper to fill the element with a poem's lines
	let showPoem = (poem) => {
		randomPoemElement.innerHTML = ''
		poem.lines.forEach((line) => {
			let lineElement = document.createElement('p')
			lineElement.textContent = line
			randomPoemElement.appendChild(lineElement)
		})
	}

	// show the first poem
	showPoem(poems[currentIndex])
	document.body.appendChild(randomPoemElement)

	// adding and remove hidden class if we have poems in localStorage
	// updated to fade as well
	if (localStorage.length == 0) {
		randomPoemElement.style.opacity = '0'
		randomPoemElement.classList.remove('hidden')
		requestAnimationFrame(() => { 
			randomPoemElement.style.opacity = '1' 
		})
	} else {
		randomPoemElement.classList.add('hidden')
	}

	// rotate to next poem every 7 seconds
	setInterval(() => {
		// fade out
		randomPoemElement.style.opacity = '0'
		randomPoemElement.addEventListener('transitionend', () => {
			// move to next poem
			currentIndex = (currentIndex + 1) % poems.length
			showPoem(poems[currentIndex])
			// fade in
			requestAnimationFrame(() => { 
				randomPoemElement.style.opacity = '1' 
			})
		}, { once: true })
	}, 5000)
}

// display poems once the page loads
displayPoems()
displayRandomPoem()