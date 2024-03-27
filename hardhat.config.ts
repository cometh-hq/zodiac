import "@nomicfoundation/hardhat-toolbox";

import dotenv from "dotenv";
import yargs from "yargs";

import type { HttpNetworkUserConfig } from "hardhat/types";
import "hardhat-change-network";

const { network } = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false)
  .parseSync();

// Load environment variables.
dotenv.config();
const { INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PK, ALCHEMY_KEY } =
  process.env;

import "./tasks/singleton-deployment";
import "./tasks/deploy-replay";

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

const sharedNetworkConfig: HttpNetworkUserConfig = {};
if (PK) {
  sharedNetworkConfig.accounts = [PK];
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  };
}

if (
  ["mainnet", "goerli", "sepolia", "ropsten"].includes(network) &&
  INFURA_KEY === undefined
) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${network}`
  );
}

export default {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    deploy: "src/deploy",
    sources: "contracts",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000,
          },
        },
      },
      { version: "0.6.12" },
    ],
  },
  networks: {
    custom: {
      ...sharedNetworkConfig,
      url: process.env.RPC_URL || "",
    },

    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    gnosis: {
      ...sharedNetworkConfig,
      url: "https://rpc.gnosischain.com",
    },
    goerli: {
      ...sharedNetworkConfig,
      url: `https://goerli.infura.io/v3/${INFURA_KEY}`,
    },
    sepolia: {
      ...sharedNetworkConfig,
      url: `https://sepolia.infura.io/v3/${INFURA_KEY}`,
    },
    arbitrum: {
      ...sharedNetworkConfig,
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    optimism: {
      ...sharedNetworkConfig,
      url: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    polygon: {
      ...sharedNetworkConfig,
      url: "https://rpc.ankr.com/polygon",
    },
    mumbai: {
      ...sharedNetworkConfig,
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    amoy: {
      ...sharedNetworkConfig,
      url: `https://polygon-amoy.infura.io/v3/2e1346349a5d4a24aeba9dee6c7b20b5`,
      gasPrice: 30000000000,
    },
    XL: {
      ...sharedNetworkConfig,
      url: `http://90.120.6.91:9650/ext/bc/2HN8vrS7vKPxw2hMAkXyhKqxQurfyBaVukCWuR442q3YimaeHQ/rpc`,
    },
    avalanche: {
      ...sharedNetworkConfig,
      url: `https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    bsc: {
      ...sharedNetworkConfig,
      url: "https://bsc-dataseed.binance.org",
    },
    lineaGoerli: {
      ...sharedNetworkConfig,
      url: `https://linea-goerli.infura.io/v3/${INFURA_KEY}`,
    },
    arbitrum_sepolia: {
      ...sharedNetworkConfig,
      url: "https://arbitrum-sepolia.infura.io/v3/" + process.env.INFURA_KEY,
    },
    base_sepolia: {
      ...sharedNetworkConfig,
      url: "https://base-sepolia.g.alchemy.com/v2/" + process.env.INFURA_KEY,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
