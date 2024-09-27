const envSev = process.env["osltl_sev"] || 0

function log(message, sev){
    if(sev <= envSev){
        console.log(message);
    }
}

function logDebug(message){
    log(message, 1);
}

function logProd(message){
    log(message, 2);
}

module.exports = {
    log,
    logDebug,
    logProd
}