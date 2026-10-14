/** @param {NS} ns */
/*
Deploys hack/weaken/grow threads in batches so that executions are within 20 ms
Calls prep.js to prepare the target
Creates bhack.js 
*/

const PREP_SCRIPT = "/batch/prep.js";
const MONITOR_SCRIPT = "/batch/bmonitor.js"
const GROW_SCRIPT = "/batch/bgrow.js"
const HACK_SCRIPT = "/batch/bhack.js"
const WEAKEN_SCRIPT = "/batch/bweaken.js"
const HACK_THREADS = 50;
const WEAKEN_THREADS = 2;
const GROW_THREADS = 25
const DELAY = 5;
const HOME = "home";
// const MAX_BATCHES = 50;

export async function main(ns) {
    const HOME_RAM = ns.getServerMaxRam()
                    - ns.getServerUsedRam() 
                    - ns.getScriptRam(MONITOR_SCRIPT) 
                    - ns.getScriptRam(PREP_SCRIPT);

    const BATCH_RAM = ns.getScriptRam(HACK_SCRIPT) * HACK_THREADS
                    + ns.getScriptRam(GROW_SCRIPT) * GROW_THREADS
                    + 2 * ns.getScriptRam(WEAKEN_SCRIPT) * WEAKEN_THREADS;

    if (ns.args.length != 1) {
        ns.tprint("Usage: run batch.js <target>");
        ns.exit();
    }
    const target = ns.args[0];

    // check if target is prepped, if not run a prep script and wait for success
    if (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target)
            || ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
        ns.tprint("Target needs to be prepped, running prep script");
        const prepPort = ns.getPortHandle(ns.pid);
        prepPort.clear();
        ns.exec(PREP_SCRIPT, HOME, 1, target, HOME, ns.pid);
        await prepPort.nextWrite();
        const success = prepPort.read();
        if (success != "true") {
            ns.tprint(`Prep failed, received response ${success}`);
            ns.exit();
        } else {
            ns.tprint(`Finished prep script`);
        }
    }

    ns.tprint(`${target} is at min security and max money`);

    const monitorPortNum = ns.exec(MONITOR_SCRIPT, HOME, 1, target, /*MAX_BATCHES*/);

    const hackTime = ns.getHackTime(target);
    const weakenTime = 4*hackTime;
    const growTime = 3.2*hackTime;

    let endTime = Date.now() + weakenTime + 20;
    const firstResponseTime = endTime;

    // const maxMoney = ns.getServerMaxMoney(target)
    // const stolenMoneyPercentage = 50*ns.hackAnalyze(target); 
    // const stolenMoney = stolenMoneyPercentage * maxMoney; // percentage of money we want to steal per batch
    // const remaining = maxMoney - stolenMoney;
    // const mult = maxMoney / remaining;

    const hackSec = ns.hackAnalyzeSecurity(HACK_THREADS, target);
    const growSec = ns.growthAnalyzeSecurity(GROW_THREADS, target);
    const weakenSec = ns.weakenAnalyze(WEAKEN_THREADS);
    ns.tprint(`Hack analyze: ${hackSec}; grow analyze: ${growSec}, weaken analyze: ${weakenSec}`);

    let n = 1;
    // ns.tprint(`Executing ${MAX_BATCHES} batches`);
    let isFirstBatchDone = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (HOME_RAM - ns.getServerUsedRam() > BATCH_RAM) {
            ns.print(`Launching batch ${n}`);
            ns.exec(HACK_SCRIPT,    HOME, HACK_THREADS,     target, endTime,            hackTime,   monitorPortNum, n);
            ns.exec(WEAKEN_SCRIPT,  HOME, WEAKEN_THREADS,   target, endTime + DELAY,    weakenTime, monitorPortNum, n);
            ns.exec(GROW_SCRIPT,    HOME, GROW_THREADS,     target, endTime + DELAY*2,  growTime,   monitorPortNum, n);
            ns.exec(WEAKEN_SCRIPT,  HOME, WEAKEN_THREADS,   target, endTime + DELAY*3,  weakenTime, monitorPortNum, n, true);
            endTime += 50;
            n++;
        } else {
            if (!isFirstBatchDone) {
                isFirstBatchDone = true;
                ns.tprint(`Expecting first response in ${(firstResponseTime - Date.now())/1000} sec`);
                ns.sleep(Math.floor((firstResponseTime - Date.now())/1000));
                endTime += Math.floor((firstResponseTime - Date.now())/1000);
            } else {
                ns.print(`Ram full, sleeping 0.2 sec`);
                ns.sleep(200);
                endTime += 200;
            }
        }
    }
}