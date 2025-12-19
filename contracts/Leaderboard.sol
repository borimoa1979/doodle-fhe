// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Anonymous leaderboard for Doodle Jump scores
// Scores are encrypted via relayer and stored as bytes32 handles
// Only encrypted scores stored, no plaintext scores visible
contract Leaderboard {
    struct ScoreEntry {
        address player;
        bytes32 encryptedScore; // Encrypted score handle (bytes32 for euint16)
        uint256 timestamp;
    }

    ScoreEntry[] public scores;
    mapping(address => bool) public hasSubmitted;
    mapping(address => bytes32) public playerBestScore; // Player's best encrypted score

    event ScoreSubmitted(
        address indexed player,
        uint256 timestamp
    );

    // Submit encrypted score
    // Frontend encrypts score using relayer, sends encrypted handle + attestation
    // Contract stores encrypted score handle
    function submitScore(
        bytes32 encryptedScore,
        bytes calldata /* attestation */
    ) external {
        require(encryptedScore != bytes32(0), "Invalid encrypted score");
        
        // Store score entry
        scores.push(ScoreEntry({
            player: msg.sender,
            encryptedScore: encryptedScore,
            timestamp: block.timestamp
        }));

        // Update player's best score if this is better (comparison done off-chain)
        // For now, just store the latest
        playerBestScore[msg.sender] = encryptedScore;
        hasSubmitted[msg.sender] = true;

        emit ScoreSubmitted(msg.sender, block.timestamp);
    }

    // Get total number of scores
    function getScoreCount() external view returns (uint256) {
        return scores.length;
    }

    // Get encrypted score by index
    function getEncryptedScore(uint256 index) external view returns (
        address player,
        bytes32 encryptedScore,
        uint256 timestamp
    ) {
        require(index < scores.length, "Index out of bounds");
        ScoreEntry memory entry = scores[index];
        return (entry.player, entry.encryptedScore, entry.timestamp);
    }

    // Get player's best encrypted score
    function getPlayerBestScore(address player) external view returns (bytes32) {
        return playerBestScore[player];
    }

    // Check if player has submitted
    function hasPlayerSubmitted(address player) external view returns (bool) {
        return hasSubmitted[player];
    }

    // Get recent scores (last N entries)
    function getRecentScores(uint256 count) external view returns (
        address[] memory players,
        bytes32[] memory encryptedScores,
        uint256[] memory timestamps
    ) {
        uint256 length = scores.length;
        if (count > length) {
            count = length;
        }

        uint256 start = length - count;
        players = new address[](count);
        encryptedScores = new bytes32[](count);
        timestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            ScoreEntry memory entry = scores[start + i];
            players[i] = entry.player;
            encryptedScores[i] = entry.encryptedScore;
            timestamps[i] = entry.timestamp;
        }
    }
}

