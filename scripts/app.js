function onPageLoad() {

    refreshST(STULQueryString)
}


const elTimeItems = document.querySelector(".time-items")

document.addEventListener("DOMContentLoaded", onPageLoad)


let elAdd = document.querySelector(".add")
elAdd.addEventListener("click", onAdd)


function onAdd() {
    console.log("onAdd")

    let st = selectedST()
    let et = selectedET()

    let elP
    if ((st !== "") && (et !== "")) {
        elP = document.createElement("p")
        elP.textContent = st + " - " + et

        elTimeItems.appendChild(elP)
    } else {
        alert("You must choose both Start time and End time")
    }

    //reset()
    // let dtET = new Date()

    setLastET(dateFormat(et))
    listUnselect(elSTUL, SC)
    chooseTime(et, STULQueryString)
    refreshETTime(et)

    timebar(et, "0")
}
