/* ******************************************************************************
// ^OBJECT
 *******************************************************************************/

// It will return true for undefined objects
function isObjectEmpty(value) {
    return (
        Object.prototype.toString.call(value) === '[object Object]' &&
        JSON.stringify(value) === '{}'
    );
}


/* ******************************************************************************
// ^DATE
 *******************************************************************************/

const now = () => new Date()


function dmy(dt) {
    let dt2 = new Date(dt);
    return {
        d: dt2.getDate(),
        m: dt2.getMonth(),
        y: dt2.getFullYear()
    }
}

function dmyhm(dt) {
    let dt2 = new Date(dt);
    return {
        d: dt2.getDate(),
        m: dt2.getMonth(),
        y: dt2.getFullYear(),
        hr: dt2.getHours(),
        min: dt2.getMinutes()
    }
}


// take 2 long integer date values and see if they are the same day, local time
function dateSame(dt1, dt2) {
    let date1 = dmy(dt1)
    let date2 = dmy(dt2)

    return date1.d === date2.d && date1.m === date2.m && date1.y === date2.y
}


// d1 - d2
function dayDiff(dt1, dt2) {
    const ONE_DAY = 86400000 // 1000 * 60 * 60 * 24
    let {
        d: d1,
        m: m1,
        y: y1
    } = dmy(dt1)
    let {
        d: d2,
        m: m2,
        y: y2
    } = dmy(dt2)

    let diffMs = new Date(y1, m1, d1, 12, 0, 0, 0) - new Date(y2, m2, d2, 12, 0, 0, 0)

    return Math.floor(diffMs / ONE_DAY)
}


// Go forward or back x days
function dateChangeDays(dt, days) {
    let d = new Date(dt);
    return new Date(d.setDate(d.getDate() + days));
}


// Assumes all dates in 2000 to 2099
function dateToDMYY(dt, seperator = "/") {
    let da = new Date(dt)

    let d = da.getDate() < 10 ? da.getDate() : da.getDate()
    let m = da.getMonth() < 9 ? Number(da.getMonth() + 1) : Number(da.getMonth() + 1)
    let y = String(da.getFullYear()).replace("20", "")
    return d + seperator + m + seperator + y
}




/* ******************************************************************************
// ^FORMS
 *******************************************************************************/

function requiredMsg(msg, overallmsg) {
    return overallmsg = overallmsg === '' ? msg : overallmsg + "\n" + msg
}



/* ******************************************************************************
// ^TIME
 *******************************************************************************/


// Given a time in "hh:mm AM/PM" or "hh:mm"
// format, it returns an object with h and m
// midnightStart true means "00:00" is 0, false, it's 24
function timeHourMin(time, hr24, midnightStart) {
    let h, m

    if (hr24) {
        if (midnightStart || typeof midnightStart === "undefined") {
            h = Number(time.slice(0, 2))
        } else {
            h = Number(time.slice(0, 2))
            if (h === 0) h = 24
        }
        m = Number(time.slice(3, 5))
    } else {
        if (midnightStart || typeof midnightStart === "undefined") {
            h = Number(time.slice(0, 2))
        } else {
            h = Number(time.slice(0, 2))
            if (h === 0) h = 24
        }
        m = Number(time.slice(3, 5))
        ampm = time.slice(6, 8)

        if (ampm === "PM" && h !== 12) {
            h += 12
        }
    }

    return {
        h,
        m
    }
}

// Epoch time to hh:mm AM/PM
// hr24 boolean - 24 hour time
function timehmampm(dt, hr24) {
    let {
        hr,
        min
    } = dmyhm(dt)

    if (hr24) {
        return ((hr < 10) ? "0" + hr : hr) + ":" + ((min < 10) ? "0" + min : min)
    } else {
        if (hr < 10) {
            return "0" + hr + ":" + ((min < 10) ? "0" + min : min) + " AM"
        } else if (hr < 12) {
            return hr + ":" + ((min < 10) ? "0" + min : min) + " AM"
        } else if (hr === 12) {
            return hr + ":" + ((min < 10) ? "0" + min : min) + " PM"
        } else if (hr < 22) {
            return "0" + (hr - 12) + ":" + ((min < 10) ? "0" + min : min) + " PM"
        } else {
            return (hr - 12) + ":" + ((min < 10) ? "0" + min : min) + " PM"
        }
    }
}


// Make a decimal for how far through the day
// a time is
// midnightStart means "00:00" is the start of the day
// if false, "00:00" is 24:00
function timeDecimal(time, hr24, midnightStart) {
    let h, m

    if (hr24) {
        if (midnightStart) {
            h = Number(time.slice(0, 2))
        } else {
            h = Number(time.slice(0, 2))
            if (h === 0) h = 24
        }
        m = Number(time.slice(3, 5))
    } else {
        if (midnightStart) {
            h = Number(time.slice(0, 2))
        } else {
            h = Number(time.slice(0, 2))
            if (h === 0) h = 24
        }
        m = Number(time.slice(3, 5))
        ampm = time.slice(6, 8)

        if (ampm === "PM" && h !== 12) {
            h += 12
        }
    }


    let min = m / 60
    let result = (h + min) / 24

    return result
}



function hoursDiff(dt1, dt2) {
    const HOUR = 1000 * 60 * 60;
    return Math.floor((dt1 - dt2) / HOUR)
}


/* ==========================================================================
   # LIST
   ========================================================================== */


// selectclass is the class that is used to show
// that the item is selected
// if nothing is selected, it returns -1
function listFindSelected(parentUL, selectclass) {
    return [].findIndex.call(parentUL.childNodes, (cv) => {
        if (cv.classList) {
            if (cv.classList.contains(selectclass)) {
                return true
            }
        } else {
            return false
        }
    })
}

// Unselects the first item that's selected
// Works for single select lists
function listUnselect(parentUL, selectclass) {
    let i = listFindSelected(parentUL, selectclass)
    if (i !== -1) parentUL.childNodes[i].classList.remove(selectclass)
    parentUL.scrollTo(0, 0)
}


// Toggle on and off when an item in a list is selected
// The list is a single select list
// Usage: elSTUL.addEventListener("click", onListClick)
function onListClick(e) {
    const selectedPreviously = listFindSelected(e.target.parentNode, SC)
    const selectedPreviouslyText = (selectedPreviously === -1) ? '' : e.target.parentNode.childNodes[selectedPreviously].textContent
    const selectedNowText = e.target.textContent

    // const sameField = previousField === e.target.parentNode
    const sameField = true

    if (selectedPreviously !== -1) {
        if (selectedPreviouslyText === selectedNowText) {
            if (sameField) e.target.classList.remove(SC)
        } else {
            e.target.parentNode.childNodes[selectedPreviously].classList.remove(SC)
            e.target.classList.add(SC)
        }
    } else {
        e.target.classList.add(SC)
    }
}
