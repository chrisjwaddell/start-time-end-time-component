// STET-app.js
let one = STET(".one .field-section", "one", "One", 1, {
	autofocus: true,
	STClickCallback: () => {
		onChangeST1()
	},
	ETClickCallback: () => {
		onChangeET1()
	},
})

let two = STET(".two .field-section", "two", "Two", 3, {
	durationOverXHrs: 2,
	startTimeXHrsBeforeNow: 12,
	STClickCallback: () => {
		onChangeST2()
	},
	ETClickCallback: () => {
		onChangeET2()
	},
})

function resultMessage(result) {
	if (result.stetFilledIn) {
		return result.durationText + "\n" + result.warnings
	} else {
		return result.warnings
	}
}

let elResults1 = document.querySelector(".results1")
let elAdd1 = document.querySelector(".add1")

function onResults1() {
	let result = one.getResults(false)
	let elP11 = document.querySelector(".results1btn p")
	let elP12 = document.querySelectorAll(".results1btn p")[1]

	clearFields1()
	if (!result) return

	if (result.stetFilledIn) {
		elP11.textContent = result.st + " - " + result.et
		elP12.textContent = result.durationText + ", " + result.warnings
	} else {
		alert(result.required)
	}
}

function onAdd1() {
	let result = one.getResults(true)
	let elP11 = document.querySelector(".add1btn p")
	let elP12 = document.querySelectorAll(".add1btn p")[1]

	clearFields1()
	if (!result) return

	if (result.stetFilledIn) {
		elP11.textContent = result.st + " - " + result.et
		elP12.textContent = result.durationText + ", " + result.warnings
	} else {
		alert(result.required)
	}
}

function clearFields1() {
	let elP11 = document.querySelector(".add1btn p")
	let elP12 = document.querySelectorAll(".add1btn p")[1]

	elP11.textContent = ""
	elP12.textContent = ""
}

function onChangeST1() {
	let result = one.getResults(false)
	let elP12 = document.querySelectorAll(".add1btn p")[1]
	clearFields1()
	elP12.textContent = resultMessage(result)
}

function onChangeET1() {
	let result = one.getResults(false)
	let elP12 = document.querySelectorAll(".add1btn p")[1]
	clearFields1()
	elP12.textContent = resultMessage(result)
}

let elResults2 = document.querySelector(".results2")
let elAdd2 = document.querySelector(".add2")

function onResults2() {
	let result = two.getResults(false)
	let elP21 = document.querySelector(".results2btn p")
	let elP22 = document.querySelectorAll(".results2btn p")[1]

	if (!result) return

	if (result.stetFilledIn) {
		elP21.textContent = result.st + " - " + result.et
		elP22.textContent = result.durationText + ", " + result.warnings
	} else {
		alert(result.required)
	}
}

function onAdd2() {
	let result = two.getResults(true)
	let elP21 = document.querySelector(".add2btn p")
	let elP22 = document.querySelectorAll(".add2btn p")[1]

	elP21.textContent = ""
	elP22.textContent = ""

	if (!result) return

	if (result.stetFilledIn) {
		elP21.textContent = result.st + " - " + result.et
		elP22.textContent = result.durationText + ", " + result.warnings
	} else {
		alert(result.required)
	}
}

function clearFields2() {
	let elP21 = document.querySelector(".add2btn p")
	let elP22 = document.querySelectorAll(".add2btn p")[1]

	elP21.textContent = ""
	elP22.textContent = ""
}

function onChangeST2() {
	let result = two.getResults(false)
	let elP22 = document.querySelectorAll(".add2btn p")[1]
	clearFields2()
	elP22.textContent = resultMessage(result)
}

function onChangeET2() {
	let result = two.getResults(false)
	let elP22 = document.querySelectorAll(".add2btn p")[1]
	clearFields2()
	elP22.textContent = resultMessage(result)
}

document.addEventListener("DOMContentLoaded", (e) => {
	elResults1.addEventListener("click", onResults1)
	elResults2.addEventListener("click", onResults2)
	elAdd1.addEventListener("click", onAdd1)
	elAdd2.addEventListener("click", onAdd2)
})
