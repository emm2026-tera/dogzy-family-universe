# Dogzy Family Universe
### A play-to-own dog world, from the Dogzie Town game to the blockchain
*Created by Sania Labbé (artist Valkyrie), October 2026*

**The concept.** Dogzy Family Universe is a world of dog characters, each with a profession: Chef (Golden Retriever), Barmaid (Cavalier), Police Officer (German Shepherd), Firefighter (Saint Bernard), Nurse (Collie), Veterinarian (Labrador), Pilot (Weimaraner), Painter (Australian Shepherd), Singer (Shiba) and more than 25 others. Players progress through levels in each job. **Level 5 of every job is a business** (restaurant chain, bank, clinic, gallery, film studio, airport...). The first player to reach it owns the business, and later players can buy a franchise. Characters can be customized with **equippable accessories**.

**The game.** In *Dogzie Town*, a PlayStation VR game under development, players earn Dogzy tokens by working, building businesses and taking part in events.

**The token: DOGZY.** DOGZY is a standard **ERC-20 token on Avalanche C-Chain**, chosen for EVM compatibility, fast transactions and low fees. The **DogzyBridge** contract lets players turn in-game tokens into real DOGZY that they own:

1. The game server debits the player's in-game balance.
2. The server issues a **signed, single-use voucher** for that player, with an expiry date.
3. The player claims real DOGZY from their own wallet. The contract checks the voucher and pays out from a reserve that the project funds.

**Built-in security.** Each voucher can be used only once, only by its own player, and only before it expires. Forged or altered vouchers are rejected. There are per-claim caps, the contract can never pay out more than the funded reserve, the owner can pause claims in an emergency, and only the owner can change settings. The contracts are built on audited OpenZeppelin libraries.

**Honest status.**
- **Prototype.** The smart contracts and deployment script are written. The code compiles, and **all 12 automated security tests pass**.
- **Not yet deployed.** The next step is the free Avalanche Fuji testnet.
- The game-side signing service is still to be built.
- An **independent security audit** will take place before any mainnet launch.

**Roadmap.**
1. Deploy and test on the Fuji testnet.
2. Integrate the signing service with Dogzie Town and the in-game wallet (Exchange Bank).
3. Independent audit.
4. Mainnet launch with conservative caps.
5. NFT artworks through the Valkyrie Gallery.

**The ask.** Investment amount [TBD] · Use of funds [TBD] · Terms [TBD]
**Contact.** Sania Labbé · thedogzyfamilyuniverse.ca · [email TBD]

*Vision and plan, not a promise of returns. No token sale is open. All intellectual property belongs exclusively to the artist Valkyrie (Sania Labbé).*
