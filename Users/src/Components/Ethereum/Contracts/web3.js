import Web3 from "web3";
import HealthSystem from "./HealthSystem.json";


const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
const web3 = new Web3(provider);

async function setupContract() {
    const web3 = new Web3(provider);
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = HealthSystem.networks[networkId];
    const contract = new web3.eth.Contract(
    HealthSystem.abi,
    deployedNetwork && deployedNetwork.address
    )
    return contract;
}
export{web3, setupContract};  