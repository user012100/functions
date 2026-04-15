let writingArea = document.getElementById('poem-form')
let poemText = document.getElementById('poem-text')
let submitButton = document.getElementById('submit')

// from stackoverflow (option 2): https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
// using scrollHeight in event listener to get the height of the text content and setting it as the height of the textarea
poemText.addEventListener('input', () => {
	poemText.style.height = 'auto'
	poemText.style.height = poemText.scrollHeight

	// checking if the textarea has any text to change color of button
	if (poemText.value !== '') {
		submitButton.classList.add('allow')
	} else {
		submitButton.classList.remove('allow')
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

let displayPoems = () => {
	// clearing poems so we dont have to refresh the page
	let poemSections = document.querySelectorAll('.poem')

	poemSections.forEach(section => {
		section.remove()
	})

	// clearing input fields 
	// document.getElementById('poem-title').value = ''
    document.getElementById('poem-text').value = ''

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
		deleteButton.textContent = 'Delete'
		deleteButton.addEventListener('click', (event) => {
			localStorage.removeItem(poem.id)
			// 'refresh' the poems displayed
			displayPoems()
		})

		poemElement.appendChild(deleteButton)

		// adding print button
		let printButton = document.createElement('button')
		printButton.textContent = 'Print'
		printButton.addEventListener('click', (event) => {
			window.print()
		})

		poemElement.appendChild(printButton)

		// share button w/ web share api
		let shareButton = document.createElement('button')
		shareButton.textContent = 'Share'

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
	let poemID = localStorage.length + 1

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
		return
	} else {
		submitButton.classList.remove('allow')
	}
	
	// writing poem to localStorage on button submission
	writePoem()
	displayPoems()
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
// displayRandomPoem()