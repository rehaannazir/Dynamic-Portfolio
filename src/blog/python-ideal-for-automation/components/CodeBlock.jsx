import { memo, useState } from "react";
import { Check, Copy } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   PYTHON SYNTAX HIGHLIGHTER
───────────────────────────────────────────────────────── */
const KW = new Set([
  "import","from","as","def","class","return","if","else","elif","for","while",
  "in","not","and","or","True","False","None","with","try","except","finally",
  "raise","lambda","yield","async","await","pass","break","continue","global",
  "nonlocal","del","is","self","super",
]);
const BT = new Set([
  "print","len","range","enumerate","zip","map","filter","list","dict","set",
  "tuple","str","int","float","bool","open","sorted","reversed","sum","min",
  "max","any","all","hasattr","getattr","isinstance","type","vars","input",
  "format","next","iter","abs","round","repr","id","hex",
]);

function pyTokens(code) {
  const out = [];
  let i = 0;
  while (i < code.length) {
    if (code[i] === "#") {
      let j = i; while (j < code.length && code[j] !== "\n") j++;
      out.push({ t: "comment", v: code.slice(i, j) }); i = j; continue;
    }
    const isTriple = (q) => code.slice(i, i + 3) === q.repeat(3);
    if ((code[i] === '"' || code[i] === "'") && isTriple(code[i])) {
      const q = code[i].repeat(3); let j = i + 3;
      while (j < code.length && code.slice(j, j + 3) !== q) j++;
      out.push({ t: "string", v: code.slice(i, j + 3) }); i = j + 3; continue;
    }
    if ((code[i] === "f" || code[i] === "r" || code[i] === "b") &&
        (code[i+1] === '"' || code[i+1] === "'")) {
      const q = code[i+1]; let j = i + 2;
      while (j < code.length && !(code[j] === q && code[j-1] !== "\\")) j++;
      out.push({ t: "string", v: code.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i]; let j = i + 1;
      while (j < code.length && !(code[j] === q && code[j-1] !== "\\")) j++;
      out.push({ t: "string", v: code.slice(i, j + 1) }); i = j + 1; continue;
    }
    if (/[0-9]/.test(code[i])) {
      let j = i; while (j < code.length && /[0-9._x]/.test(code[j])) j++;
      out.push({ t: "number", v: code.slice(i, j) }); i = j; continue;
    }
    if (code[i] === "@") {
      let j = i + 1; while (j < code.length && /[a-zA-Z0-9_.]/.test(code[j])) j++;
      out.push({ t: "decorator", v: code.slice(i, j) }); i = j; continue;
    }
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i; while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const w = code.slice(i, j), isCall = code[j] === "(";
      let t = KW.has(w) ? "kw" : BT.has(w) ? "bt" : isCall ? "fn" : "plain";
      out.push({ t, v: w }); i = j; continue;
    }
    out.push({ t: "op", v: code[i] }); i++;
  }
  return out;
}

const TC = {
  kw: "#f472b6", bt: "#38bdf8", fn: "#60a5fa",
  string: "#86efac", comment: "#94a3b8", number: "#fb923c",
  decorator: "#c084fc", op: "#64748b", plain: "#e2e8f0",
};

function HLLine({ line }) {
  return <>{pyTokens(line).map((tk, i) => (
    <span key={i} style={{ color: TC[tk.t] || TC.plain }}>{tk.v}</span>
  ))}</>;
}

/* ─────────────────────────────────────────────────────────
   VS CODE BLOCK
───────────────────────────────────────────────────────── */
export const CodeBlock = memo(function CodeBlock({ code, filename, note, lang = "python" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  const lines = code.split("\n");
  return (
    <div className="my-8 rounded-2xl overflow-hidden not-prose" style={{
      background: "#0d1117",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 0 0 1px rgba(99,102,241,0.08),0 24px 64px -16px rgba(0,0,0,0.9)",
    }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.055)",
      }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          {filename && <span className="mono text-xs text-slate-400">{filename}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-[10px] px-2 py-0.5 rounded" style={{
            background: "rgba(99,102,241,0.14)", color: "#818cf8",
            border: "1px solid rgba(99,102,241,0.2)",
          }}>{lang.toUpperCase()}</span>
          <button onClick={copy} className="flex items-center gap-1.5 mono text-xs transition-colors" style={{ color: copied ? "#34d399" : "#94a3b8" }}>
            {copied ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}
          </button>
        </div>
      </div>
      {note && (
        <div className="px-4 py-1.5 mono text-[11px] italic" style={{
          color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}>// {note}</div>
      )}
      <div className="overflow-x-auto">
        <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed" }}>
          <colgroup><col style={{ width: "3rem" }} /><col /></colgroup>
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} style={{ transition: "background 0.12s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td className="mono text-xs text-right select-none"
                  style={{ color: "#94a3b8", padding: "1px 14px 1px 16px", verticalAlign: "top", userSelect: "none" }}>
                  {idx + 1}
                </td>
                <td className="mono text-xs pr-8" style={{ padding: "1px 32px 1px 0", lineHeight: "1.75" }}>
                  {lang === "python" ? <HLLine line={line} /> : <span style={{ color: "#e2e8f0" }}>{line}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
