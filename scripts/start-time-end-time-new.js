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


// -------------------------------------------------------------------------------


// Given start and end elements, it returns the start and end time
const stValue = (stUL) => (stUL.dataset.starttime) ? stUL.dataset.starttime : ""
const etValue = (etUL) => (etUL.dataset.endtime) ? etUL.dataset.endtime : ""
const idValue = (stet) => (stet.dataset.stetId) ? stet.dataset.stetId : ""
const dayValue = (d) => (d.dataset.day) ? Number(d.dataset.day) : 0


function dayLeft(e) {
    dayChangeEvent(e, -1)
}


function dayRight(e) {
    dayChangeEvent(e, 1)
}


function dayChangeEvent(e, dayChange) {
    let elStet = e.target.parentNode.parentNode.parentNode.parentNode
    let elDay = e.target.parentNode.parentNode.parentNode
    let day = dayValue(elDay) + dayChange
    elDay.dataset.day = day

    let {
        id,
        day: dayChanged,
        elStart,
        elEnd,
        stUL
    } = stetDOM(elStet)


    elStart.dataset.starttime = ""
    elEnd.dataset.endtime = ""

    dateChange(elStet)
    refreshST(id, dayChanged, stUL)
}


// Populate list based on start time (st) and end time (et)
function timesPopulate(st, et, ul, zeroTozero) {
    let elUL = ul

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



// This chooses a time in the list given time text
// lastET is stored in a variable and in localStorage
// When a start and end time period is added, the next time period
// start time is the end time of the previous one
// this function chooses the start time in the list
function chooseTime(time, ul) {
    let elUL = ul

    let findLiItem = Array.from(elUL.childNodes).findIndex(li => li.textContent === time)

    if (findLiItem !== -1) {
        let ulTop = elUL.offsetTop
        let itemTop = elUL.childNodes[findLiItem].offsetTop

        elUL.childNodes[findLiItem].classList.add("selected")

        elUL.scrollTo(0, itemTop - ulTop)
    }
}


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



// Current date chosen (dayChosen variable), it takes time
// and makes it a date-time value
function dateFormat(day, time, hr24) {
    let dayChosen = dateChangeDays(new Date(), day)
    let hr = timeHourMin(time)
    let dt = new Date(dayChosen.getFullYear(), dayChosen.getMonth(), dayChosen.getDate(), hr.h, hr.m, 0, 0)

    return dt.valueOf()
}


function requiredMsg(msg, overallmsg) {
    return overallmsg = overallmsg === '' ? msg : overallmsg + "\n" + msg
}



// make changes here
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


//     lastET = lastet   < --- get rid of this line
// takes a number
function setLastETStored(lastet) {
    lastET = lastet
    localStorage.setItem("lastET", String(lastet))
}



// -------------------------------------------------------------------------------

// get rid of this
let lastET


// -------------------------------------------------------------------------------


function dateChange(el) {
    let {
        id,
        day,
        st,
        et,
        stUL,
        etUL
    } = stetDOM(el)

    const elDay = el.children[0]

    let lastETVsNow = dayDiff(lastET, now())

    let elHeading = elDay.children[1]
    elDayLeft = elDay.children[0].children[0].children[0]
    elDayRight = elDay.children[2].children[0].children[0]

    timebarReset(el)
    etUL.innerHTML = ""

    if (day === -1) {
        elHeading.textContent = "Yesterday"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.add("warning")
        } else {
            elDay.classList.remove("warning")
        }
    } else if (day === 0) {
        // Today
        elHeading.textContent = "Today"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.remove("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.remove("warning")
        } else {
            elDay.classList.remove("warning")
        }
    } else {
        elHeading.textContent = dateToDMYY(dateChangeDays(now(), Number(day)))
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastETVsNow === 0) {
            elDay.classList.add("warning")
        } else {
            elDay.classList.remove("warning")
        }
    }



    function timebarReset(el) {
        const elTimebar = el.children[1].childNodes[1]
        const elTimebarBar = elTimebar.childNodes[1]

        const elTimebarStart = elTimebar.children[2]
        const elTimebarStartMarker = elTimebar.children[4]

        const elTimebarEnd = elTimebar.children[3]
        const elTimebarEndMarker = elTimebar.children[5]

        elTimebarBar.style.width = "0px"
        elTimebarBar.style.left = "20px"

        elTimebarStart.classList.remove("isvisible")
        elTimebarStartMarker.classList.remove("isvisible")
        elTimebarEnd.classList.remove("isvisible")
        elTimebarEndMarker.classList.remove("isvisible")
    }

}



// -------------------------------------------------------------------------------






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
function refreshST(id, day, stUL) {
    setLastETStored(lastTimeRounded(lastET))

    let chosenVsLastET = dayDiff(lastET, dateChangeDays(new Date(), day).valueOf())

    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (day === 0) {
        // Today
        if (settingsSTET.hr24) {
            timesPopulate("00:00", timehmampm(new Date(lastTimeRounded(now().valueOf())), settingsSTET.hr24), stUL, zeroTozero)
        } else {
            timesPopulate("00:00 AM", timehmampm(new Date(lastTimeRounded(now().valueOf())), settingsSTET.hr24), stUL, zeroTozero)
        }

    } else {
        if (settingsSTET.hr24) {
            timesPopulate("00:00", "23:45", stUL, false)
        } else {
            timesPopulate("00:00 AM", "11:45 PM", stUL, false)
        }

    }

    stUL.scrollTo(0, 0)


    if (chosenVsLastET === 0) {
        listUnselect(stUL, SC)
        chooseTime(timehmampm(lastET, settingsSTET.hr24), stUL)
        let eletUL = stUL.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[1].childNodes[1]

        refreshETTime(id, day, eletUL, timehmampm(lastET, settingsSTET.hr24))
    }

}



// -------------------------------------------------------------------------------



function onClickST(e) {
    if (e.target.textContent) {
        let elStet = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

        let {
            id,
            day,
            elStart,
            elEnd,
            stUL,
            etUL
        } = stetDOM(elStet)

        let st = (e.target.textContent && e.target.classList.contains(SC)) ? e.target.textContent : ""
        elStart.dataset.starttime = st

        refreshETTime(id, day, etUL, st)

        if (st === "") {
            // If no ST selected, ET list is empty
            etUL.innerHTML = ""
            elEnd.dataset.endtime = st
        }

        timebar(e, st, "0")
    }
}


function onClickET(e) {
    if (e.target.textContent) {
        const elStet = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

        let {
            id,
            day,
            st,
            elStart,
            elEnd,
            stUL,
            etUL
        } = stetDOM(elStet)

        let et = (e.target.textContent && e.target.classList.contains(SC)) ? e.target.textContent : ""
        elEnd.dataset.endtime = et

        if (et) {
            // elTimebarEndMarker.classList.add("isvisible")
        } else {
            et = "0"
            // elTimebarEndMarker.classList.remove("isvisible")
            etUL.scrollTo(0, 0)
        }

        timebar(e, st, et)
        customET(elStet)
    }
}


function onSTETPageLoad() {

    getLastETStored()


    let elStet = document.querySelectorAll(".stet")
    let arrStet = Array.from(elStet)

    arrStet.forEach(stet => {

        let {
            id,
            day,
            elStart,
            elEnd,
            stUL,
            etUL
        } = stetDOM(stet)

        refreshST(id, day, stUL)

        stetClickEvents(stet)
    })


    function stetClickEvents(el) {
        el.querySelector(".start ul").addEventListener("click", onListClick)
        el.querySelector(".start ul").addEventListener("click", onClickST)

        el.querySelector(".end ul").addEventListener("click", onListClick)
        el.querySelector(".end ul").addEventListener("click", onClickET)


        el.querySelector(".triangle--left").addEventListener("click", dayLeft)
        el.querySelector(".triangle--right").addEventListener("click", dayRight)

        dateChange(el)
    }

}


document.addEventListener("DOMContentLoaded", onSTETPageLoad)



function refreshETTime(id, day, ul, time) {
    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (day === 0) {
        // Today
        timesPopulate(time, timehmampm(new Date(lastTimeRounded(now().valueOf() + 100000)), settingsSTET.hr24), ul, zeroTozero)
    } else {
        if (settingsSTET.hr24) {
            timesPopulate(time, "23:45", ul, zeroTozero)
            // midnight(elETUL, true)
        } else {
            timesPopulate(time, "11:45 PM", ul, zeroTozero)
        }
        midnight(ul, settingsSTET.hr24)
    }

}


function midnight(list, hr24) {
    let elLi = document.createElement("li");
    (hr24) ? elLi.textContent = "00:00": elLi.textContent = "00:00 AM"
    list.appendChild(elLi)
}




// it uses settingsSTET and generates warnings
// based on the settings
// Currently the only setting warning is
// duration threshold
// warning if it's over x hours
function stetWarnings(duration, stet) {
    let warn = ""
    let durationThreshold = settingsSTET.durationOverXHrs

    let {
        id,
        day,
        st,
        et
    } = stetDOM(stet)


    if ((duration > (durationThreshold / 24)) && (durationThreshold !== 0)) {
        warn = requiredMsg(warn, "This is over " + durationThreshold + " hours.")
    }

    let stHoursBeforeNow = settingsSTET.startTimeXHrsBeforeNow
    let hrsAgo = hoursDiff(now(), dateFormat(day, st, settingsSTET.hr24))

    if ((stHoursBeforeNow <= hrsAgo) && (stHoursBeforeNow !== 0)) {
        warn = requiredMsg(warn, "The Start time was " + hrsAgo + " hours ago.")
    }

    return warn
}



function timebar(e, st, et) {
    let elTimebar = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[1]

    let elTimebarBar = elTimebar.childNodes[1]

    let elTimebarStart = elTimebar.childNodes[5]
    let elTimebarEnd = elTimebar.childNodes[7]

    let elTimebarStartMarker = elTimebar.childNodes[9]
    let elTimebarEndMarker = elTimebar.childNodes[11]

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


function stetDOM(stet) {
    let id = idValue(stet)
    let day = dayValue(stet.childNodes[1])
    let elStart = stet.childNodes[5].childNodes[1]
    let elEnd = stet.childNodes[5].childNodes[3]
    let st = stValue(stet.childNodes[5].childNodes[1])
    let et = etValue(stet.childNodes[5].childNodes[3])
    let elstUL = stet.childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[1]
    let eletUL = stet.childNodes[5].childNodes[3].childNodes[3].childNodes[1].childNodes[1]

    return {
        id,
        day,
        elStart,
        elEnd,
        st,
        et,
        stUL: elstUL,
        etUL: eletUL
    }

}



// This is a custom function for when End time is clicked
// If you want to display duration somewhere
// add the code in here with the 'duration' function
// Settings warning code can be added here too.
function customET(stet) {
    const elTestP = document.querySelector(".test p")

    let {
        id,
        day,
        st,
        et
    } = stetDOM(stet)

    let {
        durationText
    } = duration(st, et)

    if (durationText === "0 mins") {
        elTestP.textContent = " "
    } else {
        elTestP.textContent = durationText
    }

    let durationDec = durationDecimal(st, et)
    let warn = stetWarnings(durationDec, stet)
    if (warn) {
        alert(warn)
    }
}
