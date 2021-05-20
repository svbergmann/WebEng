function getFalafel(callback) {
    const falafel = "Falafel"
    console.log(falafel + " aus dem Kühlschrank geholt")
    callback(falafel);
}

function fryFalafel(falafel, callback) {
    setTimeout(function () {
        const friedFalafel = "Frittierte " + falafel
        console.log(falafel + " frittiert")
        callback(friedFalafel);
    }, 1000);
}

function getWrap(callback) {
    const wrap = "Wrap"
    console.log(wrap + " aus dem Schrank geholt")
    callback(wrap);
}

function assembleFalafelWrap(wrap, friedFalafel, callback) {
    const falafelwrap = "Falafel-Wrap"
    console.log(friedFalafel + " in " + wrap + " gewickelt")
    callback(falafelwrap);
}

function serve(meal) {
    console.log(meal + " serviert")
}

function prepareFalafelWrap(callback) {
    getFalafel((falafel) => {
        fryFalafel(falafel, (friedFalafel) => {
            getWrap((wrap) => {
                assembleFalafelWrap(wrap, friedFalafel, (falafelWrap) => {
                    callback(falafelWrap);
                });
            });
        });
    });
}

prepareFalafelWrap(serve);
