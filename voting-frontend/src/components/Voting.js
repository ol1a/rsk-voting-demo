import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingABI from '../Voting.json';

const Voting = () => {
  const [candidates, setCandidates] = useState([]);
  const [voter, setVoter] = useState(null);
  const [voted, setVoted] = useState(false);

  const contractAddress = 0xbAd4c3c11B30A2626b7007fef92286576C27B3c6; 
  // Ensure window.ethereum is available
  if (!window.ethereum) {
    alert("Please install MetaMask to use this dApp!");
    return null;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(contractAddress, VotingABI.abi, signer);

  useEffect(() => {
    const loadCandidates = async () => {
      const count = await votingContract.candidatesCount();
      const candidatesArray = [];
      for (let i = 1; i <= count; i++) {
        const candidate = await votingContract.candidates(i);
        candidatesArray.push(candidate);
      }
      setCandidates(candidatesArray);
    };

    const checkVoter = async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        const voterAddress = await signer.getAddress();
        setVoter(voterAddress);
        const hasVoted = await votingContract.voters(voterAddress);
        setVoted(hasVoted);
      } catch (error) {
        console.error("User denied account access");
      }
    };

    loadCandidates();
    checkVoter();
  }, [provider, signer, votingContract]);

  const vote = async (id) => {
    try {
      await votingContract.vote(id);
      setVoted(true);
    } catch (error) {
      console.error("Error voting: ", error);
    }
  };

  return (
    <div>
      <h1>Vote for Your Favorite Smart Contract Language</h1>
      {voter && <p>Voter Address: {voter}</p>}
      {voted ? (
        <p>You have already voted.</p>
      ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.name} - {candidate.voteCount} votes
              <button onClick={() => vote(candidate.id)}>Vote</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Voting;
