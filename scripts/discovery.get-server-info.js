/** @param {NS} ns */
export async function main(ns) {
	let target = ns.args[0] || 'n00dles';
	ns.print(ns.getServer(target));
	ns.print(ns.hackAnalyzeChance(target));
}