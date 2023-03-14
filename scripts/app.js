const StetSettings = [{
        stetId: "task1",
        durationOverXHrs: 10,
        startTimeXHrsBeforeNow: 10,
        saveLastETInLocalStorage: true,
        hr24: false
    },

    {
        stetId: "task2",
        durationOverXHrs: 10,
        startTimeXHrsBeforeNow: 10,
        saveLastETInLocalStorage: true,
        hr24: true
    }

]


const elTimeItems1 = document.querySelector(".time-items1")

let elAdd1 = document.querySelector(".add1")

let elTest1P = document.querySelector(".test1 p")


function onAdd1() {
    let result = stetResult("task1", true)
    console.log(result)

    if (!result) return

    let elP
    if (result.stetFilledIn) {
        elP = document.createElement("p")
        elP.textContent = result.st + " - " + result.et

        elTimeItems1.appendChild(elP)
        elTest1P.textContent = ""
    } else {
        alert(result.required)
    }
}


function resultMessage(result) {
    if (result.stetFilledIn) {
        return result.durationText + '\n' + result.warnings
    } else {
        return result.warnings
    }
}


function onClickST1() {
    let result = stetResult("task1", false)
    elTest1P.textContent = resultMessage(result)
}

function onClickET1() {
    let result = stetResult("task1", false)
    elTest1P.textContent = resultMessage(result)
}


const elTimeItems2 = document.querySelector(".time-items2")

let elAdd2 = document.querySelector(".add2")

let elTest2P = document.querySelector(".test2 p")


function onAdd2() {
    let result = stetResult("task2", true)

    if (!result) return

    console.log(result)

    let elP
    if (result.stetFilledIn) {
        elP = document.createElement("p")
        elP.textContent = result.st + " - " + result.et

        elTimeItems2.appendChild(elP)
        elTest2P.textContent = ""
    } else {
        alert(result.required)
    }

}


function onClickST2() {
    let result = stetResult("task2", false)
    console.log(result)
    elTest2P.textContent = resultMessage(result)
}

function onClickET2() {
    let result = stetResult("task2", false)
    console.log(result)
    elTest2P.textContent = resultMessage(result)
}


document.addEventListener("DOMContentLoaded", (e) => {
    elAdd1.addEventListener("click", onAdd1)
    elAdd2.addEventListener("click", onAdd2)

    document.querySelectorAll(".stet")[0].querySelector(".start ul").addEventListener("click", onClickST1)
    document.querySelectorAll(".stet")[0].querySelector(".end ul").addEventListener("click", onClickET1)

    document.querySelectorAll(".stet")[1].querySelector(".start ul").addEventListener("click", onClickST2)
    document.querySelectorAll(".stet")[1].querySelector(".end ul").addEventListener("click", onClickET2)
})
