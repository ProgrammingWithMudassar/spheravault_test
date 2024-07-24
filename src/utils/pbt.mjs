import { execHaloCmdWeb } from "@arx-research/libhalo/api/web.js";
import Web3 from "web3";

const generateSignature = async (messageHash) => {
  const signature = (
    await execHaloCmdWeb({
      name: "sign",
      message: messageHash,
      keyNo: 1,
    })
  ).signature.ether;
  alert(signature);
  return signature;
};

const imitateSignature = async (messageHash) => {
  var web3Provider = new Web3.providers.HttpProvider(
    "https://testnet.hashio.io/api"
  );
  const web3Instance = new Web3(web3Provider);
  const signer = web3Instance.eth.accounts.sign(
    messageHash,
    "0x865aba28f210f192e60bca223b3467e6a59f842da17f1ebfadb4787f611542d0"
  );

  alert(signer.signature);
  
  const signature = signer.signature;

  // Call API here
  const response = await fetch("https://back.spheramarket.io/user/update-signature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messageHash: messageHash,
      signature: signature,
    }),
  });

  console.log("response",response);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API call failed: ${error}`);
  }

  const responseData = await response.json();
  alert(`API call successful: ${JSON.stringify(responseData)}`);
  return signature;
};

export { generateSignature, imitateSignature };
