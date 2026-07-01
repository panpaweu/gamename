import { useState } from "react";

// --- Word banks ---
const global = {
  prefixes: ["Aether","Axion","Bane","Blaze","Boreal","Cipher","Crest","Dusk","Ember","Epoch","Feral","Flux","Forge","Gale","Glyph","Haze","Helix","Inert","Jade","Kaon","Kilo","Lumen","Lynx","Mire","Monad","Nexus","Nimbus","Onyx","Orca","Prism","Pulse","Quasar","Rune","Sable","Seraph","Shard","Solar","Sparx","Talon","Thorn","Umbra","Valor","Velox","Warp","Xenon","Zeal","Zeta","Cobalt","Ivory","Slate"],
  suffixes: ["ark","ax","born","burst","claw","core","craft","cry","cut","dale","draw","drive","edge","fall","fang","field","fire","flight","fold","forge","form","gate","glow","grip","grove","guard","hunt","keep","lance","lash","light","line","lock","lore","mark","mind","mont","path","peak","pulse","reach","ridge","rift","rush","scale","seek","set","shade","shift","shore","sight","sign","skill","span","spire","split","storm","stride","strike","surge","swift","tide","track","trail","turn","vault","veil","ward","wave","weave","well","wild","wind","wing","wire","wit","wolf","word","wrath","zone"],
};

const polish = {
  roots: ["Bor","Brzask","Burzyn","Cien","Chorąg","Czuw","Gniew","Grom","Gród","Herb","Jar","Jasn","Kielich","Kir","Kmit","Kord","Koron","Kresow","Kriw","Krzep","Lechn","Lew","Mglist","Mgław","Miecz","Mir","Mrok","Pancern","Piorun","Plomien","Pomst","Radost","Rycerz","Seraf","Skał","Sław","Srebrn","Stal","Strasz","Świt","Tarcz","Wicher","Wieczn","Wierch","Wojn","Wróżb","Zagład","Zar","Zbaw","Zbroyn","Złom","Zmierzch","Zorz","Żar"],
  endings: ["ad","ar","aw","aż","bor","cław","gród","jaw","mir","rad","sław","wit","woj","zar","ek","ał","och","ost","yst","ań","eń","ień","ów","ąg","ęd"],
};

const suffixNums = ["77","99","404","007","1337","2049","420","666","000","X","XL","Pro","Max","Jr","II","III"];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function toLeet(s) {
  return s.replace(/a/gi,"4").replace(/e/gi,"3").replace(/i/gi,"1").replace(/o/gi,"0").replace(/s/gi,"5").replace(/t/gi,"7");
}

function forceFirstLetter(nick, letter) {
  if (!letter) return nick;
  if (nick.toUpperCase().startsWith(letter)) return nick;
  // Replace first character with the desired letter (preserve rest)
  return letter + nick.slice(1);
}

function genGlobal(letter) {
  for (let i = 0; i < 60; i++) {
    const nick = pick(global.prefixes) + pick(global.suffixes);
    if (!letter || nick.toUpperCase().startsWith(letter)) return nick;
  }
  return forceFirstLetter(pick(global.prefixes) + pick(global.suffixes), letter);
}

function genLeet(letter) {
  for (let i = 0; i < 60; i++) {
    const base = pick(global.prefixes) + pick(global.suffixes);
    const nick = toLeet(base);
    if (!letter || nick.toUpperCase().startsWith(letter)) return nick;
  }
  return forceFirstLetter(toLeet(pick(global.prefixes) + pick(global.suffixes)), letter);
}

function genPolish(letter) {
  for (let i = 0; i < 60; i++) {
    const nick = pick(polish.roots) + pick(polish.endings);
    if (!letter || nick.toUpperCase().startsWith(letter)) return nick;
  }
  return forceFirstLetter(pick(polish.roots) + pick(polish.endings), letter);
}

const styles = [
  { label: "Klasyczny", polish: false, gen: (l) => genGlobal(l) },
  { label: "Leet",      polish: false, gen: (l) => genLeet(l) },
  { label: "Polski",    polish: true,  gen: (l) => genPolish(l) },
];

const LETTERS = ["Dowolna", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

function generateThree(styleFn, letter, history) {
  const banned = new Set(history.map(n => n.toLowerCase()));
  const results = [];
  let attempts = 0;
  while (results.length < 3 && attempts < 60) {
    const nick = styleFn(letter === "Dowolna" ? null : letter);
    if (!banned.has(nick.toLowerCase()) && !results.includes(nick)) {
      results.push(nick);
    }
    attempts++;
  }
  // fallback: fill without uniqueness check
  while (results.length < 3) {
    results.push(styleFn(letter === "Dowolna" ? null : letter));
  }
  return results;
}

export default function NicknameGenerator() {
  const [proposals, setProposals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState("Dowolna");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const style = styles[selectedStyle];
    const results = generateThree(style.gen, selectedLetter, history);
    setProposals(results);
    setSelected(null);
    setCopied(false);
    setHistory(prev => [...results, ...prev].slice(0, 30));
  }

  function copyToClipboard(nick) {
    navigator.clipboard.writeText(nick).then(() => {
      setCopied(nick);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const btnBase = {
    fontFamily: "'Courier New', monospace",
    cursor: "pointer",
    textTransform: "uppercase",
    transition: "all 0.2s",
    letterSpacing: "0.15em",
  };

  const isPolish = styles[selectedStyle].polish;
  const accent = isPolish ? "#e8c84a" : "#00ff64";
  const accentFaint = isPolish ? "rgba(232,200,74," : "rgba(0,255,100,";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${accentFaint}0.03) 1px, transparent 1px), linear-gradient(90deg, ${accentFaint}0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none", transition: "all 0.4s",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        pointerEvents: "none",
      }} />

      {["topLeft","topRight","bottomLeft","bottomRight"].map(pos => (
        <div key={pos} style={{
          position: "absolute",
          top: pos.includes("top") ? 20 : "auto",
          bottom: pos.includes("bottom") ? 20 : "auto",
          left: pos.includes("Left") ? 20 : "auto",
          right: pos.includes("Right") ? 20 : "auto",
          width: 40, height: 40,
          borderTop: pos.includes("top") ? `2px solid ${accent}` : "none",
          borderBottom: pos.includes("bottom") ? `2px solid ${accent}` : "none",
          borderLeft: pos.includes("Left") ? `2px solid ${accent}` : "none",
          borderRight: pos.includes("Right") ? `2px solid ${accent}` : "none",
          opacity: 0.4, transition: "border-color 0.3s",
        }} />
      ))}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28, position: "relative" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.4em", color: accent, opacity: 0.7, marginBottom: 8, textTransform: "uppercase", transition: "color 0.3s" }}>
          &gt; v5.0 initialized_
        </div>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "0.05em", textShadow: `0 0 30px ${accentFaint}0.4)` }}>
          GAME<span style={{ color: accent, transition: "color 0.3s" }}>NAME</span>
        </h1>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", letterSpacing: "0.25em", marginTop: 3 }}>
          GENERATOR NICKOW GAMINGOWYCH
        </div>
      </div>

      {/* Style selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10, justifyContent: "center", maxWidth: 620 }}>
        {styles.map((s, i) => {
          const active = selectedStyle === i;
          const pl = s.polish;
          const col = pl ? "#e8c84a" : "#00ff64";
          const colFaint = pl ? "rgba(232,200,74," : "rgba(0,255,100,";
          return (
            <button key={i} onClick={() => { setSelectedStyle(i); setProposals([]); }} style={{
              ...btnBase,
              padding: "6px 14px",
              background: active ? col : "transparent",
              border: `1px solid ${active ? col : colFaint + "0.25)"}`,
              color: active ? "#0a0a0f" : colFaint + "0.7)",
              fontSize: 11,
              fontWeight: active ? 700 : 400,
            }}>
              {s.label}
            </button>
          );
        })}
      </div>

      <div style={{ height: 20, marginBottom: 16 }} />

      {/* Letter picker */}
      <div style={{ marginBottom: 24, textAlign: "center", maxWidth: 620 }}>
        <div style={{ fontSize: 10, color: `${accentFaint}0.4)`, letterSpacing: "0.35em", marginBottom: 10 }}>
          &gt; PIERWSZA LITERA_
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center" }}>
          {LETTERS.map(l => (
            <button key={l} onClick={() => setSelectedLetter(l)} style={{
              ...btnBase,
              padding: l === "Dowolna" ? "5px 10px" : "5px 8px",
              minWidth: l === "Dowolna" ? 70 : 30,
              background: selectedLetter === l ? accent : "transparent",
              border: `1px solid ${selectedLetter === l ? accent : accentFaint + "0.18)"}`,
              color: selectedLetter === l ? "#0a0a0f" : accentFaint + "0.55)",
              fontSize: 11,
              fontWeight: selectedLetter === l ? 700 : 400,
            }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Generate button */}
      <button onClick={generate} style={{
        ...btnBase,
        padding: "13px 40px",
        background: accent,
        border: "none",
        color: "#0a0a0f",
        fontSize: 14,
        fontWeight: 700,
        boxShadow: `0 0 20px ${accentFaint}0.35)`,
        marginBottom: 32,
        transition: "all 0.3s",
      }}>
        [ GENERUJ ]
      </button>

      {/* 3 proposals */}
      {proposals.length > 0 && (
        <div style={{ width: "100%", maxWidth: 560, marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: `${accentFaint}0.4)`, letterSpacing: "0.35em", marginBottom: 14, textAlign: "center" }}>
            &gt; PROPOZYCJE_
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {proposals.map((nick, i) => {
              const isSelected = selected === i;
              const isCopied = copied === nick;
              return (
                <div key={i} style={{
                  border: `1px solid ${isSelected ? accent : accentFaint + "0.18)"}`,
                  padding: "16px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: isSelected ? `${accentFaint}0.06)` : `${accentFaint}0.02)`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                onClick={() => setSelected(isSelected ? null : i)}
                >
                  {[{t:-3,l:-3},{t:-3,r:-3},{b:-3,l:-3},{b:-3,r:-3}].map((c,ci) => (
                    <div key={ci} style={{ position:"absolute", top:c.t, bottom:c.b, left:c.l, right:c.r, width:6, height:6, background: isSelected ? accent : `${accentFaint}0.3)`, transition: "all 0.2s" }} />
                  ))}
                  <div style={{
                    fontSize: "clamp(20px, 4vw, 30px)",
                    fontWeight: 900,
                    color: isSelected ? accent : `${accentFaint}0.65)`,
                    letterSpacing: "0.04em",
                    textShadow: isSelected ? `0 0 16px ${accentFaint}0.5)` : "none",
                    transition: "all 0.2s",
                  }}>
                    {nick}
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); copyToClipboard(nick); }}
                    style={{
                      ...btnBase,
                      padding: "6px 14px",
                      background: "transparent",
                      border: `1px solid ${isCopied ? accent : accentFaint + "0.25)"}`,
                      color: isCopied ? accent : `${accentFaint}0.5)`,
                      fontSize: 10,
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {isCopied ? "✓ SKOPIOWANO" : "KOPIUJ"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 3 && (
        <div style={{ maxWidth: 560, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.35em", marginBottom: 10 }}>
            &gt; HISTORIA_
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {history.slice(3).map((n, i) => (
              <div key={i} style={{
                padding: "4px 10px",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.2)",
                fontSize: 11,
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'Courier New', monospace",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = `${accentFaint}0.7)`; e.currentTarget.style.borderColor = `${accentFaint}0.25)`; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: "absolute", bottom: 16, fontSize: 10, color: "rgba(255,255,255,0.08)", letterSpacing: "0.3em" }}>
        GAMENAME_SYS &gt; READY
      </div>
    </div>
  );
}
