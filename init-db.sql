-- Bitcoin Bomber OP_RETURN Explorer Database Schema
-- Run this script on your MySQL server to create the database and tables

CREATE DATABASE IF NOT EXISTS opreturn_explorer;
USE opreturn_explorer;

-- Blocks table
CREATE TABLE IF NOT EXISTS blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    height INT UNIQUE NOT NULL,
    hash VARCHAR(64) NOT NULL,
    timestamp BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_height (height),
    INDEX idx_hash (hash),
    INDEX idx_timestamp (timestamp)
);

-- OP_RETURN transactions table
CREATE TABLE IF NOT EXISTS op_return_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_height INT NOT NULL,
    txid VARCHAR(64) NOT NULL,
    op_return_data TEXT,
    op_return_hex TEXT,
    fee_sats BIGINT,
    sender_address VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (block_height) REFERENCES blocks(height),
    INDEX idx_block_height (block_height),
    INDEX idx_txid (txid),
    INDEX idx_created_at (created_at),
    INDEX idx_fee_sats (fee_sats)
);

-- Create a view for easy querying
CREATE OR REPLACE VIEW op_return_view AS
SELECT 
    t.id,
    t.block_height,
    b.hash as block_hash,
    b.timestamp as block_timestamp,
    t.txid,
    t.op_return_data,
    t.op_return_hex,
    t.fee_sats,
    t.sender_address,
    t.created_at
FROM op_return_transactions t
JOIN blocks b ON t.block_height = b.height
ORDER BY t.block_height DESC, t.created_at DESC;

-- Insert some sample data for testing (optional)
-- You can remove this section if you want to start with a clean database

INSERT IGNORE INTO blocks (height, hash, timestamp) VALUES 
(400000, '000000000000000004ec466ce4732fe6f1ed1cddc2ed4b328fff5224276e3f6f', 1456262400),
(400001, '00000000000000000108a16aeaa8ba5601b7e3c3ec29a3d7a77c6e4eb6c8b4c2', 1456263000),
(400002, '00000000000000000209b27bfbb9cb6702c8f4d4fd3ab4e8b88c7f5fc7d9c5d3', 1456263600);

INSERT IGNORE INTO op_return_transactions (block_height, txid, op_return_data, op_return_hex, fee_sats, sender_address) VALUES 
(400000, '7d5e3f8c9b2a1d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', 'Hello Bitcoin World!', '48656c6c6f20426974636f696e20576f726c6421', 2500, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'),
(400001, '8e6f4a9d0c3b2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7', 'OP_RETURN test data', '4f505f52455455524e20746573742064617461', 1800, '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'),
(400002, '9f7a5b8e1d4c7f0a3b6c9e2f5a8b1d4c7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5', 'Bitcoin rocks!', '426974636f696e20726f636b7321', 3200, '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1');

SHOW TABLES;
SELECT COUNT(*) as total_blocks FROM blocks;
SELECT COUNT(*) as total_op_return_txs FROM op_return_transactions; 