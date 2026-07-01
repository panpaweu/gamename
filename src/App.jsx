import { useState } from "react";

const styles = [
  {
    label: "Klasyczny",
    polish: false,
    desc: "a single merged word, no spaces, no numbers",
    inspiration: "Draw inspiration from linguistics, science, nature, music, philosophy, invented words, the Bible and Christian tradition (saints, angels, biblical figures, sacred concepts — e.g. Seraph, Lazarus, Ezra, Elijah, Covenant, Sanctum, Elara), or any world culture. Avoid references to demons, pagan deities, or dark occult figures.",
  },
  {
    label: "Leet",
    polish: false,
    desc: "a word using leet speak substitutions (a->4, e->3, i->1, o->0, s->5, t->7)",
    inspiration: "Draw inspiration from linguistics, science, nature, music, philosophy, invented words, the Bible and Christian tradition (saints, angels, biblical figures, sacred concepts — e.g. Seraph, Lazarus, Ezra, Elijah, Covenant, Sanctum, Elara), or any world culture. Avoid references to demons, pagan deities, or dark occult figures.",
  },
  {
    label: "Polski",
    polish: true,
    desc: "a single Polish word or Polish-sounding name (no underscore, no numbers)",
    inspiration: `The nickname MUST be an invented Polish-sounding word — NOT a real name, not a real surname, not a place. It should feel like it could exist in Polish but doesn't quite. Be poetic, evocative, even slightly archaic or mythical in feel.

Draw creative inspiration from these CONCEPTS and WORD ELEMENTS (do not copy them literally — use them as raw material to invent something new):
- Polish word roots and suffixes: -mir, -slaw, -rad, -wit, -bor, -claw, -gniew, -mar, -woj, -ziel, -brzask, -zmierzch, -swit, -grzmot, -plomien, -cien, -blask, -wicher, -zar, -kresy
- Christian and Biblical concepts rendered in Polish phonetics: zbawca, swiatlo, korona, kielich, relikwia, pielgrzym, wiecznosc, laski, aniol, serafin, cherubin, chwala, milosc, odkupienie
- Medieval Polish spirit: chorągiew, pancerz, miecz, tarcza, rycerstwo, herbowy, grod, warownia, baszta, zbrojny, konny, straza
- Nature and atmosphere with Slavic soul: brzask (dawn), zmierzch (dusk), plomien (flame), wicher (gale), zar (heat), cien (shadow), grzmot (thunder), swit (daybreak), burza (storm), mgla (mist), zorza (aurora)

Rules:
- Invent a new word — do NOT use any existing Polish first name, surname, or place name
- 6–14 characters
- Should sound cool spoken aloud in Polish
- Can blend two root elements creatively (e.g. Borzwit, Mglamir, Switslaw, Plomierad)
- Do NOT use pagan gods, demons, or occult references
- No geographic names`,
  },
];

const LETTERS = ["Dowolna", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function NicknameGenerator() {
  const [proposals, setProposals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState("Dowolna");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate() {
    if (loading) return;
    setLoading(true);
    setCopied(false);
    setError(null);
    setProposals([]);
    setSelected(null);

    const style = styles[selectedStyle];
    const letterInstruction = selectedLetter !== "Dowolna"
      ? `Every nickname MUST start with the letter "${selectedLetter}".`
      : "";

    const historyInstruction = history.length > 0
      ? `IMPORTANT: You have already generated these nicknames — do NOT repeat or closely resemble any of them: ${history.join(", ")}.`
      : "";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 120,
          system: `You are a creative gaming nickname generator. Generate exactly 3 unique, original gaming nicknames that do NOT resemble overused gaming nicknames like Shadow, Dark, Wolf, Dragon, Viper, Reaper, Ghost, Storm, Phoenix, Ninja, Blade, Raven, Hunter, Titan, Wraith, Specter.

${style.inspiration}

${historyInstruction}

Each nickname must be:
- 6-16 characters
- Memorable and easy to type
- Original, not already famous in gaming culture
- In the style: ${style.desc}
- Different from the other two proposals
${letterInstruction}

Reply with ONLY the 3 nicknames, one per line, nothing else. No numbers, no bullets, no explanation.`,
          messages: [{ role: "user", content: "Generate 3 nicknames." }],
        }),
      });

      const data = await res.json();
      const text = data.content?.[0]?.text?.trim() || "";
      const results = text.split("\n").map(l => l.trim()).filter(Boolean).slice(0, 3);
      if (results.length === 0) throw new Error("No results");
      setProposals(results);
      setHistory(prev => [...results, ...prev].slice(0, 30));
    } catch (e) {
      setError("Generowanie nie powiodlo sie. Sprobuj ponownie.");
    } finally {
      setLoading(false);
    }
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
          &gt; AI-powered v4.0 initialized_
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
            <button key={i} onClick={() => setSelectedStyle(i)} style={{
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

      {/* Polish hint */}
      <div style={{ height: 20, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isPolish && (
          <div style={{ fontSize: 10, color: `${accentFaint}0.5)`, letterSpacing: "0.2em" }}>
            historia / biblia / tradycja chrzescijanska
          </div>
        )}
      </div>

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
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        boxShadow: `0 0 20px ${accentFaint}0.35)`,
        marginBottom: 32,
        transition: "all 0.3s",
      }}>
        {loading ? "GENERUJE..." : "[ GENERUJ ]"}
      </button>

      {/* Error */}
      {error && (
        <div style={{ fontSize: 11, color: "rgba(255,80,80,0.8)", marginBottom: 16, letterSpacing: "0.15em" }}>{error}</div>
      )}

      {/* 3 proposals */}
      {(loading || proposals.length > 0) && (
        <div style={{ width: "100%", maxWidth: 560, marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: `${accentFaint}0.4)`, letterSpacing: "0.35em", marginBottom: 14, textAlign: "center" }}>
            &gt; PROPOZYCJE_
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {loading
              ? [0,1,2].map(i => (
                  <div key={i} style={{
                    border: `1px solid ${accentFaint}0.1)`,
                    padding: "18px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: `${accentFaint}0.02)`,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ height: 24, width: `${140 + i * 30}px`, background: `${accentFaint}0.08)`, borderRadius: 2 }} />
                  </div>
                ))
              : proposals.map((nick, i) => {
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
                      {/* corner dots */}
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
                })
            }
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
        GAMENAME_SYS &gt; AI MODE ACTIVE
      </div>
    </div>
  );
}
