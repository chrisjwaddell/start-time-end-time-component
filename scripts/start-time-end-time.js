// ST ul querystring must be put in here
const STULQueryString = ".start ul"
const ETULQueryString = ".end ul"

// start-time-end-time settingsSTET
const settingsSTET = {
    // if 0, don't warn, if 12, it warns if duration over 12 hours
    durationOverXHrs: 10,
    // This helps when chosing a time today rather than yesterday
    // if 0, warning is off
    startTimeXHrsBeforeNow: 20,
    defaultST: "07:00 AM",
    defaultHrsBeforeToChooseST: 3,
    // end time can't show times after now
    excludeAfterNowET: true,
    nightIsDark: true,
    hr24: false
}


// selected class (SC) name for items selected in ul list
const SC = "selected"


// This should be the same as .times { width: 325 px;
// minus 5px margin left and right for start and end so ((2*5px) * 2)
const COMPONENT_WIDTH = 325 - ((2 * 5) * 2)
// This must be the same width as in CSS
// .day__timebar.marker { width.....
const MARKER_WIDTH = 72
//Black marker width, it should be the same as in CSS
// .day__timebar - start, .day__timebar-end { width.....
const STARTEND_MARKER_WIDTH = 4


let lastET
let dayChosen = new Date()
let currentDate = new Date()


let elDD = document.querySelector(".day h3")

let elSTUL = document.querySelector(STULQueryString)
let elETUL = document.querySelector(ETULQueryString)


const findIndexSelectedST = () => listFindSelected(elSTUL, SC)
const findIndexSelectedET = () => listFindSelected(elETUL, SC)

const selectedST = () => (findIndexSelectedST() !== -1) ? elSTUL.childNodes[findIndexSelectedST()].textContent : ""
const selectedET = () => (findIndexSelectedET() !== -1) ? elETUL.childNodes[findIndexSelectedET()].textContent : ""


function getLastETStored() {
    if (!lastET) {
        if (localStorage.getItem("lastET")) {
            if (Number(localStorage.getItem("lastET")) === "NaN") {
                setLastETStored(new Date().valueOf())
            } else {
                lastET = Number(localStorage.getItem("lastET"))
            }
        } else {
            setLastETStored(new Date().valueOf())
        }
    }
}


// takes a number
function setLastETStored(lastet) {
    lastET = lastet
    localStorage.setItem("lastET", String(lastet))
}


// Populate list based on start time (st) and end time (et)
function timesPopulate(st, et, ulQueryString, zeroTozero) {
    let elUL = document.querySelector(ulQueryString)

    let result = []

    let sth = Number(st.slice(0, 2))
    let stm = String(st.slice(3, 5))
    let stampm = st.slice(6, 8)

    let eth = Number(et.slice(0, 2))
    let etm = String(et.slice(3, 5))
    let etampm = et.slice(6, 8)

    let st24h;
    (stampm.toUpperCase() === "PM" && sth !== 12) ? st24h = sth + 12: st24h = sth

    let et24h;
    (etampm.toUpperCase() === "PM" && eth !== 12) ? et24h = eth + 12: et24h = eth

    if ((etampm.toUpperCase() === "PM") && (eth !== 12)) {
        et24h = eth + 12
    } else {
        if ((eth === 0) && (zeroTozero)) {
            et24h = 24
        } else {
            et24h = eth
        }

    }

    let mins = ["00", "15", "30", "45"]

    stmIndex = mins.findIndex(cv => cv === String(stm))
    etmIndex = mins.findIndex(cv => cv === String(etm))

    for (let hIndex = st24h; hIndex < et24h + 1; hIndex++) {
        if (st24h === et24h) {
            arrMins = mins.slice(stmIndex, etmIndex + 1)
        } else {
            if (hIndex === st24h) {
                if (stmIndex < 4 && stmIndex !== -1) {
                    arrMins = mins.slice(stmIndex, 4)
                } else {
                    arrMins = mins
                }
            } else if (hIndex === et24h) {
                if (etmIndex < 4 && etmIndex !== -1) {
                    arrMins = mins.slice(0, etmIndex + 1)
                } else {
                    arrMins = mins
                }
            } else {
                arrMins = mins
            }
        }


        arrMins.forEach(min => {
            let elLI = document.createElement("li")

            if (settingsSTET.hr24) {
                // 24 hour time
                elLI.textContent = ((hIndex < 10) ? "0" + hIndex : hIndex) + ":" + min
            } else {

                // 5 different cases here
                if (hIndex < 10) {
                    elLI.textContent = `0${hIndex}:${min} AM`
                    elLI.dataset.ampm = "AM"
                } else {
                    if (hIndex < 12) {
                        elLI.textContent = `${hIndex}:${min} AM`
                        elLI.dataset.ampm = "AM"
                    } else {
                        if (hIndex === 12) {
                            elLI.textContent = `${hIndex}:${min} PM`
                        } else if (hIndex < 22) {
                            elLI.textContent = `0${hIndex-12}:${min} PM`
                        } else {
                            elLI.textContent = `${hIndex-12}:${min} PM`
                        }
                        elLI.dataset.ampm = "PM"
                    }
                }

            }

            result.push(elLI)
        })


    }

    elUL.innerHTML = ""

    result.forEach(li => elUL.appendChild(li))
}


function onSTETPageLoad() {
    dayChosen = new Date()
    currentDate = new Date()

    getLastETStored()

    dateChange()

    refreshST(STULQueryString)
}


let elDay = document.querySelector(".day")

function dateChange() {
    let dd = dayDiff(dayChosen, now())
    let lastETVsNow = dayDiff(lastET, now())

    timebarReset()
    elETUL.innerHTML = ""

    if (dd === -1) {
        elDD.textContent = "Yesterday"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.add("warning")
        } else {
            elDay.classList.remove("warning")
        }
    } else if (dd === 0) {
        // Today
        elDD.textContent = "Today"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.remove("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.remove("warning")
        } else {
            elDay.classList.remove("warning")
        }
    } else {
        elDD.textContent = dateToDMYY(dayChosen)
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.add("warning")
        } else {
            elDay.classList.remove("warning")
        }
    }
}


document.addEventListener("DOMContentLoaded", onSTETPageLoad)


// This chooses a time in the list given time text
// lastET is stored in a variable and in localStorage
// When a start and end time period is added, the next time period
// start time is the end time of the previous one
// this function chooses the start time in the list
function chooseTime(time, ulQueryString) {
    let elUL = document.querySelector(ulQueryString)

    let findLiItem = Array.from(elUL.childNodes).findIndex(li => li.textContent === time)

    if (findLiItem !== -1) {
        let ulTop = elUL.offsetTop
        let itemTop = elUL.childNodes[findLiItem].offsetTop

        elUL.childNodes[findLiItem].classList.add("selected")

        elUL.scrollTo(0, itemTop - ulTop)
    }

}


// It rounds the time to the next 15 mins if it's not already
// result is put into lastET variable
// It assures the lastET is a time that can be chosen
// from a Start time end time list because it's
// a time with minutes ending in :00, :15, :30, :45
function lastTimeRounded(dt) {
    let {
        y,
        m,
        d,
        hr,
        min
    } = dmyhm(dt)

    if (min % 15 !== 0) {
        return dt + 60000 * (15 - (min % 15))
    } else {
        return dt
    }

}



// This populates Start time list
// it also chooses the Start time based on the last time
// that was chosen
function refreshST() {
    let dd = dayDiff(dayChosen, now())

    setLastETStored(lastTimeRounded(lastET))

    let chosenVsLastET = dayDiff(dayChosen, lastET)

    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (dd === 0) {
        // Today
        if (settingsSTET.hr24) {
            timesPopulate("00:00", timehmampm(new Date(lastTimeRounded(now().valueOf())), settingsSTET.hr24), STULQueryString, zeroTozero)
        } else {
            timesPopulate("00:00 AM", timehmampm(new Date(lastTimeRounded(now().valueOf())), settingsSTET.hr24), STULQueryString, zeroTozero)
        }

    } else {
        if (settingsSTET.hr24) {
            timesPopulate("00:00", "23:45", STULQueryString, false)
        } else {
            timesPopulate("00:00 AM", "11:45 PM", STULQueryString, false)
        }

    }


    if (chosenVsLastET === 0) {
        listUnselect(elSTUL, SC)
        chooseTime(timehmampm(lastET, settingsSTET.hr24), STULQueryString)
        refreshETTime(timehmampm(lastET, settingsSTET.hr24))
    }

}


elSTUL.addEventListener("click", onListClick)
elSTUL.addEventListener("click", refreshET2)


elETUL.addEventListener("click", onListClick)
elETUL.addEventListener("click", refreshET)


function refreshET() {
    let elSTValue = document.querySelector(STULQueryString)
    let st, et, stText, etText

    // let ist = Array.from(elSTValue.childNodes).findIndex(li => Array.from(li.classList).includes("selected"))
    let ist = findIndexSelectedST()
    if (ist !== -1) {
        if (elSTUL.childNodes[ist + 1]) {
            st = elSTUL.childNodes[ist + 1].textContent
        } else {
            st = elSTUL.childNodes[ist].textContent
        }
        stText = elSTUL.childNodes[ist].textContent
    } else {
        st = "0"
        stText = "0"
        elTimebarStartMarker.classList.remove("isvisible")
        elTimebarEndMarker.classList.remove("isvisible")
    }


    let iet = findIndexSelectedET()
    if (iet !== -1) {
        if (elETUL.childNodes[iet + 1]) {
            et = elETUL.childNodes[iet + 1].textContent
        } else {
            et = elETUL.childNodes[iet].textContent
        }
        etText = elETUL.childNodes[iet].textContent

        elTimebarEndMarker.classList.add("isvisible")

    } else {
        et = "0"
        etText = "0"
        elTimebarEndMarker.classList.remove("isvisible")
        elETUL.scrollTo(0, 0)
    }


    timebar(stText, etText)
    customET(stText, etText)

    return st
}


function refreshET2() {
    let et = refreshET()
    refreshETTime(et)
    let st = selectedST()

    if (st === "") {
        // If no ST selected, ET list is empty
        elETUL.innerHTML = ""
    }

    timebar(st, "0")
}


function refreshETTime(time) {
    let dd = dayDiff(dayChosen, now())

    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (dd === 0) {
        // Today
        timesPopulate(time, timehmampm(new Date(lastTimeRounded(now().valueOf() + 100000)), settingsSTET.hr24), ETULQueryString, zeroTozero)
    } else {
        if (settingsSTET.hr24) {
            timesPopulate(time, "23:45", ETULQueryString, zeroTozero)
            // midnight(elETUL, true)
        } else {
            timesPopulate(time, "11:45 PM", ETULQueryString, zeroTozero)
        }
        // THis adds on midnight "00:00" at the end of the list
        // It only goes on et
        // It confuses timesPopulate to end at "00:00"
        // so I add it on seperately
        midnight(elETUL, settingsSTET.hr24)
    }

}


// This adds on midnight at the end of end time list
// Start time list can't have this on it's list
function midnight(list, hr24) {
    let elLi = document.createElement("li");
    (hr24) ? elLi.textContent = "00:00": elLi.textContent = "00:00 AM"
    list.appendChild(elLi)
}

const elDayLeft = document.querySelector(".triangle--left")

elDayLeft.addEventListener("click", (e) => {
    dayChosen = dateChangeDays(dayChosen, -1)
    dateChange()
    refreshST(STULQueryString)
})


const elDayRight = document.querySelector(".triangle--right")

elDayRight.addEventListener("click", (e) => {
    dayChosen = dateChangeDays(dayChosen, 1)
    dateChange()
    refreshST(STULQueryString)
})


// displays duration in decimal
function durationDecimal(st, et) {
    let duration
    if ((st === "0") || (et === "0")) {
        duration = 0
    } else {
        if (et.slice(0, 5) === "00:00") {
            duration = (timeDecimal(et, settingsSTET.hr24, false) - timeDecimal(st, settingsSTET.hr24, true))
        } else {
            duration = (timeDecimal(et, settingsSTET.hr24, true) - timeDecimal(st, settingsSTET.hr24, true))
        }
    }

    return duration
}


// Displays duration as a string with 'hours'
// or 'mins'
function duration(st, et) {
    let dur = durationDecimal(st, et)

    if (dur < 0.04166) {
        // if it's less than an hour, use minutes as the duration measure
        return {
            durationText: Math.floor(dur * 1440) + " mins",
            durationDecimal: dur
        }
    } else {
        return {
            durationText: (dur * 24).toFixed(1) + " hrs",
            durationDecimal: dur
        }
    }
}


// it uses settingsSTET and generates warnings
// based on the settings
// Currently the only setting warning is
// duration threshold
// warning if it's over x hours
function stetWarnings(duration, st) {
    let warn = ""
    let durationThreshold = settingsSTET.durationOverXHrs

    if ((duration > (durationThreshold / 24)) && (durationThreshold !== 0)) {
        warn = requiredMsg(warn, "This is over " + durationThreshold + " hours.")
    }

    let stHoursBeforeNow = settingsSTET.startTimeXHrsBeforeNow
    let hrsAgo = hoursDiff(now(), dateFormat(st))

    if ((stHoursBeforeNow <= hrsAgo) && (stHoursBeforeNow !== 0)) {
        warn = requiredMsg(warn, "The Start time was " + hrsAgo + " hours ago.")
    }

    return warn
}


let elTimebarBar = document.querySelector(".day__timebar--bar")
let elTimebarStart = document.querySelector(".day__timebar-start")
let elTimebarEnd = document.querySelector(".day__timebar-end")
let elTimebarStartMarker = document.querySelector(".day__timebar-start-marker")
let elTimebarEndMarker = document.querySelector(".day__timebar-end-marker")


function timebar(st, et) {

    elTimebarBar.style.left = timeDecimal(st, settingsSTET.hr24, true) * COMPONENT_WIDTH + "px"
    elTimebarStart.style.left = timeDecimal(st, settingsSTET.hr24, true) * COMPONENT_WIDTH + "px"


    if ((timeDecimal(st, settingsSTET.hr24, true) * COMPONENT_WIDTH) >= (COMPONENT_WIDTH - MARKER_WIDTH)) {
        elTimebarStartMarker.style.left = (timeDecimal(st, settingsSTET.hr24, true) * COMPONENT_WIDTH) - MARKER_WIDTH + (STARTEND_MARKER_WIDTH / 2) + "px"
        elTimebarStartMarker.classList.add("br")
        elTimebarStartMarker.classList.remove("bl")
    } else {
        elTimebarStartMarker.style.left = timeDecimal(st, settingsSTET.hr24, true) * COMPONENT_WIDTH + (STARTEND_MARKER_WIDTH / 2) + "px"
        elTimebarStartMarker.classList.add("bl")
        elTimebarStartMarker.classList.remove("br")
    }

    if ((st === "0") || (st === "")) {
        elTimebarStart.classList.remove("isvisible")
        elTimebarStartMarker.classList.remove("isvisible")
        elTimebarEnd.classList.remove("isvisible")
        elTimebarEndMarker.classList.remove("isvisible")

        elTimebarBar.style.width = "0px"
        elTimebarEnd.style.left = elTimebarStart.style.left
    } else {

        elTimebarStart.classList.add("isvisible")
        elTimebarStartMarker.classList.add("isvisible")
        elTimebarStartMarker.textContent = st

        if (et === "0") {
            elTimebarBar.style.width = "20px"
            elTimebarEnd.style.left = Number.parseInt(elTimebarStart.style.left) + 20 + "px"

            elTimebarEnd.classList.remove("isvisible")
            elTimebarEndMarker.classList.remove("isvisible")
        } else {

            if ((st === "0") || (st === "")) {
                elTimebarStart.classList.remove("isvisible")
                elTimebarStartMarker.classList.remove("isvisible")
                elTimebarEnd.classList.remove("isvisible")
                elTimebarEndMarker.classList.remove("isvisible")
            } else {
                // elTimebarBar.style.width = ((timeDecimal(et, settingsSTET.hr24, true) - timeDecimal(st, settingsSTET.hr24, true))) * COMPONENT_WIDTH + "px"
                elTimebarBar.style.width = durationDecimal(st, et) * COMPONENT_WIDTH + "px"
                elTimebarEnd.style.left = Number.parseInt(elTimebarStart.style.left) + (durationDecimal(st, et) * COMPONENT_WIDTH) + "px"
                elTimebarEndMarker.textContent = et

                elTimebarStart.classList.add("isvisible")
                elTimebarStartMarker.classList.add("isvisible")
                elTimebarEnd.classList.add("isvisible")
                elTimebarEndMarker.classList.add("isvisible")
            }

        }
    }

    if ((timeDecimal(et, settingsSTET.hr24, true) * COMPONENT_WIDTH) >= (COMPONENT_WIDTH - MARKER_WIDTH)) {
        elTimebarEndMarker.style.left = (timeDecimal(et, settingsSTET.hr24, true) * COMPONENT_WIDTH) - MARKER_WIDTH + (STARTEND_MARKER_WIDTH / 2) + "px"
        elTimebarEndMarker.classList.add("tr")
        elTimebarEndMarker.classList.remove("tl")
    } else {
        elTimebarEndMarker.style.left = (timeDecimal(et, settingsSTET.hr24, true) * COMPONENT_WIDTH) + (STARTEND_MARKER_WIDTH / 2) + "px"
        elTimebarEndMarker.classList.add("tl")
        elTimebarEndMarker.classList.remove("tr")
    }

}


function timebarReset(st, et) {
    elTimebarBar.style.width = "0px"
    elTimebarBar.style.left = "20px"

    elTimebarStart.classList.remove("isvisible")
    elTimebarStartMarker.classList.remove("isvisible")
    elTimebarEnd.classList.remove("isvisible")
    elTimebarEndMarker.classList.remove("isvisible")
}


// Current date chosen (dayChosen variable), it takes time
// and makes it a date-time value
function dateFormat(time, hr24) {
    let hr = timeHourMin(time)
    let dt = new Date(dayChosen.getFullYear(), dayChosen.getMonth(), dayChosen.getDate(), hr.h, hr.m, 0, 0)

    return dt.valueOf()
}


function requiredMsg(msg, overallmsg) {
    return overallmsg = overallmsg === '' ? msg : overallmsg + "\n" + msg
}


// This is a custom function for when End time is clicked
// If you want to display duration somewhere
// add the code in here with the 'duration' function
// Settings warning code can be added here too.
function customET(st, et) {
    const elTestP = document.querySelector(".test p")
    let {
        durationText
    } = duration(st, et)
    // console.log(dur)

    if (durationText === "0 mins") {
        elTestP.textContent = " "
    } else {
        elTestP.textContent = durationText
    }

    let durationDec = durationDecimal(st, et)
    let warn = stetWarnings(durationDec, st)
    if (warn) {
        alert(warn)
    }
}
