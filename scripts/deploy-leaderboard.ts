import hre from 'hardhat'
const { ethers } = hre

async function main() {
  const signers = await ethers.getSigners()
  if (signers.length === 0) {
    throw new Error('No signers available. Check PRIVATE_KEY in .env.local')
  }
  const deployer = signers[0]

  console.log('Deploying Leaderboard...')
  console.log('Deployer:', deployer.address)

  const Leaderboard = await ethers.getContractFactory('Leaderboard')
  const leaderboard = await Leaderboard.deploy()
  await leaderboard.waitForDeployment()

  const address = await leaderboard.getAddress()
  console.log('Deployed to:', address)

  console.log('Done!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
