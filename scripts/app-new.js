const StetSettings = [{
    stetId: "times",
    durationOverXHrs: 10,
    startTimeXHrsBeforeNow: 20,
    saveLastETInLocalStorage: true,
    hr24: false
}]


const elTimeItems = document.querySelector(".time-items")


let elAdd = document.querySelector(".add")
elAdd.addEventListener("click", onAdd)


function onAdd() {

    const timesSettings = {
        durationOverXHrs: 10,
        startTimeXHrsBeforeNow: 20,
        hr24: false
    }

    let result = stetResult("times", true)
    console.log(result)



    let elP
    if (result.stetFilledIn) {
        elP = document.createElement("p")
        elP.textContent = result.st + " - " + result.et

        elTimeItems.appendChild(elP)
    } else {
        alert(result.required)
    }



    // listUnselect(stUL, SC)
    // refreshETTime(id, day, etUL, st)
    // chooseTime(et, stUL)

    // timebar(stUL.childNodes[0], et, "0")
}
