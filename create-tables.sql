-- Bitcoin Bomber OP_RETURN Explorer - Improved Database Schema
-- Three-table structure for better data organization

USE operturn_explorer;

-- Drop existing tables if they exist (be careful with this in production!)
DROP TABLE IF EXISTS op_return_data;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS blocks;
DROP VIEW IF EXISTS op_return_view;
DROP VIEW IF EXISTS op_return_transactions_view;
DROP VIEW IF EXISTS op_return_stats_view;

-- 1. BLOCKS TABLE
CREATE TABLE blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL,
    height INT UNIQUE NOT NULL,
    transaction_count INT DEFAULT 0,
    timestamp BIGINT NOT NULL,
    size INT,
    weight INT,
    merkle_root VARCHAR(64),
    difficulty DECIMAL(30,8),
    nonce BIGINT,
    version INT,
    previous_block_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    INDEX idx_height (height),
    INDEX idx_hash (hash),
    INDEX idx_timestamp (timestamp)
);

-- 2. TRANSACTIONS TABLE  
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hash VARCHAR(64) UNIQUE NOT NULL,
    block_hash VARCHAR(64) NOT NULL,
    block_height INT NOT NULL,
    fee_sats BIGINT,
    size INT,
    weight INT,
    version INT,
    locktime BIGINT,
    input_count INT,
    output_count INT,
    has_op_return BOOLEAN DEFAULT FALSE,
    confirmation_time BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key relationships
    FOREIGN KEY (block_hash) REFERENCES blocks(hash) ON DELETE CASCADE,
    FOREIGN KEY (block_height) REFERENCES blocks(height) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_hash (hash),
    INDEX idx_block_hash (block_hash),
    INDEX idx_block_height (block_height),
    INDEX idx_has_op_return (has_op_return),
    INDEX idx_fee_sats (fee_sats),
    INDEX idx_created_at (created_at)
);

-- 3. OP_RETURN_DATA TABLE
CREATE TABLE op_return_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tx_hash VARCHAR(64) NOT NULL,
    op_return_data TEXT,
    op_return_hex TEXT NOT NULL,
    fee_sats BIGINT,
    sender_address VARCHAR(100),
    data_size INT,
    data_type ENUM('text', 'hex', 'binary', 'json', 'other') DEFAULT 'hex',
    is_utf8_valid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key relationship
    FOREIGN KEY (tx_hash) REFERENCES transactions(hash) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_tx_hash (tx_hash),
    INDEX idx_fee_sats (fee_sats),
    INDEX idx_data_type (data_type),
    INDEX idx_created_at (created_at),
    
    -- Full text search index for op_return_data
    FULLTEXT INDEX idx_op_return_data (op_return_data)
);

-- Create useful views for easy querying
CREATE VIEW op_return_transactions_view AS
SELECT 
    o.id,
    o.tx_hash,
    t.block_hash,
    t.block_height,
    b.timestamp as block_timestamp,
    o.op_return_data,
    o.op_return_hex,
    o.fee_sats,
    o.sender_address,
    o.data_size,
    o.data_type,
    o.is_utf8_valid,
    t.size as tx_size,
    t.weight as tx_weight,
    o.created_at
FROM op_return_data o
JOIN transactions t ON o.tx_hash = t.hash
JOIN blocks b ON t.block_hash = b.hash
ORDER BY b.height DESC, o.created_at DESC;

-- Create a summary view for statistics
CREATE VIEW op_return_stats_view AS
SELECT 
    COUNT(*) as total_op_return_transactions,
    SUM(o.fee_sats) as total_fees_paid,
    AVG(o.fee_sats) as average_fee,
    MIN(o.fee_sats) as min_fee,
    MAX(o.fee_sats) as max_fee,
    SUM(o.data_size) as total_data_size,
    AVG(o.data_size) as average_data_size,
    COUNT(DISTINCT t.block_height) as blocks_with_op_return,
    MIN(t.block_height) as first_block,
    MAX(t.block_height) as latest_block,
    COUNT(CASE WHEN o.data_type = 'text' THEN 1 END) as text_data_count,
    COUNT(CASE WHEN o.data_type = 'hex' THEN 1 END) as hex_data_count,
    COUNT(CASE WHEN o.data_type = 'binary' THEN 1 END) as binary_data_count,
    COUNT(CASE WHEN o.data_type = 'json' THEN 1 END) as json_data_count
FROM op_return_data o
JOIN transactions t ON o.tx_hash = t.hash;

-- Insert some sample data for testing
INSERT INTO blocks (hash, height, transaction_count, timestamp, size, weight, version) VALUES 
('000000000000000004ec466ce4732fe6f1ed1cddc2ed4b328fff5224276e3f6f', 905000, 2156, 1456262400, 1048576, 4194304, 1),
('00000000000000000108a16aeaa8ba5601b7e3c3ec29a3d7a77c6e4eb6c8b4c2', 905001, 1987, 1456263000, 987654, 3950616, 1),
('00000000000000000209b27bfbb9cb6702c8f4d4fd3ab4e8b88c7f5fc7d9c5d3', 905002, 2543, 1456263600, 1234567, 4938268, 1);

INSERT INTO transactions (hash, block_hash, block_height, fee_sats, size, weight, version, input_count, output_count, has_op_return, confirmation_time) VALUES 
('7d5e3f8c9b2a1d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', '000000000000000004ec466ce4732fe6f1ed1cddc2ed4b328fff5224276e3f6f', 905000, 2500, 250, 1000, 1, 1, 2, TRUE, 1456262400),
('8e6f4a9d0c3b2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7', '00000000000000000108a16aeaa8ba5601b7e3c3ec29a3d7a77c6e4eb6c8b4c2', 905001, 1800, 320, 1280, 1, 2, 3, TRUE, 1456263000),
('9f7a5b8e1d4c7f0a3b6c9e2f5a8b1d4c7e0f3a6b9c2d5e8f1a4b7c0d3e6f92b', '00000000000000000209b27bfbb9cb6702c8f4d4fd3ab4e8b88c7f5fc7d9c5d3', 905002, 3200, 180, 720, 1, 1, 1, TRUE, 1456263600);

INSERT INTO op_return_data (tx_hash, op_return_data, op_return_hex, fee_sats, sender_address, data_size, data_type, is_utf8_valid) VALUES 
('7d5e3f8c9b2a1d4e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9', 'Hello Bitcoin World!', '48656c6c6f20426974636f696e20576f726c6421', 2500, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 20, 'text', TRUE),
('8e6f4a9d0c3b2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5b8c1d4e7', 'OP_RETURN test data', '4f505f52455455524e20746573742064617461', 1800, '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', 18, 'text', TRUE),
('9f7a5b8e1d4c7f0a3b6c9e2f5a8b1d4c7e0f3a6b9c2d5e8f1a4b7c0d3e6f92b', 'Bitcoin rocks!', '426974636f696e20726f636b7321', 3200, '1HLoD9E4SDFFPDiYfNYnkBLQ85Y51J3Zb1', 13, 'text', TRUE);

-- Display table information
SHOW TABLES;
SELECT 'BLOCKS' as TABLE_NAME, COUNT(*) as RECORD_COUNT FROM blocks
UNION ALL
SELECT 'TRANSACTIONS', COUNT(*) FROM transactions  
UNION ALL
SELECT 'OP_RETURN_DATA', COUNT(*) FROM op_return_data;

-- Display sample data from the main view
SELECT * FROM op_return_transactions_view LIMIT 5;

-- Display statistics
SELECT * FROM op_return_stats_view; 