//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.ProposeTrade} tx
 * @transaction
 */
async function onProposeTrade(tx) {

   const ar = await getAssetRegistry('org.sample.Token');
   const orgs = await getParticipantRegistry('org.sample.Organisation');
   const thatOrg = await orgs.get(tx.orgId);
   var factory = await getFactory();
   var newToken = await factory.newResource('org.sample', 'Token', tx.tokenId);
    // change the movement status of the Token
    newToken.movementStatus = 'IN_TRANSIT';
  
    if (tx.price <= 0) {
      throw new Error("Invalid price");
    }
    newToken.name = tx.tokenName;
    newToken.movementStatus = tx.movementStatus;
    newToken.absoluteOwner = thatOrg;
    // set the proposed price
    newToken.proposedPrice = tx.price;
  
    // get tokens registry
    //const ar = await getAssetRegistry('org.sample.Token');
  
    // update the Token in the registry
    await ar.add(newToken)
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.createVote} tx
   * @transaction
   */
  async function createVote(tx) {
    const orgs = await getParticipantRegistry('org.sample.Organisation');
    const thatOrg = await orgs.get(tx.orgId);
    
    const ar = await getAssetRegistry('org.sample.Proposal');
    var factory = await getFactory();
    var newProp = await factory.newResource('org.sample', 'Proposal', tx.id);
  
    // change the movement status of the Token
    
    // get tokens registry
  
    newProp.description = tx.description
    newProp.voteFinalRes = tx.voteFinalRes
    newProp.VoteRes = tx.VoteRes
    newProp.quantity = tx.quantity;
    newProp.absoluteOwner = thatOrg;
    newProp.movementStatus = 'IN_TRANSIT';
    await ar.add(newProp);
    // update the Token in the registry
    //await ar.update(tx.props)
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
    const tokens = await getAssetRegistry('org.sample.Token');
    const thisToken = await tokens.get(tx.tokenId);
    const investor = await fr.get(tx.investorId);

    // find the Token's owner
    const absoluteOwner = await orgs.get(thisToken.absoluteOwner.getIdentifier());
  
    if (investor.balance < thisToken.proposedPrice) {
      throw new Error("Not enough money on your balance");
    }
  
    // reduce the Investor's balance
    investor.balance -= thisToken.proposedPrice;
    // add money to owner's balance
    absoluteOwner.balance += thisToken.proposedPrice;
    // change the Token's status
    thisToken.movementStatus = 'STORED';
    // change the Token's owner
    thisToken.holder = investor;

    await fr.update(investor);
    await orgs.update(absoluteOwner);

    await tokens.update(thisToken);
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.TryVote} tx
   * @transaction
   */
  async function TryVote(tx) {
    const fr = await getParticipantRegistry('org.sample.Investor');
    const investor = await fr.get(tx.investorId);


    const proposerCollection = await getAssetRegistry('org.sample.Proposal');
    var thisProp = await proposerCollection.get(tx.propId);

    if(tx.voice){
      thisProp.VoteRes += 1.0;
    }
    else{
      thisProp.VoteRes -= 1.0;
    }

    await proposerCollection.update(thisProp);
  }
  
  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.finalVote} tx
   * @transaction
   */
  async function finalVote(tx) {
    const props = await getAssetRegistry('org.sample.Proposal');
    let curProp = await props.get(tx.proposalId);

    if (curProp.VoteRes > 0) {
      curProp.voteFinalRes = true;
    } else {
      curProp.voteFinalRes = false;
    }
    curProp.movementStatus = "STORED";
    await props.update(curProp);
  }

  //////////////////////////////////////////////////////////////////////
  /**
   * @param {org.sample.sendToProvider} tx
   * @transaction
   */
  async function sendToProvider(tx) {
    const props = await getAssetRegistry('org.sample.Proposal');
    let curProp = await props.get(tx.proposalId);

    const provs = await getParticipantRegistry('org.sample.Provider')
    let prov = await provs.get(tx.email);


    if (curProp.voteFinalRes == true) {
      prov.balance += curProp.quantity;
    } 
    
    await props.update(curProp);
    await provs.update(prov);
  }