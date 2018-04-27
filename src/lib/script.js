//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.ProposeTrade} tx
 * @transaction
 */
async function onProposeTrade(tx) {

    // change the movement status of the Token
    tx.Token.movementStatus = 'IN_TRANSIT';
  
    if (tx.price <= 0) {
      throw new Error("Invalid price");
    }
  
    // set the proposed price
    tx.Token.proposedPrice = tx.price;
  
    // get tokens registry
    const ar = await getAssetRegistry('org.sample.Token');
  
    // update the Token in the registry
    await ar.update(tx.Token)
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.createVote} tx
   * @transaction
   */
  async function createVote(tx) {
  
    // change the movement status of the Token
    tx.props.movementStatus = 'IN_TRANSIT';
  
    // get tokens registry
    const ar = await getAssetRegistry('org.sample.Proposal');
  
    // update the Token in the registry
    await ar.update(tx.props)
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.AcceptTrade} tx
   * @transaction
   */
  async function onAcceptTrade(tx) {
  
    // get investors registry
    const fr = await getParticipantRegistry('org.sample.Investor');
    const orgs = await getParticipantRegistry('org.sample.Organisation');
  
    //const orgs = await getParticipantRegistry('org.sample.Organisation');
  
    //const thatOrg = await orgs.get(orgs.getParticipantRegistry(tx.absoluteOwner).getIdentifier());
  
    // find the proper Investor in the registry
    const investor = await fr.get(getCurrentParticipant().getIdentifier());
  
    // find the Token's owner
    const absoluteOwner = await orgs.get(tx.Token.absoluteOwner.getIdentifier());
  
    if (investor.balance < tx.Token.proposedPrice) {
      throw new Error("Not enough money on your balance");
    }
  
    // reduce the Investor's balance
    investor.balance -= tx.Token.proposedPrice;
    // add money to owner's balance
    absoluteOwner.balance += tx.Token.proposedPrice;
    // change the Token's status
    tx.Token.movementStatus = 'IN_FIELD';
    // change the Token's owner
    tx.Token.holder = investor;
    // // zero the proposed price
    // tx.Token.proposedPrice = 0.0;
  
    // update Investor in the registry
    await fr.update(investor);
    await orgs.update(absoluteOwner);
    // update old owner in the registry
    //await fr.update(absoluteOwner);
  
    // get tokens registry
    const ar = await getAssetRegistry('org.sample.Token');
    // update the Token in the registry
    await ar.update(tx.Token);
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.TryVote} tx
   * @transaction
   */
  async function TryVote(tx) {
    throw new Error(tx.props.proposalId);
    if(tx.voice){
      tx.props.VoteRes += 1.0;
    }
    else{
      tx.props.VoteRes -= 1.0;
    }
    const proposerCollection = await getAssetRegistry("org.sample.Proposal");
    const absProp = await proposerCollection.get(tx.props.proposalId.getIdentifier());
  
    await proposerCollection.update(absProp);
  }
  
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.CancelTrade} tx
   * @transaction
   */
  async function onCancelTrade(tx) {
  
    // change the Token's status
    tx.Token.movementStatus = 'IN_FIELD';
    // zero the proposed price
    tx.Token.proposedPrice = 0.0;
  
    const ar = await getAssetRegistry('org.sample.Token');
    // update the Token in the registry
    await ar.update(tx.Token);
  }
  
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.SetupDemo} setupDemo
   * @transaction
   */
  async function setupDemo(setupDemo) {
  
    const factory = getFactory();
    const NS = 'org.sample';
  
    // get registries
    const farmerRegistry = await getParticipantRegistry(NS + '.Investor');
    const animalRegistry = await getAssetRegistry(NS + '.Token');
  
    // create investors
    var investors = [
      factory.newResource(NS, 'Investor', 'investor@village.com')
    ];
  
    // create tokens
    var tokens = [
      factory.newResource(NS, 'Token', 'token1'),
      factory.newResource(NS, 'Token', 'token2')
    ];
  
    // fill investors with basic info
    investors[0].firstName = 'Bartholomew';
    investors[0].lastName = 'Carley';
    investors[0].balance = 100.0;
  
    investors[1].firstName = 'Chadwick';
    investors[1].lastName = 'Cherokee';
    investors[1].balance = 100.0;
  
    investors[2].firstName = 'Franklin';
    investors[2].lastName = 'Harcourt';
    investors[2].balance = 100.0;
  
    // write investors to the registry
    await farmerRegistry.addAll(investors);
  
    // fill tokens with basic info
    tokens[0].species = 'SHEEP';
    tokens[0].name = 'Molly';
    tokens[0].colour = 'White';
    tokens[0].movementStatus = 'IN_FIELD';
    tokens[0].productionType = 'MEAT';
    tokens[0].owner = factory.newRelationship(NS, 'Investor', investors[0].email);
  
    tokens[1].species = 'CATTLE';
    tokens[1].name = 'Dolly';
    tokens[1].colour = 'Black';
    tokens[1].movementStatus = 'IN_FIELD';
    tokens[1].productionType = 'WOOL';
    tokens[1].owner = factory.newRelationship(NS, 'Investor', investors[1].email);
  
    // write tokens to the registry
    await animalRegistry.addAll(tokens);
  }