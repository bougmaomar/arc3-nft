/* eslint-disable */
import algosdk from "algosdk";
import { getAlgodClient } from "./client.js";
import wallets from "./wallets.js";
import { convertByte32ToIpfsCidV0 } from "../scripts/helpers/ipfs2bytes32.js";

const purchaseNFT = async (creator, receiver, nftId, fungibleTokenId) => {
  const receiverInfo = await getAccountInfo(receiver, this.network);
  const optedInAsset = receiverInfo.assets.fine((asset) => {
    return asset["asset-id"] === nftId;
  });

  let optedIn = false;
  if (optedInAsset === undefined) {
    const optInResponse = await assetOptIn(receiver, nftId, this.network);
    if (optInResponse.txId !== undefiend) {
      optedIn = true;
    }
  } else {
    optedIn = true;
  }

  await transferAsset(creator, receiver, nftId, fungibleTokenId, this.network);
};

const transferAsset = async (creator, receiver, nftId, fungibleTokenId) => {
  const algodClient = getAlgodClient(network);

  const sugParams = await algodClient.getTransactionParams().do();

  let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    creator,
    receiver,
    undefined,
    undefined,
    1,
    undefined,
    nftId,
    sugParams
  );

  return await wallets.sendAlgoSignerTransaction(txn, algodClient);
};

const assetOptIn = async (receiver, nftId, network) => {
  const algodClient = getAlgodClient(network);

  const sugParams = await algodClient.getTransactionParams().do();

  let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
    receiver,
    receiver,
    undefined,
    undefined,
    1,
    undefined,
    nftId,
    sugParams
  );

  return await wallets.sendAlgoSignerTransaction(txn, algodClient);
};

const getAccountInfo = async (address, network) => {
  const algodClient = getAlgodClient(network);

  return await algodClient.accountInformation(address).do();
};

const checkMetadataHash = (uint8ArrHash, assetURL) => {
  // convert uint8array to hex string
  let metadataHash = Buffer.from(uint8ArrHash).toString("hex");

  // get IPFS cid of json metadata
  const cid = convertByte32ToIpfsCidV0(metadataHash);

  // check if cid from assetURL is the same as cid extracted from metadata hash
  let cid_from_assetURL = assetURL.replace("ipfs://", "");
  cid_from_assetURL = cid_from_assetURL.replace("#arc3", "");

  return cid_from_assetURL === cid;
};

export default {
  purchaseNFT,
  checkMetadataHash,
  getAccountInfo,
};
