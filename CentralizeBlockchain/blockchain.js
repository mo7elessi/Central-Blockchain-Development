const SHA256 = require("crypto-js/sha256");

class Transactions {
    constructor() {
        this.transactions = [];
    }
    add_transaction(input) {
        this.transactions.push(input);
    }
    calculateCount() {
        return this.transactions.length;
    }
}

class MerkleTree {
    constructor() {
        this.root = [];
    }

    createTree(transactions) {
        this.root.unshift(transactions);
        this.root.unshift(
            transactions.map(function (t) {
                return SHA256(JSON.stringify(t)).toString();
            })
        );

        while (this.root[0].length > 1) {
            let temp = [];
            for (let index = 0; index < this.root[0].length; index += 2) {
                if (index < this.root[0].length - 1 && index % 2 == 0) {
                    temp.push(
                        SHA256(this.root[0][index] + this.root[0][index + 1]).toString()
                    );
                } else {
                    temp.push(this.root[0][index]);
                }
            }
            this.root.unshift(temp);
        }
        return this.root[0];
    }
}
class Header {
    constructor(
        version,
        Difficulty,
        timestamp,
        merkle_root = 0,
        previousHash = ""
    ) {
        this.version = version;
        this.Difficulty = Difficulty;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.merkle_root = merkle_root;
        this.nonce = 0;
    }
}

class Block {
    constructor(Header, transactions, transaction_count, hight = 0) {
        this.hight = hight;
        this.Header = Header;
        this.transactions = transactions;
        this.transaction_count = transaction_count;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(
            this.hight +
            JSON.stringify(this.Header) +
            JSON.stringify(this.transactions) +
            this.transaction_count
        ).toString();
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.Header.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(new Header(1, 0, Date.now, 0), "Genesis Block", "1");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    setBlock(newBlock) {
        newBlock.hight = this.getLatestBlock().hight + 1;
        newBlock.Header.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(newBlock.Header.Difficulty);
        this.chain.push(newBlock);
    }

    blocksExplorer() {
        console.log(JSON.stringify(this.chain, null, 4));
    }
    copy(clone) {
        this.chain = clone.map((e) => e);
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
module.exports.Header = Header;
module.exports.Transactions = Transactions;
module.exports.MerkleTree = MerkleTree;