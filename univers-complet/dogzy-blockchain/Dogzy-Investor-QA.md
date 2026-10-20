# Dogzy Family Universe: Investor Q&A

**1. What is Dogzy Family Universe?**
It is a world of dog characters with professions. Players level up in their jobs and can own businesses. The universe extends to a PlayStation VR game, *Dogzie Town*, and to a DOGZY token.

**2. Why a token?**
Players can take value they earned in the game out to a wallet they control, as real DOGZY tokens.

**3. Why Avalanche?**
It works with Ethereum tools (EVM), transactions are fast and fees are low. It also offers a free testnet (Fuji) for validation.

**4. How does the export work?**
The game debits the player's tokens, and the server signs a single-use voucher with an expiry date. The player then claims DOGZY on-chain through the DogzyBridge contract.

**5. Can someone cheat or steal vouchers?**
The 12 automated tests check that each of these attempts is rejected:
- reusing a voucher
- using another player's voucher
- forged vouchers
- altered amounts
- expired vouchers
- claims above the cap or above the reserve
- non-owner admin actions

**6. What is the biggest risk?**
The server signing key. Anyone holding it could issue vouchers. It must stay on the server only. Caps, the reserve limit and the pause feature limit the damage if it leaks.

**7. Has it been audited?**
Not yet. An independent audit is planned before mainnet. Auditor and budget: [TBD]

**8. Is it live?**
No. It is a prototype: it compiles and the tests pass. Next is the Fuji testnet.

**9. What is the total supply and the exchange rate?**
Both are configurable at deployment. The final tokenomics are [TBD].

**10. Is the token for sale?**
No. No token sale is open. Any future distribution would follow legal review: [TBD]

**11. What is the state of the game?**
*Dogzie Town* is under development for PlayStation VR. Status, platform agreements and release date: [TBD]

**12. How do the businesses work?**
Level 5 of each job is a business. The first player to reach it owns it, and later players buy franchises. Shops and accessories let players customize their characters.

**13. What about NFTs?**
Valkyrie Gallery artworks are planned as NFTs. Sales are not open yet.

**14. Who owns the IP?**
The artist Valkyrie (Sania Labbé) holds it exclusively.

**15. How much are you raising, and for what?**
Amount [TBD] · Use of funds [TBD] · Team [TBD]
