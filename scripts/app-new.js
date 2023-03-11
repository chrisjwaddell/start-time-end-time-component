const elTimeItems = document.querySelector(".time-items")


let elAdd = document.querySelector(".add")
elAdd.addEventListener("click", onAdd)


function onAdd() {
    console.log("onAdd")

    const elStet = document.querySelectorAll(".stet")
    let arrStet = Array.from(elStet)

    console.log(stetDOM(arrStet[0]))

    let {
        id,
        day,
        st,
        et,
        stUL,
        etUL
    } = stetDOM(arrStet[0])


    console.log(stetDOM(arrStet[0]))

    debugger

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

    setLastETStored(dateFormat(day, et, settingsSTET.hr24))
    listUnselect(stUL, SC)
    chooseTime(et, stUL)
    refreshETTime(id, day, etUL, st)

    timebar(stUL.childNodes[0], et, "0")
}
