import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingABI from '../Voting.json';

const contractAddress = "0xbAd4c3c11B30A2626b7007fef92286576C27B3c6";
let provider;
let votingContract;
let signer;

const Voting = () => {
  const [candidates, setCandidates] = useState([]);
  const [voter, setVoter] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const loadCandidates = async () => {
      // Ensure window.ethereum is available
      if (!window.ethereum) {
        alert("Please install MetaMask to use this dApp!");
        return null;
      }
      provider = new ethers.BrowserProvider(window.ethereum)
      signer = await provider.getSigner();
      votingContract = new ethers.Contract(contractAddress, VotingABI.abi, signer);
      
      const candidatesCount = await votingContract.candidatesCount();
      const candidatePromises = [];

      for (let i = 1; i <= candidatesCount; i++) {
        candidatePromises.push(votingContract.candidates(i));
      }

      const candidatesArray = await Promise.all(candidatePromises);
      setCandidates(candidatesArray);
    };

    loadCandidates();
  }, [])

  useEffect(() => {
    const setVoterInfo = async () => {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      votingContract = new ethers.Contract(contractAddress, VotingABI.abi, signer);
      setVoted(await votingContract.voters(signer.getAddress()))
      setVoter(signer.getAddress());
    };

    setVoterInfo();
  }, [])

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
        {voted ? (
          <p>You have already voted.</p>
        ) : (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.name} - {candidate.voteCount.toString()} votes <a style={{ marginLeft: '.5rem' }}/>
              <button onClick={() => vote(candidate.id)}>Vote</button>
            </li>
          ))}
        </ul>
        )}
    </div>
  );
};

export default Voting;
