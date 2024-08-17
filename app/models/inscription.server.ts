import type { FakeWallet, FakeInscription } from "@prisma/client";

import { prisma } from "~/db.server";

/*
type FakeWallet = {
	addressType: string,
	address: string,
	customHdPath: string,
	phrase: string,
	connectedSites: string[],
	network: string
}

type FakeInscription = {
	type: string,
	hash: string,
	data: any,
	walletAddr: string,
	gasFee: string,
	timestamp: Date
};



const FAKEWALLET: FakeWallet = {
	addressType: "Legacy (P2PKH) (m/44'/3'/0'/0/0)",
	address: "DK24VY9rop9NoHaM8iBAUTNAkVgRXuChVa",
	customHdPath: "",
	phrase: "",
	connectedSites: [],
	network: ""
};


var inscriptionLst: FakeInscription[] = [];
*/


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


/*
export function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  return prisma.note.deleteMany({
    where: { id, userId },
  });
}
*/
