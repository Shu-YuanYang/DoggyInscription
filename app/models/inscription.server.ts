import type { FakeWallet, FakeInscription } from "@prisma/client";

import { prisma } from "~/db.server";


export function getFakeWallet({ address }: Pick<FakeWallet, "address">) {
	return prisma.fakeWallet.findUnique({ where: { address } });
}

export function getFakeInscription({ hash }: Pick<FakeInscription, "hash">) {
	return prisma.fakeInscription.findUnique({ where: { hash } });
}

export function getAllFakeInscriptionList() {
	return prisma.fakeInscription.findMany({
		where: { },
		orderBy: { timestamp: "desc" },
	});
}



// Code copied from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function createFakeInscription({
  type,
  data,
  walletAddr,
  gasFee
}: Pick<FakeInscription, "type" | "data" | "walletAddr" | "gasFee">) {
	return prisma.fakeInscription.create({
		data: {
			type: type,
			data: data,
			hash: makeid(105),
			walletAddr: walletAddr,
			gasFee: gasFee,
			timestamp: new Date()
		},
	});
}


