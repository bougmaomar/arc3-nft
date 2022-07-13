/* eslint-disable */
import algosdk from "algosdk";

const sendAlgoSignerTransaction = async (txns, algodClient) => {
  const AlgoSigner = window.AlgoSigner;

  if (typeof AlgoSigner !== "undefined") {
    try {
      let binaryTx = txn.toByte();
      let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
      let signedTxs = await AlgoSigner.signedTxn([
        {
          txn: base64Tx,
        },
      ]);

      let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(
        signedTxs[0].blob
      );
      const resp = await algodClient.sendRawTransaction(binarySignedTx).do();

      return resp;
    } catch (err) {
      console.error(err);
    }
  }
};

export default {
  sendAlgoSignerTransaction,
};
