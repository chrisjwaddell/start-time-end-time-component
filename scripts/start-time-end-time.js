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


let settingDefaults = {
    durationOverXHrs: 10,
    startTimeXHrsBeforeNow: 12,
    saveLastETInLocalStorage: true,
    hr24: false
}

// -------------------------------------------------------------------------------


// Given start and end elements, it returns the start and end time
const stValue = (stUL) => (stUL.dataset.starttime) ? stUL.dataset.starttime : ""
const etValue = (etUL) => (etUL.dataset.endtime) ? etUL.dataset.endtime : ""
const idValue = (stet) => (stet.dataset.stetId) ? stet.dataset.stetId : ""
const dayValue = (d) => (d.dataset.day) ? Number(d.dataset.day) : 0




// -------------------------------------------------------------------------------
// ^DAY SELECT

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

    let stet = stetDOM(elStet)
    stet.day = day

    stet.elStart.dataset.starttime = ""
    stet.elEnd.dataset.endtime = ""

    let {
        lastET,
        lastETVsNow,
        hr24
    } = dateChange(elStet, stet)

    // refreshST(stet, lastET, lastETVsNow, hr24)
    refreshTimeLists(stet, lastET, lastETVsNow, hr24)
}


function dateChange(el, stet) {
    let settings = findSettings(stet.id) || {}
    let saveLastETInLocalStorage = (typeof settings.saveLastETInLocalStorage === "undefined") ? settingDefaults.saveLastETInLocalStorage : settings.saveLastETInLocalStorage
    let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24

    const elDay = el.children[0]


    let lastET = (saveLastETInLocalStorage) ? getLastETStored(stet.id) : null
    let lastETVsNow = (lastET) ? dayDiff(lastET, now().valueOf()) : null

    let elHeading = elDay.children[1]
    elDayLeft = elDay.children[0].children[0].children[0]
    elDayRight = elDay.children[2].children[0].children[0]

    timebarReset(el)
    stet.etUL.innerHTML = ""

    if (stet.day === -1) {
        elHeading.textContent = "Yesterday"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastET) {
            if (lastETVsNow === 0) {
                elDay.classList.add("warning")
            } else {
                elDay.classList.remove("warning")
            }
        }
    } else if (stet.day === 0) {
        // Today
        elHeading.textContent = "Today"
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.remove("isvisible")
        if (lastET) {
            if (lastETVsNow === 0) {
                elDay.classList.remove("warning")
            } else {
                elDay.classList.remove("warning")
            }
        }
    } else {
        elHeading.textContent = dateToDMYY(dateChangeDays(now().valueOf(), Number(stet.day)))
        elDayLeft.classList.add("isvisible")
        elDayRight.classList.add("isvisible")
        if (lastET) {
            if (lastETVsNow === 0) {
                elDay.classList.add("warning")
            } else {
                elDay.classList.remove("warning")
            }
        }
    }

    return {
        lastET,
        lastETVsNow,
        hr24
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


function timebar(stet, hr24) {
    // let elTimebar = stet.timebar.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[1]
    let elTimebar = stet.timebar

    let elTimebarBar = elTimebar.childNodes[1]

    let elTimebarStart = elTimebar.childNodes[5]
    let elTimebarEnd = elTimebar.childNodes[7]

    let elTimebarStartMarker = elTimebar.childNodes[9]
    let elTimebarEndMarker = elTimebar.childNodes[11]

    elTimebarBar.style.left = timeDecimal(stet.st, hr24, true) * COMPONENT_WIDTH + "px"
    elTimebarStart.style.left = timeDecimal(stet.st, hr24, true) * COMPONENT_WIDTH + "px"


    if ((stet.st === "0") || (stet.st === "")) {
        elTimebarStart.classList.remove("isvisible")
        elTimebarStartMarker.classList.remove("isvisible")
        elTimebarEnd.classList.remove("isvisible")
        elTimebarEndMarker.classList.remove("isvisible")

        elTimebarBar.style.width = "0px"
        elTimebarEnd.style.left = elTimebarStart.style.left
    } else {

        elTimebarStart.classList.add("isvisible")
        elTimebarStartMarker.classList.add("isvisible")
        elTimebarStartMarker.textContent = stet.st

        if (stet.et === "0" || (stet.et === "")) {
            elTimebarBar.style.width = "20px"
            elTimebarEnd.style.left = Number.parseInt(elTimebarStart.style.left) + 20 + "px"

            elTimebarEnd.classList.remove("isvisible")
            elTimebarEndMarker.classList.remove("isvisible")
        } else {

            if ((stet.st === "0") || (stet.st === "")) {
                elTimebarStart.classList.remove("isvisible")
                elTimebarStartMarker.classList.remove("isvisible")
                elTimebarEnd.classList.remove("isvisible")
                elTimebarEndMarker.classList.remove("isvisible")
            } else {
                elTimebarBar.style.width = durationDecimal(stet.st, stet.et, hr24) * COMPONENT_WIDTH + "px"
                elTimebarEnd.style.left = Number.parseInt(elTimebarStart.style.left) + (durationDecimal(stet.st, stet.et, hr24) * COMPONENT_WIDTH) + "px"
                elTimebarEndMarker.textContent = stet.et

                elTimebarStart.classList.add("isvisible")
                elTimebarStartMarker.classList.add("isvisible")
                elTimebarEnd.classList.add("isvisible")
                elTimebarEndMarker.classList.add("isvisible")
            }

        }
    }


    // start means the timebar 'left' value is 0 to 72 px, the width of the bubble
    // so the bubble can't appear on the left at all
    const start = Number.parseInt(elTimebarStart.style.left) < MARKER_WIDTH
    const end = (Number.parseInt(elTimebarEnd.style.left) > (COMPONENT_WIDTH - MARKER_WIDTH))

    // if (Number.parseInt(elTimebarStartMarker.style.left) + 72) <= (Number.parseInt(elTimebarEndMarker.style.left))
    let widthOne = false
    let widthTwo = false

    if (Number.parseInt(elTimebarBar.style.width) > MARKER_WIDTH) {
        if (Number.parseInt(elTimebarBar.style.width) > (MARKER_WIDTH * 2)) {
            widthTwo = true
        } else {
            widthOne = true
        }
    }

    if (widthTwo) {
        elTimebarStartMarker.style.left = elTimebarStart.style.left
        elTimebarStartMarker.classList.remove("br")
        elTimebarStartMarker.classList.remove("rt")
        elTimebarStartMarker.classList.remove("line")
        elTimebarStartMarker.classList.add("bl")
        elTimebarEndMarker.style.left = Number.parseInt(elTimebarEnd.style.left) - MARKER_WIDTH + "px"
        elTimebarEndMarker.classList.remove("bl")
        elTimebarEndMarker.classList.remove("lt")
        elTimebarEndMarker.classList.remove("line")
        elTimebarEndMarker.classList.add("br")
    } else {
        if (start) {
            elTimebarStartMarker.style.left = elTimebarStart.style.left
            elTimebarStartMarker.classList.remove("br")
            elTimebarStartMarker.classList.remove("rt")
            elTimebarStartMarker.classList.remove("line")
            elTimebarStartMarker.classList.add("bl")
            if (widthOne) {
                elTimebarEndMarker.style.left = elTimebarEnd.style.left
                elTimebarEndMarker.classList.remove("br")
                elTimebarEndMarker.classList.remove("lt")
                elTimebarEndMarker.classList.remove("line")
                elTimebarEndMarker.classList.add("bl")
            } else {
                elTimebarEndMarker.style.left = elTimebarEnd.style.left
                elTimebarEndMarker.classList.remove("br")
                elTimebarEndMarker.classList.remove("bl")
                elTimebarEndMarker.classList.add("lt")
                elTimebarEndMarker.classList.add("line")
            }
        } else {
            if (end) {
                elTimebarEndMarker.style.left = Number.parseInt(elTimebarEnd.style.left) - MARKER_WIDTH + "px"
                elTimebarEndMarker.classList.remove("bl")
                elTimebarEndMarker.classList.remove("lt")
                elTimebarEndMarker.classList.remove("line")
                elTimebarEndMarker.classList.add("br")
                if (widthOne) {
                    elTimebarStartMarker.style.left = Number.parseInt(elTimebarStart.style.left) - MARKER_WIDTH + "px"
                    elTimebarStartMarker.classList.remove("bl")
                    elTimebarStartMarker.classList.remove("rt")
                    elTimebarStartMarker.classList.remove("line")
                    elTimebarStartMarker.classList.add("br")
                } else {
                    elTimebarStartMarker.style.left = Number.parseInt(elTimebarStart.style.left) - MARKER_WIDTH + "px"
                    elTimebarStartMarker.classList.remove("br")
                    elTimebarStartMarker.classList.remove("bl")
                    elTimebarStartMarker.classList.add("rt")
                    elTimebarStartMarker.classList.add("line")
                }
            } else {
                // not start and not end
                elTimebarStartMarker.style.left = Number.parseInt(elTimebarStart.style.left) - MARKER_WIDTH + "px"
                elTimebarStartMarker.classList.remove("bl")
                elTimebarStartMarker.classList.remove("rt")
                elTimebarStartMarker.classList.remove("line")
                elTimebarStartMarker.classList.add("br")
                elTimebarEndMarker.style.left = elTimebarEnd.style.left
                elTimebarEndMarker.classList.remove("br")
                elTimebarEndMarker.classList.remove("lt")
                elTimebarEndMarker.classList.remove("line")
                elTimebarEndMarker.classList.add("bl")
            }

        }
    }


}



// -------------------------------------------------------------------------------
// ^ST AND ET LISTS

// Populate list based on start time (st) and end time (et)
function timesPopulate(st, et, ul, zeroTozero, hr24) {
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

            if (hr24) {
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


// The End time list can end at midnight,
// Start time list cannot have midnight
// at the end of the list
function midnight(list, hr24) {
    let elLi = document.createElement("li");
    (hr24) ? elLi.textContent = "00:00": elLi.textContent = "00:00 AM"
    list.appendChild(elLi)
}



// This chooses a time in the list given time text
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


// Current date chosen (dayChosen variable), it takes time
// and makes it a date-time value
function dateFormat(day, time, hr24) {
    let dayChosen = dateChangeDays(new Date(), day)
    let hr = timeHourMin(time, hr24)
    let dt = new Date(dayChosen.getFullYear(), dayChosen.getMonth(), dayChosen.getDate(), hr.h, hr.m, 0, 0)

    return dt.valueOf()
}


// This populates Start time list
// it also chooses the Start time based on the last time
// that was chosen
function refreshST(stet, lastET, lastETVsNow, hr24) {
    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (stet.day === 0) {
        // Today
        if (hr24) {
            timesPopulate("00:00", timehmampm(new Date(lastTimeRounded(now().valueOf())), hr24), stet.stUL, zeroTozero, hr24)
        } else {
            timesPopulate("00:00 AM", timehmampm(new Date(lastTimeRounded(now().valueOf())), hr24), stet.stUL, zeroTozero, hr24)
        }

    } else {
        if (hr24) {
            timesPopulate("00:00", "23:45", stet.stUL, false, hr24)
        } else {
            timesPopulate("00:00 AM", "11:45 PM", stet.stUL, false, hr24)
        }
    }


    listUnselect(stet.stUL, SC)

}


// Find the time after the ST selected, that's what
// ET list starts with
function nextTimeSelectedST(stUL) {
    let selectedIndex = listFindSelected(stUL, SC)

    if (selectedIndex !== -1) {
        return (stUL.childNodes[selectedIndex + 1]) ? stUL.childNodes[selectedIndex + 1].textContent : ""
    } else {
        return ""
    }
}


function onClickST(e) {
    if (e.target.textContent) {
        let elStet = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

        let stet = stetDOM(elStet)

        let settings = findSettings(stet.id) || {}
        let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24

        let st = (e.target.textContent && e.target.classList.contains(SC)) ? e.target.textContent : ""
        stet.elStart.dataset.starttime = st
        stet.st = st

        stet.elEnd.dataset.endtime = ""
        stet.et = ""

        if (st === "" || st === "0") {
            // If no ST selected, ET list is empty
            stet.etUL.innerHTML = ""
            // stet.elEnd.dataset.endtime = st
        } else {
            lastETSelectAndET(stet, hr24)
        }

        timebar(stet, hr24)
    }
}


function onClickET(e) {
    if (e.target.textContent) {
        const elStet = e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode

        let stet = stetDOM(elStet)

        let et = (e.target.textContent && e.target.classList.contains(SC)) ? e.target.textContent : ""
        stet.elEnd.dataset.endtime = et
        stet.et = et

        if (et) {
            // elTimebarEndMarker.classList.add("isvisible")
        } else {
            et = "0"
            // elTimebarEndMarker.classList.remove("isvisible")
            stet.etUL.scrollTo(0, 0)
        }

        let settings = findSettings(stet.id) || {}
        let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24

        timebar(stet, hr24)

    }
}


// When page is refreshed or a new day selected
// ST is refreshed. It looks to see if lastET
// is same as day and it selects that and
// populates ET list
function lastETSelectAndET(stet, hr24) {
    let nextST = nextTimeSelectedST(stet.stUL)
    if (nextST !== "") {
        // let eletUL = stUL.parentNode.parentNode.parentNode.parentNode.childNodes[3].childNodes[3].childNodes[1].childNodes[1]
        refreshET(stet.id, stet.day, stet.etUL, nextST, hr24)

    } else {
        stet.etUL.innerHTML = ""
        if (stet.day !== 0) midnight(stet.etUL, hr24)
    }
    // timebar(stet, hr24)

}




// -------------------------------------------------------------------------------
// ^LOCALSTORAGE

// make changes here
function getLastETStored(id) {
    if (typeof localStorage == 'undefined') return null

    let lastET = Number(localStorage.getItem(id))

    if (lastET) {
        if (Number(lastET) === "NaN") {
            lastET = lastTimeRounded(new Date().valueOf()).valueOf()
            setLastETStored(id, lastET)
        }
    } else {
        lastET = lastTimeRounded(new Date().valueOf()).valueOf()
        setLastETStored(id, lastET)
    }

    return lastET
}


// takes a number
function setLastETStored(id, lastet) {
    if (typeof localStorage !== 'undefined')
        localStorage.setItem(id, String(lastet))
}


function refreshET(id, day, ul, time, hr24) {
    let zeroTozero
    if (now().getHours() > 12) {
        zeroTozero = true
    } else {
        zeroTozero = false
    }

    if (day === 0) {
        // Today
        const MINS_7 = 1000 * 60 * 7
        timesPopulate(time, timehmampm(new Date(lastTimeRounded(now().valueOf() + MINS_7)), hr24), ul, zeroTozero, hr24)
    } else {
        if (hr24) {
            timesPopulate(time, "23:45", ul, zeroTozero, hr24)
            // midnight(elETUL, true)
        } else {
            timesPopulate(time, "11:45 PM", ul, zeroTozero, hr24)
        }
        midnight(ul, hr24)
    }

    ul.scrollTo(0, 0)

}




// -------------------------------------------------------------------------------
// ^WARNING AND RESULTS


const findSettings = (id) => StetSettings.find(s => s.stetId === id)


// it uses StetSettings and generates warnings
// based on the settings
// Currently the only setting warnings are:
// * Star time - x hours before now
// * duration threshold - if over x hrs, warn me
function stetWarnings(id, day, st, et) {
    let settings = findSettings(id) || {}

    let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24
    let stHoursBeforeNow = (typeof settings.startTimeXHrsBeforeNow === "undefined") ? settingDefaults.startTimeXHrsBeforeNow : settings.startTimeXHrsBeforeNow

    let hrsAgo = hoursDiff(now().valueOf(), dateFormat(day, st, hr24));

    let warn = "";
    let durationThreshold = (typeof settings.durationThreshold === "undefined") ? settingDefaults.durationThreshold : settings.durationThreshold

    let durationDec = 0
    if ((st !== "0") && (st !== "") && (et !== "0") && (et !== "")) {
        durationDec = durationDecimal(st, et, hr24)
    }

    if ((durationDec > (durationThreshold / 24)) && (durationThreshold !== 0)) {
        warn = requiredMsg(warn, "This is over " + durationThreshold + " hours.")
    }

    if ((stHoursBeforeNow <= hrsAgo) && (stHoursBeforeNow !== 0)) {
        warn = requiredMsg(warn, "The Start time was " + hrsAgo + " hours ago.")
    }

    return warn
}



// displays duration in decimal
function durationDecimal(st, et, hr24) {
    let duration
    if ((st === "0") || (et === "0") || (st === "") || (et === "")) {
        duration = 0
    } else {
        if (et.slice(0, 5) === "00:00") {
            duration = (timeDecimal(et, hr24, false) - timeDecimal(st, hr24, true))
        } else {
            duration = (timeDecimal(et, hr24, true) - timeDecimal(st, hr24, true))
        }
    }

    return duration
}


// Displays duration as a string with 'hours'
// or 'mins'
function duration(st, et, hr24) {
    let dur = durationDecimal(st, et, hr24)

    if (dur < 0.04166) {
        // if it's less than an hour, use minutes as the duration measure
        return {
            durationText: Math.floor(dur * 1440) + " mins",
            durationDecimal: dur * 24
        }
    } else {

        let str = String((dur * 24).toFixed(2))

        if (str.slice(str.length - 3, str.length) === ".00") {
            str = str.slice(0, str.length - 3)
        } else if (str.slice(str.length - 3, str.length) === ".50") {
            str = str.slice(0, str.length - 1)
        }

        return {
            durationText: str + " hrs",
            durationDecimal: dur * 24
        }
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

    let minNew = min
    if (min % 15 !== 0) {
        minNew = (min - (min % 15))
    }

    return new Date(y, m, d, hr, minNew)
}


// This function returns an object with the st, et, duration
// warning message, required message
// Run this function in an Add event
// refresh means clear the start time and end time lists
// and refresh the timebar
// updateLocalStorage tells it to localStorage with the lastET
function stetResult(id, refresh, updateLocalStorage) {
    const refr = refresh || false
    const getStet = (id) => document.querySelector(`.stet[data-stet-id="${id}"]`)

    const elStet = getStet(id)

    if (!elStet) {
        console.log(`data-stet-id not found for '${id}'`)
        return null
    }

    let settings = findSettings(id) || {}

    if (isObjectEmpty(settings)) {
        console.log(`StetSettings array needs to have an object with property 'stetId: ${id}'`)
        return null
    }

    let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24
    let saveLastETInLocalStorage = (typeof settings.saveLastETInLocalStorage === "undefined") ? settingDefaults.saveLastETInLocalStorage : settings.saveLastETInLocalStorage


    let result = {}

    let stet = stetDOM(elStet)

    result.day = stet.day
    result.st = stet.st
    result.et = stet.et

    let required = ""
    if (!stet.st) {
        required = "Start time not filled in"
    }
    if (!stet.et) {
        required = requiredMsg(required, "End time not filled in")
    }

    let stFilledIn = Boolean(stet.st)
    let etFilledIn = Boolean(stet.et)

    result.required = required
    result.stFilledIn = stFilledIn
    result.etFilledIn = etFilledIn
    result.stetFilledIn = stFilledIn && etFilledIn
    let {
        durationText,
        durationDecimal
    } = duration(stet.st, stet.et, hr24)
    result.durationText = durationText || ""
    result.durationDecimal = durationDecimal || 0

    let stt = stet.st ? stet.st : "0"
    let ett = stet.et ? stet.et : "0"


    let w = stetWarnings(stet.id, stet.day, stt, ett)
    result.warnings = w

    let lastET = lastTimeRounded(dateFormat(result.day, ett, hr24)).valueOf()
    if (saveLastETInLocalStorage && updateLocalStorage) setLastETStored(id, lastET)

    if (refr) {
        if (result.stetFilledIn) {
            listUnselect(stet.stUL, SC)
            listUnselect(stet.etUL, SC)

            let lastETVsNow = (lastET) ? dayDiff(lastET, now().valueOf()) : null
            refreshTimeLists(stet, lastTimeRounded(dateFormat(result.day, ett, hr24)).valueOf(), lastETVsNow, hr24)

            // chooseTime(stet.et, stet.stUL)

            // stet.elStart.dataset.starttime = result.et
            // stet.st = result.et


            // stet.elEnd.dataset.endtime = ""
            // stet.et = ""

            // lastETSelectAndET(stet, hr24)

            // timebarReset(elStet)
            // timebar(stet, hr24)
        }
    }

    return result
}


// -------------------------------------------------------------------------------



// All Start date end date items, populate Start date list
// and add events
function onSTETPageLoad() {
    let elStet = document.querySelectorAll(".stet")
    let arrStet = Array.from(elStet)

    arrStet.forEach(stet => {
        let stetObj = stetDOM(stet)

        stetClickEvents(stet)

        let {
            lastET,
            lastETVsNow,
            hr24
        } = dateChange(stet, stetObj)

        // dateChange(stet, stetObj)

        // refreshST(stetObj, lastET, lastETVsNow, hr24)
        refreshTimeLists(stetObj, lastET, lastETVsNow, hr24)
    })


    function stetClickEvents(el) {
        el.querySelector(".start ul").addEventListener("click", onListClick)
        el.querySelector(".start ul").addEventListener("click", onClickST)

        el.querySelector(".end ul").addEventListener("click", onListClick)
        el.querySelector(".end ul").addEventListener("click", onClickET)


        el.querySelector(".triangle--left").addEventListener("click", dayLeft)
        el.querySelector(".triangle--right").addEventListener("click", dayRight)

    }

}


document.addEventListener("DOMContentLoaded", onSTETPageLoad)


// Refresh every 10 mins
function onTimeout() {
    let elStet = document.querySelectorAll(".stet")
    let arrStet = Array.from(elStet)

    arrStet.forEach(stet => {
        let stetObj = stetDOM(stet)

        let settings = findSettings(stet.id) || {}
        let saveLastETInLocalStorage = (typeof settings.saveLastETInLocalStorage === "undefined") ? settingDefaults.saveLastETInLocalStorage : settings.saveLastETInLocalStorage
        let lastET = (saveLastETInLocalStorage) ? getLastETStored(stet.id) : null
        let lastETVsNow = (lastET) ? dayDiff(lastET, now().valueOf()) : null
        let hr24 = (typeof settings.hr24 === "undefined") ? settingDefaults.hr24 : settings.hr24

        // refreshST(stetObj, lastET, lastETVsNow, hr24)
        refreshTimeLists(stetObj, lastET, lastETVsNow, hr24)
    })

    setTimeout(() => onTimeout(), 1000 * 60 * 10)
}

setTimeout(() => onTimeout(), 1000 * 60 * 10);


// Takes a DOM tree structure that has a 'stet' class
// and finds the start an end elements, the start and
// end lists, start value, end value, day value and timebar
// element
function stetDOM(stet) {
    // console.log(stet)
    let id = idValue(stet)
    let timebar = stet.childNodes[3].childNodes[1]
    let day = dayValue(stet.childNodes[1])
    let elStart = stet.childNodes[5].childNodes[1]
    let elEnd = stet.childNodes[5].childNodes[3]
    let st = stValue(stet.childNodes[5].childNodes[1])
    let et = etValue(stet.childNodes[5].childNodes[3])
    let elstUL = stet.childNodes[5].childNodes[1].childNodes[3].childNodes[1].childNodes[1]
    let eletUL = stet.childNodes[5].childNodes[3].childNodes[3].childNodes[1].childNodes[1]

    return {
        id,
        timebar,
        day,
        elStart,
        elEnd,
        st,
        et,
        stUL: elstUL,
        etUL: eletUL
    }

}


function refreshTimeLists(stet, lastET, lastETVsNow, hr24) {

    refreshST(stet, lastET, lastETVsNow, hr24)

    stet.st = ""
    stet.elStart.dataset.starttime = stet.st
    stet.et = ""
    stet.elEnd.dataset.starttime = stet.et

    if (lastET) {
        let chosenVsLastET = dayDiff(lastET, dateChangeDays(new Date(), stet.day).valueOf())

        if (chosenVsLastET === 0) {
            chooseTime(timehmampm(lastET, hr24), stet.stUL)
            stet.st = timehmampm(lastET, hr24)
            stet.elStart.dataset.starttime = stet.st

            lastETSelectAndET(stet, hr24)
        } else {
            stet.etUL.scrollTo(0, 0)
        }


    } else {
        stet.etUL.scrollTo(0, 0)

    }

    timebar(stet, hr24)
}
