function getFalafel() {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    return falafel;
}

function fryFalafel(falafel) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            const friedFalafel = "Frittierte " + falafel
            // Falls irgendeine random number zwischen 0.05 (exclusive) und 1 inklusive herauskommt,
            // wird die Promise resolved, ansonsten rejected.
            if (Math.random() > 0.05) {
                console.log(falafel + " frittiert")
                resolve(friedFalafel);
            } else {
                reject();
            }
        }, 300);
    });
}

function getWrap() {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    return wrap;
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return falafelwrap;
}

async function prepareFalafelWrap() {
    let falafel = await getFalafel();
    try {
        let wrapAndFriedFalafel = await Promise.all([getWrap(), fryFalafel(falafel)]);
        return assembleFalafelWrap(wrapAndFriedFalafel[0], wrapAndFriedFalafel[1]);
    } catch (err) {
        return err;
    }
}

async function serve() {
    let meal = await prepareFalafelWrap();
    if (meal === undefined) {
        console.log("Konnte nichts servieren, da irgendetwas schief gelaufen ist.");
    } else {
        console.log(meal + " serviert");
    }
}

serve();