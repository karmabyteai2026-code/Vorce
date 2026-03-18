import { useState, useEffect } from "react";

var BG = "#080810";
var CARD = "#0E0E1A";
var LIGHT = "#13131F";
var BORDER = "#1E1E30";
var BLUE = "#4F6EF7";
var BLUE_DIM = "#2A3A8A";
var BLUE_GLOW = "rgba(79,110,247,0.15)";
var WHITE = "#F0F0FF";
var DIM = "#8888AA";
var MUTED = "#44445A";
var GREEN = "#2ECC8A";
var RED = "#E05555";
var YELLOW = "#F7C44F";

var CATS = [
  { id: "money", icon: "💰", label: "Money & Finance", color: "#F7C44F", desc: "Bills, refunds, insurance, loans", list: ["Dispute a medical bill", "Challenge insurance denial", "Negotiate a refund", "Dispute credit card charge", "Challenge bank fees", "Request debt forgiveness"] },
  { id: "work", icon: "💼", label: "Work & Career", color: "#4F6EF7", desc: "Salary, contracts, unfair treatment", list: ["Negotiate a salary raise", "Respond to unfair review", "Request flexible working", "Challenge wrongful dismissal", "Ask for a promotion", "Negotiate job offer"] },
  { id: "legal", icon: "⚖️", label: "Legal & Rights", color: "#E05555", desc: "Landlords, disputes, demand letters", list: ["Challenge unfair eviction", "Write a legal demand letter", "Dispute contract terms", "Challenge a parking fine", "Report a business", "Respond to legal threat"] },
  { id: "biz", icon: "🚀", label: "Business & Sales", color: "#2ECC8A", desc: "Pitches, proposals, client disputes", list: ["Pitch to an investor", "Win a contract proposal", "Handle difficult client", "Raise your prices", "Chase unpaid invoice", "Respond to negative review"] },
  { id: "personal", icon: "🤝", label: "Personal & Social", color: "#B44FF7", desc: "Difficult conversations, boundaries", list: ["Set a boundary firmly", "Address a conflict", "Decline without burning bridges", "Confront someone fairly", "Repair a relationship", "Ask for an apology"] },
  { id: "health", icon: "🏥", label: "Health & Medical", color: "#4FD1F7", desc: "Doctors, insurers, second opinions", list: ["Request a second opinion", "Challenge a diagnosis", "Dispute medical charges", "Advocate for better care", "Request medical records", "Escalate ignored symptoms"] },
];

var PLANS = [
  { id: "personal", name: "Personal", mo: 19, yr: 182, tag: "For individuals navigating hard moments.", features: ["20 situations/month", "All categories", "Email & letter formats", "Copy & download", "Basic tone control"], paystackUrl: "https://paystack.shop/pay/vorce-personal" },
  { id: "pro", name: "Professional", mo: 79, yr: 758, badge: "Most popular", tag: "For freelancers and small business owners.", features: ["Unlimited situations", "All categories", "Advanced tone & format", "Follow-up sequences", "Save history", "Priority generation"], paystackUrl: "https://paystack.shop/pay/vorce-professional" },
  { id: "business", name: "Business", mo: 199, yr: 1910, tag: "For growing teams.", features: ["Everything in Pro", "5 team seats", "Brand voice training", "CRM-ready exports", "API access", "Dedicated onboarding"], paystackUrl: "https://paystack.shop/pay/vorce-business" },
];

var PAYSTACK_KEY = "pk_live_aeca5e435625d6885b49d2625aff660c97492d87";

function Styles() {
  useEffect(function() {
    var el = document.createElement("style");
    el.id = "v-styles";
    el.textContent = "@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');\n*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}\nbody{background:" + BG + ";color:" + WHITE + ";font-family:'Outfit',sans-serif;-webkit-font-smoothing:antialiased}\ninput,textarea,button,select{font-family:'Outfit',sans-serif}\ninput::placeholder,textarea::placeholder{color:" + MUTED + "}\n::-webkit-scrollbar{width:4px}\n::-webkit-scrollbar-thumb{background:" + BORDER + ";border-radius:2px}\n@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes toast{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}";
    if (!document.getElementById("v-styles")) document.head.appendChild(el);
    return function() { try { var s = document.getElementById("v-styles"); if (s) s.parentNode.removeChild(s); } catch(e) {} };
  }, []);
  return null;
}

function Btn(p) {
  var hov = useState(false);
  var isH = hov[0]; var setH = hov[1];
  var bg = p.danger ? (isH ? "#c04" : RED) : p.ghost ? "transparent" : p.disabled ? BLUE_DIM : isH ? "#6B84F9" : BLUE;
  var bd = p.ghost ? "1px solid " + (isH ? BLUE : BORDER) : p.danger ? "1px solid " + RED : "1px solid transparent";
  var col = p.ghost ? (isH ? BLUE : DIM) : WHITE;
  return (
    <button onClick={p.onClick} disabled={p.disabled} onMouseEnter={function() { setH(true); }} onMouseLeave={function() { setH(false); }} style={{ background: bg, border: bd, color: col, fontSize: p.sm ? "12px" : "14px", fontWeight: 500, padding: p.sm ? "7px 13px" : "12px 22px", borderRadius: "8px", cursor: p.disabled ? "not-allowed" : "pointer", width: p.full ? "100%" : "auto", opacity: p.disabled ? 0.45 : 1, boxShadow: !p.ghost && !p.danger && isH && !p.disabled ? "0 0 24px rgba(79,110,247,0.3)" : "none", transition: "all 160ms ease" }}>
      {p.children}
    </button>
  );
}

function Input(p) {
  var foc = useState(false);
  var isF = foc[0]; var setF = foc[1];
  var base = { background: LIGHT, border: "1px solid " + (p.err ? RED : isF ? BLUE : BORDER), borderRadius: "8px", color: WHITE, fontSize: "14px", lineHeight: "1.6", outline: "none", padding: "12px 14px", width: "100%", transition: "border-color 160ms", boxShadow: isF && !p.err ? "0 0 0 3px " + BLUE_GLOW : "none" };
  return (
    <div>
      {p.label && <div style={{ fontSize: "11px", color: DIM, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "5px" }}>{p.label}</div>}
      {p.multi ? <textarea value={p.value} onChange={p.onChange} placeholder={p.ph} rows={p.rows || 4} onFocus={function() { setF(true); }} onBlur={function() { setF(false); }} style={{ ...base, resize: "vertical" }} /> : <input type={p.type || "text"} value={p.value} onChange={p.onChange} placeholder={p.ph} onFocus={function() { setF(true); }} onBlur={function() { setF(false); }} style={base} />}
      {p.err && <div style={{ fontSize: "12px", color: RED, marginTop: "4px" }}>{p.err}</div>}
      {p.hint && !p.err && <div style={{ fontSize: "11px", color: MUTED, marginTop: "4px" }}>{p.hint}</div>}
    </div>
  );
}

function Card(p) {
  return <div onClick={p.onClick} style={{ background: CARD, border: "1px solid " + BORDER, borderRadius: "12px", padding: p.pad || "24px", boxShadow: p.glow ? "0 0 40px " + BLUE_GLOW : "none", cursor: p.onClick ? "pointer" : "auto", ...(p.style || {}) }}>{p.children}</div>;
}

function Tag(p) {
  var c