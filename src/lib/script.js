//////////////////////////////////////////////////////////////////////
/**
 * @param {org.sample.invest} tx
 * @transaction
 */
async function invest(tx, id, sum) {
   const org = await getParticipantRegistry('org.sample.Organisation');
   //const inv = await getParticipantRegistry('org.sample.Investor');
   //const currInvest =  await inv.get(getCurrentParticipant().getIdentifier());
   const orgById = await org.get(id);

   orgById.balance += sum;
   tx.balance -= sum;
   
   //tx.investId
   //const invest = await rusom.Investor.
}