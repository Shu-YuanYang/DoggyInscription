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


export function getFakeWallet({ address }: Pick<FakeWallet, "address">) {
	return FAKEWALLET;
}

export function getFakeInscription({ hash }: Pick<FakeInscription, "hash">) {
	for (let i = 0; i < inscriptionLst.length; ++i) {
		if (inscriptionLst[i].hash === hash) return inscriptionLst[i];
	}
	throw new Error(`No inscription found with hash: ${hash}`);
}

export function getAllFakeInscriptionList() {
	inscriptionLst.sort(function(a, b) { return b.timestamp - a.timestamp });
	return inscriptionLst;
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
	let newInscription: FakeInscription = {
		type: type,
		data: data,
		hash: makeid(105),
		walletAddr: walletAddr,
		gasFee: gasFee,
		timestamp: new Date()
	};
	inscriptionLst.push(newInscription);
	return newInscription;
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
