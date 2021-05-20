function getFalafel() {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    return Promise.resolve(falafel);
}

function fryFalafel(falafel) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            const friedFalafel = "Frittierte " + falafel
            console.log(falafel + " frittiert")
            resolve(friedFalafel);
        }, 300);
    });
}

function getWrap() {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    return Promise.resolve(wrap);
}

function assembleFalafelWrap(wrap, friedFalafel) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    return Promise.resolve(falafelwrap);
}

function prepareFalafelWrap() {
    return getFalafel()
        .then(falafel => {
            return Promise.all([getWrap(), fryFalafel(falafel)]);
        })
        .then(res => {
            return assembleFalafelWrap(res[0], res[1]);
        });
}

function serve(meal) {
    console.log(meal + " serviert")
}

prepareFalafelWrap()
    .then(meal => {
        serve(meal);
    });