const COIN = () => h("span", { class: "coin" });
const Views = {
  home(D) {
    const C = D.characters.characters, B = D.businesses.businesses;
    const strip = h("div", { class: "strip" }, C.slice(0, 9).map((c) => h("a", { href: "#/character/" + c.id }, h("img", { src: c.image, alt: c.name }))));
    const sect = (ic, kicker, title, text, link, label, imgs) => h("section", { class: "feature f-" + ic },
      h("div", { class: "ftext" }, h("div", { class: "kicker" }, icon(ic, "#e8b848", 20), kicker), h("h2", {}, title), h("p", {}, text),
        h("a", { class: "btn", href: link }, label + " →")),
      h("div", { class: "fimgs" }, imgs));
    return h("div", { class: "home" },
      h("div", { class: "hero-banner" }, h("img", { src: "assets/backgrounds/dogzy-town.jpg", alt: "Welcome to Dogzy Town" })),
      h("section", { class: "hero" },
        h("div", { class: "hero-text" },
          h("div", { class: "kicker" }, "Interactive investor demo"),
          h("h1", {}, "Art you can play.", h("br"), h("span", { class: "gold" }, "A world you can own.")),
          h("p", { class: "lead" }, "Dogzy Family Universe is a city of hand-designed dog characters. Every job grows over five levels into a real business, and the tokens players earn in the game can be exported to the Avalanche blockchain."),
          h("div", { class: "cta" }, h("a", { class: "btn", href: "#/characters" }, "Meet the characters"), h("a", { class: "btn ghost", href: "#/wallet" }, "See the token export")),
          h("div", { class: "stats" },
            [[C.length, "job characters"], [B.length, "businesses"], ["5", "career levels each"], ["1", "token: DOGZY"]].map(([n, l]) => h("div", {}, h("strong", {}, String(n)), h("span", {}, l))))),
        h("div", { class: "hero-art zoom", onclick: () => lightbox(C[0].card, C[0].name) }, h("img", { src: C[0].card, alt: C[0].name }))),
      strip,
      h("section", { class: "concept" },
        h("h2", { class: "center" }, "One universe, three layers"),
        h("div", { class: "three" },
          [["palette", "Original art", "Every character, shop and scene comes from the artist Valkyrie's own visual universe: a recognizable IP, not stock assets."],
           ["game", "A career game", "Players pick a dog with a job, level it up from apprentice to owner, buy career equipment and run their own business in Dogzy City."],
           ["chain", "Blockchain bridge", "In-game tokens stay off-chain while playing. When a player chooses, they export them as DOGZY tokens to their Avalanche wallet through a secured bridge contract."]]
            .map(([i, t, d]) => h("div", { class: "pillar" }, icon(i, "#e8b848", 34), h("h3", {}, t), h("p", {}, d))))),
      sect("chars", "Characters", C.length + " demo characters, " + C.length + " careers", "From the golden retriever chef to the weimaraner pilot, each character has five levels, its own career equipment and its own environment.", "#/characters", "Browse characters",
        C.slice(1, 4).map((c) => h("img", { src: c.image, alt: c.name }))),
      sect("city", "City", B.length + " businesses to build", "Level 5 of every job is a business. The first player to complete it owns it; the next players can buy a franchise.", "#/city", "Explore the city",
        B.slice(11, 14).map((b) => h("img", { src: b.image, alt: b.name }))),
      h("section", { class: "feature f-board" },
        h("div", { class: "ftext" }, h("div", { class: "kicker" }, "Game board · Level 1"), h("h2", {}, "Search spaces open hidden-object maps"),
          h("p", {}, "Roll around the Level 1 board. Land on a magnifier and you play a hidden-object map from a Dogzy Town mission. Find every object to win access to an accessory."),
          h("a", { class: "btn", href: "#/search/jewelry-store", "data-act": "play-jewelry" }, "Play: Jewelry Store →"), " ", h("a", { class: "btn ghost", href: "#/search" }, "All maps")),
        h("div", { class: "fimgs" }, h("img", { class: "panelprev", src: "assets/board/level1-board.jpg", alt: "Dogzy Town Level 1 game board" }))),
      sect("ward", "Inventory", "Career equipment, level by level", "Every character has its own equipment from its career card: 5 items per level, 25 in all. Each level has 4 items plus a GOLD item; owning all 5 completes the level and opens the next one. Prices come from a configurable table.", "#/wardrobe", "Open the inventory",
        [h("img", { class: "panelprev", src: (D.equipment.equipment[C[0].id] || [{}])[0].panel, alt: "Chef level-1 equipment" })]),
      sect("wallet", "Wallet", "Export to Avalanche", "A walkthrough of the real bridge flow: game debit, signed voucher, on-chain claim. In this demo nothing leaves your browser.", "#/wallet", "Open the wallet",
        [h("div", { class: "flow" }, ["Game tokens", "Signed voucher", "DOGZY on Avalanche"].map((t, i) => h("div", { class: "step" }, h("b", {}, String(i + 1)), t)))]));
  },

  characters(D) {
    const st = State.data;
    return h("div", {}, h("div", { class: "pagehead" }, h("h1", {}, "Characters"),
        h("p", { class: "muted" }, "Every dog has a job and five career levels. Tap a character to see its career, dress it up or play it.")),
      h("div", { class: "grid chars" }, D.characters.characters.map((c) => {
        const go = () => { location.hash = "#/character/" + c.id; };
        const owned = isOwned(c);
        return h("div", { class: "card tap" + (st.character === c.id ? " selected" : ""), "data-char": c.id, role: "button", tabindex: "0", onclick: go, onkeydown: (e) => { if (e.key === "Enter") go(); } },
          h("div", { class: "pic" }, h("img", { src: c.image, alt: c.name, loading: "lazy" }), st.character === c.id ? h("span", { class: "badge" }, "Active") : owned ? h("span", { class: "badge" }, "Owned") : null),
          h("div", { class: "body" },
            h("strong", {}, c.job),
            h("div", { class: "tags" }, h("span", { class: "tag" }, c.breed), c.level5 && h("span", { class: "tag gold" }, "Lv 5 · " + c.level5)),
            h("span", { class: "btn small" }, "View character →")));
      })));
  },

  character(D, id) {
    const st = State.data, C = D.characters.characters, c = C.find((x) => x.id === id);
    if (!c) return h("div", { class: "pagehead" }, h("h1", {}, "Character not found"), h("a", { class: "btn", href: "#/characters" }, "Back to characters"));
    const biz = D.businesses.businesses.find((b) => b.id === c.business);
    const owned = isOwned(c), active = st.character === c.id;
    const EQ = (D.equipment.equipment || {})[c.id] || [];
    const levels = EQ.length === 5 ? EQ.map((L) => L.title + " — " + L.items.map((x) => x.name).join(", ")) : ["Level-1 " + c.job, "Confirmed " + c.job, "Senior " + c.job, c.level4 || "Manager", c.level5 || "Business owner"];
    const select = () => owned ? activate(c) : buyDialog(c, biz);
    return h("div", { class: "detail" },
      h("a", { class: "back small", href: "#/characters" }, "← All characters"),
      h("div", { class: "detail-grid" },
        h("div", { class: "portrait card" }, h("img", { src: c.image, alt: c.name }), active && h("span", { class: "badge" }, "Active")),
        h("div", { class: "card padded" },
          h("div", { class: "kicker" }, c.breed),
          h("h1", {}, c.name),
          h("p", { class: "muted" }, c.description),
          h("ol", { class: "levels" }, levels.map((l, i) => h("li", {}, h("b", {}, "Lv " + (i + 1)), h("span", {}, l)))),
          h("div", { class: "price" }, owned ? h("span", { class: "gold" }, active ? "Active character ✓" : "Owned ✓") : h("span", {}, "Unlock: " + c.price + " ", COIN())),
          h("div", { class: "actions" },
            h("button", { class: active ? "ghost" : "", "data-act": "select", onclick: select }, active ? "Selected ✓" : owned ? "Play this character" : "Select this character"),
            h("button", { class: "ghost", "data-act": "wardrobe", onclick: () => { if (!owned) return buyDialog(c, biz, "wardrobe"); activate(c, true); location.hash = "#/wardrobe"; } }, "Open in Inventory"),
            biz && h("a", { class: "bizlink", "data-act": "city", href: "#/city/" + biz.id }, h("span", { class: "bizimg" }, h("img", { src: biz.image, alt: biz.name, loading: "eager" }), h("span", { class: "bizlabel" }, biz.name)), h("span", {}, h("small", { class: "kicker" }, "Their building"), h("b", {}, biz.name + " →"))),
            h("button", { class: "ghost", onclick: () => lightbox(c.card, c.name) }, "View full career card")))));
  },

  search(D, id) {
    const st = State.data, maps = (D.maps || {}).maps || [], M = maps.find((m) => m.id === id && m.objects);
    if (!M) return h("div", {}, h("div", { class: "pagehead" }, h("h1", {}, "Search maps"), h("p", { class: "muted" }, "Search spaces on the board open these hidden-object maps.")),
      h("div", { class: "grid bizgrid" }, maps.map((m) => h("div", { class: "card padded" }, h("div", { class: "kicker small" }, m.mission), h("strong", {}, m.title),
        h("p", { class: "small muted" }, m.intro || m.concept), m.objects ? h("a", { class: "btn small", href: "#/search/" + m.id }, "Play →") : h("span", { class: "tag" }, "Coming next")))));
    const found = new Set(), total = M.objects.length; let left = M.time || 90, timer = null, over = false;
    const scene = h("div", { class: "hob-scene", style: "aspect-ratio:" + (M.w || 16) + "/" + (M.h || 9) }, h("img", { class: "hob-img", src: M.image, alt: M.title }));
    const list = h("div", { class: "hob-list" });
    const clock = h("b", { class: "hob-clock", "data-test": "timer" }, "");
    const drawList = () => { list.textContent = ""; M.objects.forEach((o) => list.append(h("span", { class: "hob-chip" + (found.has(o.id) ? " found" : ""), "data-obj": o.id }, found.has(o.id) ? "✓ " : "", o.name))); };
    const tick = () => { clock.textContent = Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); };
    const end = (win) => { over = true; clearInterval(timer);
      if (win) { st.access[M.reward.item] = 1; st.mapsWon[M.id] = 1; State.save();
        modal(h("div", { class: "kicker" }, "Mission complete"), h("h2", {}, "All " + total + " found! ✓"), h("p", {}, "Reward unlocked: ", h("b", { class: "gold" }, M.reward.label)),
          h("p", { class: "small muted" }, "Time left " + clock.textContent + ". The item can now be bought in Inventory, even before its level."),
          h("div", { class: "actions" }, h("button", { "data-act": "go-reward", onclick: () => { closeModal(); st.character = M.reward.character; State.save(); location.hash = "#/wardrobe"; } }, "Open in Inventory"), h("button", { class: "ghost", onclick: () => { closeModal(); App.render(); } }, "Play again")));
      } else modal(h("div", { class: "kicker" }, "Time's up"), h("h2", {}, found.size + " / " + total + " found"), h("div", { class: "actions" }, h("button", { onclick: () => { closeModal(); App.render(); } }, "Try again"), h("a", { class: "btn ghost", href: "#/search", onclick: closeModal }, "All maps"))); };
    M.objects.forEach((o) => {
      const art = h("span", { class: "hob-obj", style: "left:" + o.x * 100 + "%;top:" + o.y * 100 + "%;width:" + o.size * 100 + "%;transform:translate(-50%,-50%) rotate(" + (o.rot || 0) + "deg)" });
      art.innerHTML = HOB_ART[o.icon] || "";
      const hit = h("button", { class: "hob-hit", "data-hit": o.id, "aria-label": o.name, style: "left:" + o.x * 100 + "%;top:" + o.y * 100 + "%;width:" + Math.max(o.size * 2.2, 0.06) * 100 + "%", onclick: (e) => {
        e.stopPropagation(); if (over || found.has(o.id)) return; found.add(o.id); art.classList.add("got"); hit.classList.add("got"); drawList(); toast("Found: " + o.name + " (" + found.size + "/" + total + ")");
        if (found.size === total) end(true); } });
      scene.append(art, hit);
    });
    scene.addEventListener("click", (e) => { if (over) return; const r = scene.getBoundingClientRect(); const m = h("span", { class: "hob-miss", style: "left:" + (e.clientX - r.left) + "px;top:" + (e.clientY - r.top) + "px" }, "✕"); scene.append(m); setTimeout(() => m.remove(), 600); });
    drawList(); tick();
    timer = setInterval(() => { if (!document.body.contains(scene)) return clearInterval(timer); left--; tick(); if (left <= 0) end(false); }, 1000);
    return h("div", { class: "hob" },
      h("div", { class: "pagehead" }, h("div", { class: "kicker" }, "Search space · " + M.mission), h("h1", {}, M.title), h("p", { class: "muted" }, M.intro)),
      h("div", { class: "hob-bar card padded" }, h("span", { class: "small" }, "Time ", clock), h("span", { class: "small" }, "Reward: ", h("b", { class: "gold" }, M.reward.label))),
      list,
      h("div", { class: "hob-wrap" }, scene),
      h("p", { class: "small muted center" }, "Swipe the scene sideways to search the whole scene. Tap an object when you spot it."));
  },

  businesses(D) {
    const st = State.data, price = PRICES.business();
    const list = D.characters.characters.map((c) => ({ c, b: D.businesses.businesses.find((x) => x.id === c.business) })).filter((x) => x.b);
    return h("div", {}, h("div", { class: "pagehead" }, h("h1", {}, "Businesses"),
        h("p", { class: "muted" }, "Buy the building that goes with each demo character. Each business is a separate collectible (NFT-style) in your inventory. Price: " + price + " DOGZY each (configurable).")),
      h("div", { class: "grid bizgrid" }, list.map(({ c, b }) => {
        const owned = !!st.biz[b.id];
        return h("div", { class: "card bizcard" + (owned ? " owned" : ""), "data-biz": b.id },
          h("div", { class: "bizimg" }, h("img", { src: b.image, alt: b.name, loading: "lazy" }), h("span", { class: "bizlabel" }, b.name)),
          h("div", { class: "body" },
            h("div", { class: "kicker small" }, b.category),
            h("strong", {}, b.name),
            h("span", { class: "muted small" }, "Paired with " + c.name),
            owned ? h("span", { class: "nftbadge" }, "OWNED · NFT") :
            h("button", { "data-act": "buy-biz", disabled: st.balance < price, onclick: () => {
              if (st.balance < price) return toast("Not enough DOGZY");
              st.balance -= price; st.biz[b.id] = 1; State.save(); toast(b.name + " bought"); App.render(); } }, "Buy · " + price, COIN())));
      })));
  },

  city(D) {
    const st = State.data;
    return h("div", {}, h("div", { class: "pagehead" }, h("h1", {}, "Dogzy City"),
        h("p", { class: "muted" }, D.businesses.note)),
      h("div", { class: "grid city" }, D.businesses.businesses.map((b) => {
        const owned = b.items.filter((it) => st.inventory[it.id]).length;
        return h("div", { class: "card", id: "biz-" + b.id }, pic(b),
          h("div", { class: "body" },
            h("div", { class: "kicker small" }, b.category),
            h("strong", {}, b.name),
            h("span", { class: "muted small" }, b.description),
            h("div", { class: "progress" }, h("i", { style: "width:" + owned * 20 + "%" })),
            h("div", { class: "small muted" }, "Upgrades " + owned + "/5 · unlocks " + b.unlocks),
            b.items.map((it) => h("div", { class: "item" },
              h("span", {}, it.name),
              st.inventory[it.id] ? h("span", { class: "gold small" }, "Built ✓") :
              h("button", { class: "mini", disabled: st.balance < it.price, onclick: () => {
                st.balance -= it.price; st.inventory[it.id] = 1; State.save(); toast(it.name + " built"); App.render();
              } }, String(it.price), COIN())))));
      })));
  },

  wardrobe(D) {
    const st = State.data, chars = D.characters.characters;
    const ch = chars.find((c) => c.id === st.character);
    const head = h("div", { class: "pagehead" }, h("h1", {}, "Inventory"), h("p", { class: "muted" }, "Each character's own career equipment, from its career card. Own all 5 items of a level (4 + GOLD) to complete it, then pay the next level's fee."));
    if (!ch || !isOwned(ch)) {
      const owned = chars.filter(isOwned);
      return h("div", {}, head, h("div", { class: "card padded center locked-prompt", "data-test": "unlock-first" },
        h("h2", {}, ch ? "Unlock " + ch.job + " first" : "Unlock a character first"),
        h("p", { class: "muted" }, ch ? "This character is not yours yet. Unlock it for " + ch.price + " DOGZY to use its inventory." : "Pick a character and unlock it with DOGZY to open its inventory."),
        h("div", { class: "actions" },
          ch ? h("button", { onclick: () => buyDialog(ch, D.businesses.businesses.find((b) => b.id === ch.business)) }, "Unlock " + ch.job + " · " + ch.price + " DOGZY") : null,
          h("a", { class: "btn ghost", href: "#/characters" }, "Browse characters")),
        owned.length ? h("div", { class: "small muted", style: "margin-top:1rem" }, "Your characters: ", owned.map((c) => h("a", { href: "#/wardrobe", style: "margin:0 .3rem", onclick: () => { st.character = c.id; State.save(); App.render(); } }, c.job))) : null));
    }
    const E = (D.equipment.equipment || {})[ch.id] || [];
    const unlocked = Math.min(st.level[ch.id] || 1, 5);
    const complete = (L) => L.items.every((x) => st.gear[x.id]);
    const doneCount = E.filter(complete).length;
    const lvl = doneCount >= 5 ? 6 : unlocked; // 6 = career complete
    const all = E.flatMap((L) => L.items.map((it) => Object.assign({ lv: L.level }, it)));
    const mine = all.filter((it) => st.gear[it.id]);
    const buy = (it, L) => modal(h("div", { class: "kicker" }, "Demo purchase · in-game DOGZY, no real money"),
      h("h2", {}, it.gold ? "GOLD item: " + it.name : it.name),
      h("div", { class: "sum" }, h("div", {}, h("span", {}, "Price"), h("b", { "data-test": "item-price" }, String(it.price), COIN())), h("div", {}, h("span", {}, "Your balance"), h("b", {}, String(st.balance), COIN())), h("div", {}, h("span", {}, "After purchase"), h("b", {}, String(st.balance - it.price), COIN()))),
      h("div", { class: "actions" }, h("button", { "data-act": "confirm-item", disabled: st.balance < it.price, onclick: () => { closeModal(); doBuy(it, L); } }, "Confirm"), h("button", { class: "ghost", "data-act": "cancel", onclick: closeModal }, "Cancel")));
    const doBuy = (it, L) => {
      if (st.balance < it.price) { toast("Not enough DOGZY"); return; }
      st.balance -= it.price; st.gear[it.id] = 1;
      toast(it.gold ? "GOLD " + it.name + " bought · level " + L.level + " complete" + (L.level < 5 ? "! Unlock level " + (L.level + 1) + " next." : " · career complete!") : it.name + " bought");
      State.save(); App.render();
    };
    const levelUp = (L) => { const fee = PRICES.fee(L.level); modal(h("div", { class: "kicker" }, "Level-up fee · in-game DOGZY"), h("h2", {}, "Unlock level " + L.level + ": " + L.title),
      h("div", { class: "sum" }, h("div", {}, h("span", {}, "Fee"), h("b", { "data-test": "fee-price" }, String(fee), COIN())), h("div", {}, h("span", {}, "Your balance"), h("b", {}, String(st.balance), COIN()))),
      h("div", { class: "actions" }, h("button", { "data-act": "confirm-fee", disabled: st.balance < fee, onclick: () => { closeModal(); doLevelUp(L); } }, "Confirm"), h("button", { class: "ghost", "data-act": "cancel", onclick: closeModal }, "Cancel"))); };
    const doLevelUp = (L) => {
      const fee = PRICES.fee(L.level);
      if (st.balance < fee) { toast("Not enough DOGZY"); return; }
      st.balance -= fee; st.level[ch.id] = L.level; State.save(); toast(ch.job + " reached level " + L.level + "!"); App.render();
    };
    const stage = h("div", { class: "stage" }, h("div", { class: "avatar" }, h("img", { class: "base", src: ch.image, alt: ch.job })), h("div", { class: "platform" }));
    return h("div", {}, head,
      h("div", { class: "row wardrobe" },
        h("div", {},
          h("div", { class: "card padded center" }, stage,
            h("h3", {}, ch.name),
            h("div", { class: "lvlbar" }, [1, 2, 3, 4, 5].map((n) => h("i", { class: n < lvl ? "done" : n === lvl ? "cur" : "" }))),
            h("p", { class: "small", "data-test": "level" }, lvl > 5 ? "Career complete · all 5 levels" : "Level " + lvl + " · " + (E[lvl - 1] ? E[lvl - 1].title : "")),
            h("p", { class: "small muted" }, h("a", { href: "#/characters" }, "Change character"))),
          h("div", { class: "card padded inventory", "data-test": "inventory" },
            h("div", { class: "kicker small" }, "Inventory Book · " + ch.job + " · " + mine.length + "/" + all.length),
            mine.length ? E.map((L) => { const got = L.items.filter((x) => st.gear[x.id]); return got.length ? h("div", { class: "book-lv" }, h("div", { class: "small gold" }, "Level " + L.level + " · " + L.title), h("div", { class: "chips" }, got.map((it) => h("span", { class: "chip" + (it.gold ? " gold" : "") }, it.gold ? "GOLD · " : "", it.name)))) : null; })
              : h("p", { class: "small muted" }, "Your Inventory Book is empty. Buy your first level-1 item."))),
        h("div", {}, E.map((L) => {
          const isDone = complete(L), isOpen = L.level <= unlocked;
          const state = isDone ? "done" : isOpen ? "cur" : "locked";
          const prevDone = L.level === 1 || complete(E[L.level - 2]);
          const fee = PRICES.fee(L.level);
          return h("div", { class: "card padded level " + state, "data-level": L.level },
            h("div", { class: "lvhead" }, h("b", {}, "Level " + L.level), h("span", {}, L.title),
              h("em", { class: "status" }, isDone ? "Completed ✓" : isOpen ? "In progress" : prevDone ? "Ready to unlock" : "Locked · complete level " + (L.level - 1))),
            !isOpen ? h("div", { class: "levelup" },
              h("span", { class: "small" }, "Level " + L.level + " fee: " + fee + " ", COIN()),
              h("button", { class: "mini", "data-act": "levelup-" + L.level, disabled: !prevDone || st.balance < fee, onclick: () => levelUp(L) }, "Unlock level " + L.level + " · " + fee, COIN())) : null,
            h("img", { class: "panel", src: L.panel, alt: "Level " + L.level + " equipment from the career card", loading: "lazy" }),
            h("div", { class: "items" }, L.items.map((it) => {
              const has = !!st.gear[it.id], regsDone = L.items.filter((x) => !x.gold).every((x) => st.gear[x.id]);
              const early = !!st.access[it.id] && !it.gold;
              const can = (isOpen || early) && !has && st.balance >= it.price && (!it.gold || regsDone);
              return h("div", { class: "item" + (it.gold ? " gold" : "") + (has ? " has" : ""), "data-item": it.id },
                h("span", {}, it.gold ? h("span", { class: "goldtag", "data-test": "gold-label" }, "GOLD") : null, it.name, early && !isOpen ? h("small", { class: "gold" }, " · early access (Search reward)") : null, it.gold ? h("small", { class: "muted" }, " · completes the level" + (regsDone || has ? "" : " (buy the 4 others first)")) : null),
                has ? h("span", { class: "gold small" }, "Owned ✓") :
                h("button", { class: "mini" + (it.gold ? " goldbtn" : ""), disabled: !can, onclick: () => buy(it, L) }, String(it.price), COIN()));
            })));
        }))));
  },

  wallet(D) {
    const st = State.data;
    const items = D.businesses.businesses.flatMap((b) => b.items.map((i) => Object.assign({ biz: b.name }, i)));
    const owned = Object.keys(st.inventory);
    const log = h("div", { class: "log" }, "Ready. Enter an address and an amount.");
    const addr = h("input", { placeholder: "0x… your Avalanche C-Chain address", value: "0x8f3C9a1B2d4E5f60718293a4B5c6D7e8F9012345" });
    const amt = h("input", { type: "number", min: "1", step: "1", value: "50" });
    const quote = h("p", { class: "muted small" });
    const btn = h("button", {}, "Run export walkthrough");
    const upd = () => { quote.textContent = "You receive " + BridgeSim.quote(parseInt(amt.value, 10) || 0) + " DOGZY · rate 1:" + (BridgeSim.rate / BridgeSim.RATE_DENOMINATOR) + " · max " + BridgeSim.maxClaim + " per claim"; };
    amt.addEventListener("input", upd); upd();
    btn.addEventListener("click", async () => {
      const amount = Number(amt.value);
      const err = BridgeSim.validate(addr.value.trim(), amount, st.balance);
      if (err) { log.textContent = ""; log.append(h("span", { class: "err" }, err)); return; }
      btn.disabled = true; log.textContent = "";
      await BridgeSim.run(addr.value.trim(), amount, st, (line, cls) => log.append(h("div", { class: cls }, line)));
      btn.disabled = false; State.save(); const ib = document.getElementById("invbal"); if (ib) ib.textContent = st.balance;
    });
    return h("div", {}, h("div", { class: "pagehead" }, h("h1", {}, "Wallet"), h("p", { class: "muted" }, "Tokens are earned in the game, then exported to Avalanche when the player decides.")),
      h("div", { class: "flow wide" }, ["Earn tokens in game", "Game server signs a voucher", "Player claims DOGZY on Avalanche"].map((t, i) => h("div", { class: "step" }, h("b", {}, String(i + 1)), t))),
      h("div", { class: "row" },
        h("div", { class: "card padded" }, h("h2", {}, "Game inventory"),
          h("div", { class: "item big" }, h("span", {}, COIN(), " DOGZY game tokens"), h("strong", { id: "invbal" }, String(st.balance))),
          owned.length ? owned.map((id) => { const it = items.find((i) => i.id === id) || { name: id, biz: "" };
            return h("div", { class: "item" }, h("span", {}, it.name), h("span", { class: "muted small" }, it.biz)); })
            : h("p", { class: "muted" }, "No upgrades built yet. Visit the City."),
          h("button", { class: "ghost", onclick: () => { State.reset(); App.render(); } }, "Reset demo")),
        h("div", { class: "card padded" }, h("h2", {}, "Export to Avalanche"),
          h("label", {}, "Avalanche wallet address"), addr,
          h("label", {}, "In-game tokens to export"), amt, quote, btn, log)),
      st.exports.length ? h("div", { class: "card padded", style: "margin-top:1rem" }, h("h2", {}, "Export history"),
        st.exports.map((e) => h("div", { class: "item" }, h("span", {}, e.amount + " tokens → " + e.out + " DOGZY"), h("span", { class: "muted small" }, e.address.slice(0, 10) + "…")))) : null);
  },
};

function isOwned(c) { return !!(c && State.data.owned[c.id]); }
function activate(c, quiet) { State.data.character = c.id; State.save(); if (!quiet) { toast(c.job + " is now your character"); App.render(); } }
function closeModal() { const m = document.getElementById("modal"); if (m) m.remove(); }
function modal(...kids) {
  closeModal();
  const m = h("div", { id: "modal", class: "modal", onclick: (e) => { if (e.target === m) closeModal(); } }, h("div", { class: "sheet", role: "dialog", "aria-modal": "true" }, kids));
  document.body.append(m); return m;
}
function buyDialog(c, biz, after) {
  const st = State.data, enough = st.balance >= c.price;
  modal(h("div", { class: "kicker" }, "Demo purchase · in-game DOGZY tokens, no real money"),
    h("h2", {}, "Unlock " + c.name + "?"),
    h("div", { class: "sum" },
      h("div", {}, h("span", {}, "Price"), h("b", {}, String(c.price), COIN())),
      h("div", {}, h("span", {}, "Your balance"), h("b", {}, String(st.balance), COIN())),
      h("div", {}, h("span", {}, "After purchase"), h("b", { class: enough ? "" : "bad" }, String(st.balance - c.price), COIN()))),
    enough ? null : h("p", { class: "bad small" }, "Not enough DOGZY. You need " + (c.price - st.balance) + " more. Earn tokens by playing, or reset the demo balance in the Wallet."),
    h("div", { class: "actions" },
      h("button", { "data-act": "confirm", disabled: !enough, onclick: () => {
        st.balance -= c.price; st.owned[c.id] = 1; st.character = c.id; State.save(); App.render();
        modal(h("div", { class: "kicker" }, "Success"), h("h2", {}, c.job + " unlocked ✓"),
          h("p", { class: "muted" }, c.price + " DOGZY spent. New balance: " + st.balance + " DOGZY. " + c.name + " is now your active character."),
          h("div", { class: "actions" },
            h("button", { "data-act": "go-wardrobe", onclick: () => { closeModal(); location.hash = "#/wardrobe"; } }, "Open in Inventory"),
            biz && h("button", { class: "ghost", "data-act": "go-city", onclick: () => { closeModal(); location.hash = "#/city/" + biz.id; } }, "Go to " + biz.name),
            h("button", { class: "ghost", onclick: closeModal }, "Close")));
      } }, "Confirm"),
      enough ? null : h("a", { class: "btn ghost", href: "#/wallet", onclick: closeModal }, "Open Wallet"),
      h("button", { class: "ghost", "data-act": "cancel", onclick: closeModal }, "Cancel")));
}

const HOB_ART = {
  tube: '<svg viewBox="0 0 32 32"><rect x="12" y="2" width="8" height="3" rx="1" fill="#c9c9c9"/><path d="M13 5h6v20a3 3 0 0 1-6 0z" fill="#ffffff" fill-opacity=".25" stroke="#e0d8ff" stroke-width="1"/><path d="M13 15h6v10a3 3 0 0 1-6 0z" fill="#8cff4a"/></svg>',
  vial: '<svg viewBox="0 0 32 32"><rect x="13" y="2" width="6" height="5" fill="#e8b848"/><path d="M12 7h8v4l5 6v9a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4v-9l5-6z" fill="#a64dff" fill-opacity=".85" stroke="#e8b848" stroke-width="1"/><circle cx="16" cy="23" r="2.6" fill="#e8b848"/><circle cx="12.5" cy="19.5" r="1.1" fill="#e8b848"/><circle cx="16" cy="18" r="1.1" fill="#e8b848"/><circle cx="19.5" cy="19.5" r="1.1" fill="#e8b848"/></svg>',
  goggles: '<svg viewBox="0 0 32 32"><path d="M2 15h28" stroke="#3a2a10" stroke-width="2.5"/><rect x="4" y="10" width="11" height="10" rx="4" fill="#7ad7ff" fill-opacity=".6" stroke="#e8b848" stroke-width="1.6"/><rect x="17" y="10" width="11" height="10" rx="4" fill="#7ad7ff" fill-opacity=".6" stroke="#e8b848" stroke-width="1.6"/><path d="M6 13h4" stroke="#fff" opacity=".8"/></svg>',
  cring: '<svg viewBox="0 0 32 32"><ellipse cx="16" cy="22" rx="9" ry="7" fill="none" stroke="#d9a63a" stroke-width="3"/><path d="M9 14l2-8 3 4 2-5 2 5 3-4 2 8z" fill="#e8b848" stroke="#8a611a" stroke-width=".7"/><circle cx="16" cy="11" r="1.6" fill="#a64dff"/></svg>',
  clapper: '<svg viewBox="0 0 32 32"><rect x="4" y="13" width="24" height="15" rx="1" fill="#141414" stroke="#e8b848" stroke-width="1"/><path d="M4 8l23-5 1 5-23 5z" fill="#f1f1f1"/><path d="M8 7l3 4M14 5.7l3 4M20 4.4l3 4" stroke="#141414" stroke-width="2.2"/><path d="M7 18h18M7 22h12" stroke="#e8b848" stroke-width="1"/></svg>',
  reel: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#3a3a3a" stroke="#c9c9c9" stroke-width="1.5"/><circle cx="16" cy="16" r="2.5" fill="#ddd"/>' + [[16,8.5],[22.5,12.5],[20,20.5],[12,20.5],[9.5,12.5]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="3" fill="#111"/>').join("") + '</svg>',
  helmet: '<svg viewBox="0 0 32 32"><path d="M4 20a12 12 0 0 1 24-3v7H8z" fill="#151515" stroke="#e8b848" stroke-width="1.2"/><path d="M14 13h13v6H14z" fill="#5a8fb8" opacity=".85"/><path d="M6 24h21" stroke="#e8b848" stroke-width="1.5"/></svg>',
  trophy: '<svg viewBox="0 0 32 32"><path d="M9 4h14v7a7 7 0 0 1-14 0z" fill="#e8b848" stroke="#8a611a" stroke-width=".8"/><path d="M9 6H5a4 4 0 0 0 5 6M23 6h4a4 4 0 0 1-5 6" fill="none" stroke="#e8b848" stroke-width="1.5"/><rect x="14.5" y="17" width="3" height="6" fill="#c99a35"/><rect x="10" y="23" width="12" height="5" rx="1" fill="#2a1d08" stroke="#e8b848"/></svg>',
  lipstick: '<svg viewBox="0 0 32 32"><rect x="11" y="16" width="10" height="14" rx="1.5" fill="#c99a35" stroke="#7a5512" stroke-width=".8"/><rect x="12.5" y="10" width="7" height="7" fill="#e3c06a"/><path d="M12.5 10V5l7-3v8z" fill="#b0102a"/><path d="M13.5 9V5.5l2-1V9" fill="#ff6b80" opacity=".6"/></svg>',
  perfume: '<svg viewBox="0 0 32 32"><rect x="13" y="3" width="6" height="6" rx="1" fill="#c99a35"/><rect x="7" y="9" width="18" height="20" rx="4" fill="#f2c56a" fill-opacity=".55" stroke="#e8b848" stroke-width="1.2"/><rect x="10" y="14" width="12" height="7" rx="1" fill="#1a1206"/><path d="M10 11h4" stroke="#fff" stroke-width="1" opacity=".7"/></svg>',
  earring: '<svg viewBox="0 0 32 32"><path d="M16 2a4 4 0 1 1 0 8" fill="none" stroke="#e8b848" stroke-width="2"/><path d="M16 10v4" stroke="#e8b848" stroke-width="1.5"/><path d="M16 14l6 7-6 9-6-9z" fill="#bfe7ff" stroke="#e8f6ff" stroke-width=".7"/><path d="M10 21h12M16 14v16" stroke="#fff" stroke-width=".5" opacity=".7"/></svg>',
  tag: '<svg viewBox="0 0 32 32"><path d="M4 9h17l7 7-7 7H4z" fill="#f2c94c" stroke="#5a4210" stroke-width="1"/><circle cx="22" cy="16" r="1.8" fill="#1a1206"/><path d="M8 13h9M8 16h9M8 19h6" stroke="#1a1206" stroke-width="1.3"/></svg>',
  envelope: '<svg viewBox="0 0 32 32"><rect x="3" y="8" width="26" height="17" rx="1.5" fill="#efe4c8" stroke="#a8812e" stroke-width="1"/><path d="M3 9l13 9 13-9" fill="none" stroke="#a8812e" stroke-width="1"/><circle cx="16" cy="18" r="2.6" fill="#b0102a"/></svg>',
  ring: '<svg viewBox="0 0 32 32"><defs><radialGradient id="dg" cx=".4" cy=".35"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#bfe7ff"/><stop offset="1" stop-color="#6aa9d8"/></radialGradient></defs><ellipse cx="16" cy="21" rx="9" ry="7" fill="none" stroke="#d9a63a" stroke-width="3"/><ellipse cx="16" cy="21" rx="9" ry="7" fill="none" stroke="#ffe39a" stroke-width="1" opacity=".7"/><path d="M10 12l3-5h6l3 5-6 6z" fill="url(#dg)" stroke="#e8f6ff" stroke-width=".7"/><path d="M13 7l3 11 3-11M10 12h12" stroke="#ffffff" stroke-width=".5" opacity=".7"/></svg>',
  pearls: '<svg viewBox="0 0 32 32"><g fill="#f5efe4" stroke="#bfb4a2" stroke-width=".4">' + [[4,6],[6,11],[9,15.5],[12.5,18.5],[16,19.5],[19.5,18.5],[23,15.5],[26,11],[28,6]].map(([x,y]) => '<circle cx="'+x+'" cy="'+y+'" r="2.1"/>').join("") + '</g><circle cx="16" cy="24.5" r="3.2" fill="#ffffff" stroke="#d9a63a" stroke-width="1"/></svg>',
  watch: '<svg viewBox="0 0 32 32"><rect x="12" y="2" width="8" height="7" rx="2" fill="#b8862b"/><rect x="12" y="23" width="8" height="7" rx="2" fill="#b8862b"/><circle cx="16" cy="16" r="8.5" fill="#f3d27a" stroke="#8a611a" stroke-width="1.5"/><circle cx="16" cy="16" r="6.3" fill="#fbf4e0"/><path d="M16 16V11.5M16 16l3 2" stroke="#3a2a10" stroke-width="1.2" stroke-linecap="round"/></svg>',
  brooch: '<svg viewBox="0 0 32 32"><path d="M16 3l3.2 6.6 7.3 1-5.3 5.1 1.3 7.2L16 19.5 9.5 22.9l1.3-7.2L5.5 10.6l7.3-1z" fill="#e8b848" stroke="#8a611a" stroke-width=".8"/><circle cx="16" cy="13.8" r="4" fill="#c0102a" stroke="#ffb3c0" stroke-width=".6"/><circle cx="14.8" cy="12.6" r="1.1" fill="#fff" opacity=".7"/></svg>',
  key: '<svg viewBox="0 0 32 32"><circle cx="9" cy="16" r="6" fill="none" stroke="#e8b848" stroke-width="3"/><path d="M15 16h14M25 16v5M21 16v4" stroke="#e8b848" stroke-width="3" stroke-linecap="round"/><path d="M15 15h14" stroke="#fff3c4" stroke-width=".8" opacity=".7"/></svg>',
};
