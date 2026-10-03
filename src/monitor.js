/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length == 0) {
        ns.tprint("missing target args");
        ns.exit();
    }
    const targets = ns.args;
    let serversMoney = [];
    let serversSecurity = [];
    let serversMoneyTrend = [];
    let serversSecurityTrend = [];
    const trendLen = 20;
    for (let target of ns.args) {
        serversMoney.push([]);
        serversSecurity.push([]);
        serversMoneyTrend.push([]);
        serversSecurityTrend.push([]);
    }

    for (let cmd of [
            "getServerMoneyAvailable",
            "getServerSecurityLevel",
            "getServerMaxMoney",
            "getServerMinSecurityLevel",
            "sleep",
        ]) {
        ns.disableLog(cmd);
    }

    while (true) {
        ns.print("----------------------------------------------");
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < targets.length; j++) {
                let target = targets[j];
                serversMoney[j][i] = ns.getServerMoneyAvailable(target);
                serversSecurity[j][i] = ns.getServerSecurityLevel(target);
            }
            await ns.sleep(100);
        }
        let notify = [];
        for (let j = 0; j < targets.length; j++) {
            let target = targets[j];
            let serverMaxMoney = ns.getServerMaxMoney(target)
            let currMoneyAvg = average(serversMoney[j]).toFixed(0);
            let serverMinSecurity = ns.getServerMinSecurityLevel(target);
            let currSecurityAvg = average(serversSecurity[j]).toFixed(3);

            ns.print(`
            ${target}
            Absolute money difference: ${serverMaxMoney}, ${currMoneyAvg}
            Money difference: ${serverMaxMoney - currMoneyAvg} (${((serverMaxMoney - currMoneyAvg)/serverMaxMoney*100).toFixed(2)}%)
            Absolute security difference: ${currSecurityAvg}, ${serverMinSecurity}
            Server security difference: ${(currSecurityAvg - serverMinSecurity).toFixed(3)}`);
            
            // if (serversMoneyTrend[0].length == trendLen) {
            //     serversMoneyTrend.shift(0);
            //     serversMoneyTrend.push(currMoneyAvg);
            //     if (serversMoneyTrend[0] < serversMoneyTrend[1])

            //     serversSecurityTrend.shift(0);
            //     serversSecurityTrend.push(currSecurityAvg);

            // }
        }
    }
}

function average(array) {
    return array.reduce((a,b) => a+b) / array.length;
}