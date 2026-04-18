import { useState, useEffect, useRef } from "react";

const DP = "#3c2f6e";
const MP = "#7b6bbf";
const SP = "#b3aade";
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#d4c9f0,#f5c4b3)",
  "linear-gradient(135deg,#c8e6d4,#b5d4f4)",
  "linear-gradient(135deg,#f4c0d1,#faeeda)",
  "linear-gradient(135deg,#9fe1cb,#d4c9f0)",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Inter',sans-serif;}
  .vp{min-height:100vh;background:linear-gradient(135deg,#fce4d6 0%,#f0e8f8 35%,#e8f0fb 65%,#dff0eb 100%);}
  .topnav{display:flex;align-items:center;justify-content:space-between;padding:18px 36px;border-bottom:1px solid rgba(124,107,191,0.12);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);position:sticky;top:0;z-index:100;}
  .logo-mark{display:flex;align-items:baseline;gap:6px;cursor:pointer;}
  .logo-serif{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:400;color:${DP};letter-spacing:-0.5px;}
  .logo-dot{width:6px;height:6px;border-radius:50%;background:${MP};margin-bottom:4px;}
  .nav-links{display:flex;gap:24px;align-items:center;}
  .nav-link{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${MP};cursor:pointer;border:none;background:none;font-family:'Inter',sans-serif;transition:color 0.2s;padding:4px 0;}
  .nav-link:hover,.nav-link.active{color:${DP};border-bottom:1px solid ${DP};}
  .div-line{width:1px;height:14px;background:${SP};opacity:0.4;}
  .orb-row{display:flex;align-items:center;gap:7px;font-size:10px;color:${MP};letter-spacing:1px;text-transform:uppercase;}
  .orb{width:8px;height:8px;border-radius:50%;background:#6ec8a4;animation:breathe 2.5s ease-in-out infinite;}
  @keyframes breathe{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.45;transform:scale(0.8)}}
  .gc{background:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.75);border-radius:20px;backdrop-filter:blur(6px);}
  .eyebrow{font-size:10px;letter-spacing:2px;color:${MP};text-transform:uppercase;margin-bottom:14px;}
  .btn-p{padding:10px 20px;background:linear-gradient(135deg,${MP},#9b8ed8);border:none;border-radius:12px;color:white;font-size:13px;font-family:'Inter',sans-serif;cursor:pointer;transition:opacity 0.15s;}
  .btn-p:hover{opacity:0.87;}
  .btn-g{padding:10px 20px;background:rgba(255,255,255,0.65);border:1px solid rgba(124,107,191,0.28);border-radius:12px;color:${MP};font-size:13px;font-family:'Inter',sans-serif;cursor:pointer;transition:background 0.15s;}
  .btn-g:hover{background:rgba(255,255,255,0.9);}

  .dash-wrap{padding:32px 36px;}
  .dash-title{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:300;color:${DP};line-height:1.1;}
  .dash-sub{font-size:13px;color:${MP};margin-top:6px;margin-bottom:28px;}
  .patient-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(255px,1fr));gap:16px;}
  .pc{padding:22px;cursor:pointer;transition:transform 0.15s,border-color 0.15s;}
  .pc:hover{transform:translateY(-2px);border-color:rgba(124,107,191,0.45);}
  .pc-top{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
  .pc-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:20px;color:${DP};border:1.5px solid rgba(124,107,191,0.3);flex-shrink:0;}
  .pc-name{font-family:'Cormorant Garamond',serif;font-size:18px;color:${DP};font-weight:400;}
  .pc-room{font-size:11px;color:${MP};margin-top:2px;}
  .pc-status{display:flex;align-items:center;gap:7px;padding:8px 12px;background:rgba(124,107,191,0.07);border-radius:10px;margin-bottom:14px;}
  .pc-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .pc-status-text{font-size:12px;color:${DP};}
  .pc-meta{display:flex;justify-content:space-between;}
  .pc-meta-val{font-family:'Cormorant Garamond',serif;font-size:22px;color:${DP};font-weight:300;text-align:center;}
  .pc-meta-label{font-size:10px;color:${MP};letter-spacing:0.5px;margin-top:1px;text-align:center;}
  .add-card{padding:22px;border:1.5px dashed rgba(124,107,191,0.3);border-radius:20px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:180px;transition:border-color 0.15s,background 0.15s;}
  .add-card:hover{border-color:rgba(124,107,191,0.55);background:rgba(255,255,255,0.4);}
  .add-circle{width:40px;height:40px;border-radius:50%;border:1.5px solid rgba(124,107,191,0.4);display:flex;align-items:center;justify-content:center;}

  .modal-bg{position:fixed;inset:0;background:rgba(40,30,80,0.35);display:flex;align-items:center;justify-content:center;z-index:200;backdrop-filter:blur(4px);}
  .modal-box{background:rgba(253,248,244,0.97);border-radius:24px;padding:32px;width:420px;border:1px solid rgba(255,255,255,0.8);}
  .modal-title{font-family:'Cormorant Garamond',serif;font-size:26px;color:${DP};margin-bottom:6px;}
  .modal-sub{font-size:13px;color:${MP};margin-bottom:24px;}
  .field-label{font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:${MP};margin-bottom:6px;}
  .field-input{width:100%;padding:10px 14px;border:1px solid rgba(124,107,191,0.3);border-radius:12px;font-size:14px;color:${DP};background:rgba(255,255,255,0.8);font-family:'Inter',sans-serif;outline:none;margin-bottom:16px;}
  .field-input:focus{border-color:${MP};}
  .modal-btns{display:flex;gap:10px;margin-top:8px;}

  .detail-wrap{padding:0 36px 40px;}
  .breadcrumb{display:flex;align-items:center;gap:8px;padding:16px 0 18px;font-size:12px;color:${MP};}
  .bc-link{cursor:pointer;transition:color 0.15s;}
  .bc-link:hover{color:${DP};}
  .detail-grid{display:grid;grid-template-columns:196px 1fr 254px;gap:20px;}

  .left-rail{display:flex;flex-direction:column;padding-top:2px;}
  .rail-av-wrap{display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:22px;}
  .rail-av{width:50px;height:50px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',serif;font-size:21px;color:${DP};border:1.5px solid rgba(124,107,191,0.3);}
  .rail-name{font-family:'Cormorant Garamond',serif;font-size:15px;color:${DP};text-align:center;}
  .rail-room{font-size:11px;color:${MP};text-align:center;}
  .rail-nav{display:flex;flex-direction:column;gap:3px;}
  .rail-item{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:10px;cursor:pointer;font-size:13px;color:${MP};transition:background 0.15s;}
  .rail-item:hover{background:rgba(124,107,191,0.1);color:${DP};}
  .rail-item.active{background:rgba(124,107,191,0.15);color:${DP};font-weight:500;}

  .cam-section{display:flex;flex-direction:column;gap:14px;}
  .cam-frame{border-radius:26px;overflow:hidden;background:linear-gradient(160deg,#1a1624,#0e1020);position:relative;min-height:310px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(124,107,191,0.2);}
  .arch{position:absolute;width:126px;height:164px;border:1.5px solid rgba(180,170,222,0.4);border-radius:63px 63px 0 0;top:50%;left:50%;transform:translate(-50%,-55%);}
  .scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(180,170,222,0.5),transparent);animation:scan 3s ease-in-out infinite;}
  @keyframes scan{0%{top:15%;opacity:0}20%{opacity:1}80%{opacity:1}100%{top:85%;opacity:0}}
  .face-lm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:20px;}
  .eye-row-lm{display:flex;gap:26px;}
  .eye-dot-lm{width:12px;height:7px;border-radius:99px;background:rgba(180,170,222,0.7);}
  .mouth-lm{width:10px;height:4px;border-radius:99px;background:rgba(180,170,222,0.35);}
  .cam-label{position:absolute;bottom:13px;left:17px;font-size:10px;letter-spacing:2px;color:rgba(200,190,240,0.45);text-transform:uppercase;}
  .rec-wrap{position:absolute;top:13px;right:17px;display:flex;align-items:center;gap:5px;}
  .rec-dot{width:6px;height:6px;border-radius:50%;background:#f4867e;animation:breathe 1.2s infinite;}
  .rec-text{font-size:10px;color:rgba(200,190,240,0.45);letter-spacing:1.5px;}
  .state-hero{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;background:rgba(255,255,255,0.55);border-radius:18px;border:1px solid rgba(255,255,255,0.7);}
  .sh-title{font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:300;color:${DP};line-height:1;}
  .sh-sub{font-size:12px;color:${SP};margin-top:4px;}
  .conf-label-row{display:flex;justify-content:space-between;font-size:11px;color:${MP};margin-bottom:4px;margin-top:12px;}
  .track{height:4px;background:rgba(124,107,191,0.15);border-radius:99px;overflow:hidden;width:145px;}
  .track-fill{height:100%;border-radius:99px;background:linear-gradient(90deg,${SP},${MP});transition:width 0.5s ease;}
  .stable-badge{padding:5px 13px;background:rgba(110,200,164,0.15);border:1px solid rgba(110,200,164,0.35);border-radius:99px;font-size:11px;color:#2d8a63;}
  .cam-controls{display:flex;gap:10px;}

  .right-rail{display:flex;flex-direction:column;gap:14px;padding-top:2px;}
  .ev-list{display:flex;flex-direction:column;gap:9px;}
  .ev-item{display:flex;align-items:flex-start;gap:9px;}
  .ev-pip{width:6px;height:6px;border-radius:50%;margin-top:4px;flex-shrink:0;}
  .ev-body{font-size:12px;color:${DP};line-height:1.4;}
  .ev-time{font-size:11px;color:${MP};}
  .sr{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(124,107,191,0.1);}
  .sr:last-child{border-bottom:none;}
  .sr-name{font-size:12px;color:${DP};}
  .sr-val{font-size:12px;color:${MP};}
  .tgl{width:33px;height:18px;border-radius:99px;background:linear-gradient(135deg,${MP},#9b8ed8);position:relative;cursor:pointer;flex-shrink:0;}
  .tgl-k{width:14px;height:14px;border-radius:50%;background:white;position:absolute;right:2px;top:2px;}

  .chat-page{padding:0 36px 40px;}
  .chat-grid{display:grid;grid-template-columns:1fr 268px;gap:20px;}
  .chat-box{display:flex;flex-direction:column;border-radius:20px;overflow:hidden;}
  .chat-hdr{padding:15px 20px;border-bottom:1px solid rgba(124,107,191,0.1);display:flex;align-items:center;justify-content:space-between;}
  .chat-title{font-family:'Cormorant Garamond',serif;font-size:20px;color:${DP};}
  .online-chip{font-size:11px;color:#3d7a5c;background:rgba(110,200,164,0.15);border:1px solid rgba(110,200,164,0.3);padding:3px 10px;border-radius:99px;}
  .msgs{flex:1;padding:18px 20px;display:flex;flex-direction:column;gap:12px;overflow-y:auto;max-height:370px;min-height:260px;}
  .msg-w{display:flex;flex-direction:column;}
  .msg-w.us{align-items:flex-end;}
  .msg-w.them,.msg-w.ai{align-items:flex-start;}
  .bubble{padding:10px 14px;border-radius:16px;font-size:13px;line-height:1.55;max-width:78%;}
  .bubble.us{background:linear-gradient(135deg,${MP},#9b8ed8);color:white;border-bottom-right-radius:4px;}
  .bubble.them{background:rgba(255,255,255,0.82);color:${DP};border-bottom-left-radius:4px;border:1px solid rgba(124,107,191,0.15);}
  .bubble.ai{background:rgba(240,236,255,0.75);color:${DP};border-bottom-left-radius:4px;border:1px solid rgba(124,107,191,0.2);}
  .bub-meta{font-size:10px;color:${SP};margin-top:3px;}
  .typing-bubble{display:flex;gap:4px;padding:10px 14px;background:rgba(255,255,255,0.82);border-radius:16px;border-bottom-left-radius:4px;border:1px solid rgba(124,107,191,0.15);}
  .td{width:6px;height:6px;border-radius:50%;background:${SP};animation:tdot 1.2s infinite;}
  .td:nth-child(2){animation-delay:0.2s;}.td:nth-child(3){animation-delay:0.4s;}
  @keyframes tdot{0%,100%{transform:translateY(0);opacity:0.5}50%{transform:translateY(-4px);opacity:1}}
  .chips-label{font-size:10px;letter-spacing:1.5px;color:${MP};padding:0 20px 6px;text-transform:uppercase;display:flex;align-items:center;gap:5px;}
  .chips-row{display:flex;gap:7px;padding:0 20px 12px;flex-wrap:wrap;}
  .chip{padding:5px 12px;border-radius:99px;border:1px solid rgba(124,107,191,0.3);background:rgba(255,255,255,0.6);font-size:12px;color:${MP};cursor:pointer;transition:all 0.12s;font-family:'Inter',sans-serif;}
  .chip:hover{background:rgba(124,107,191,0.12);color:${DP};}
  .input-row{border-top:1px solid rgba(124,107,191,0.1);padding:12px 18px;display:flex;gap:9px;align-items:center;}
  .msg-inp{flex:1;border:1px solid rgba(124,107,191,0.25);border-radius:12px;padding:9px 13px;font-size:13px;background:rgba(255,255,255,0.7);color:${DP};font-family:'Inter',sans-serif;outline:none;}
  .msg-inp::placeholder{color:${SP};}
  .send-btn{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,${MP},#9b8ed8);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity 0.15s;}
  .send-btn:disabled{opacity:0.4;cursor:not-allowed;}
  .alert-banner{margin:0 0 16px;padding:14px 20px;background:rgba(255,255,255,0.6);border:1px solid rgba(110,200,164,0.4);border-radius:16px;display:flex;align-items:center;justify-content:space-between;}
  .ab-inner{display:flex;align-items:center;gap:12px;}
  .ab-glyph{width:36px;height:36px;border-radius:50%;background:rgba(110,200,164,0.2);border:1px solid rgba(110,200,164,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ab-title{font-family:'Cormorant Garamond',serif;font-size:17px;color:${DP};}
  .ab-sub{font-size:12px;color:#3d7a5c;margin-top:2px;}
  .btn-join{padding:9px 20px;background:linear-gradient(135deg,#5db88a,#3d9e6e);border:none;border-radius:11px;color:white;font-size:13px;font-family:'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
  .si{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(124,107,191,0.1);}
  .si:last-child{border-bottom:none;}
  .si-label{font-size:12px;color:${MP};}
  .si-val{font-size:12px;color:${DP};font-weight:500;}
  .si-val.green{color:#2d8a63;}
  .tl-row{display:flex;align-items:center;gap:8px;padding:6px 0;}
  .tl-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
  .tl-label{font-size:12px;color:${DP};}
  .tl-time{font-size:11px;color:${MP};margin-left:auto;}
`;

const INIT_PATIENTS = [
  {
    id:"p1",name:"George P.",room:"Room 1",ward:"ICU",state:"eyes_open",confidence:88,alertsToday:3,monitoringSince:"9:00 AM",gradIdx:0,
    events:[
      {type:"alert",text:"Alert sent to family",time:"6:00 PM"},
      {type:"open",text:"Eyes open detected",time:"6:00 PM"},
      {type:"closed",text:"Eyes closed — resting",time:"5:48 PM"},
      {type:"open",text:"Eyes open detected",time:"5:44 PM"},
    ],
    messages:[
      {from:"them",text:"System detected eye movement — looks like they're waking up.",time:"Caregiver · 6:00 PM"},
      {from:"us",text:"We're on our way! Can you let them know?",time:"You · 6:00 PM"},
      {from:"them",text:"Of course. They look calm and comfortable.",time:"Caregiver · 6:01 PM"},
    ],
    timeline:[
      {color:"#6ec8a4",label:"Eyes open",time:"6:00 PM"},
      {color:"#b3aade",label:"Resting",time:"4:20 PM"},
      {color:"#6ec8a4",label:"Eyes open",time:"1:45 PM"},
    ],
  },
  {
    id:"p2",name:"Eleanor M.",room:"Room 4",ward:"Neuro",state:"eyes_closed",confidence:94,alertsToday:1,monitoringSince:"11:30 AM",gradIdx:1,
    events:[
      {type:"open",text:"Eyes open detected",time:"2:15 PM"},
      {type:"closed",text:"Eyes closed — resting",time:"2:22 PM"},
    ],
    messages:[
      {from:"them",text:"Eleanor is resting comfortably right now.",time:"Caregiver · 2:22 PM"},
    ],
    timeline:[
      {color:"#b3aade",label:"Resting",time:"2:22 PM"},
      {color:"#6ec8a4",label:"Eyes open",time:"2:15 PM"},
    ],
  },
  {
    id:"p3",name:"Thomas R.",room:"Room 7",ward:"General",state:"eyes_open",confidence:76,alertsToday:5,monitoringSince:"8:00 AM",gradIdx:2,
    events:[
      {type:"alert",text:"Alert sent to family",time:"5:30 PM"},
      {type:"open",text:"Eyes open detected",time:"5:30 PM"},
      {type:"closed",text:"Eyes closed — resting",time:"4:55 PM"},
    ],
    messages:[],
    timeline:[
      {color:"#6ec8a4",label:"Eyes open",time:"5:30 PM"},
      {color:"#b3aade",label:"Resting",time:"4:55 PM"},
      {color:"#6ec8a4",label:"Eyes open",time:"3:10 PM"},
    ],
  },
];

const SUGGESTIONS = ["We're here with you.", "We love you so much.", "We're coming soon.", "You're doing great."];

function nowStr() {
  return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
}

async function callClaude(history) {
  const apiMsgs = history.map(m => ({
    role: m.from === "us" ? "user" : "assistant",
    content: m.text,
  }));
  if (apiMsgs.length === 0) return "I'm here with you.";
  if (apiMsgs[apiMsgs.length - 1].role === "assistant") {
    apiMsgs.push({ role: "user", content: "Please continue." });
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a compassionate AI assistant in Vigil, a patient monitoring app for families of ICU patients. Help family members send warm, brief, supportive messages. Keep every reply to 1–3 sentences. Be gentle and human. You are responding on behalf of the care team or as a supportive voice.",
      messages: apiMsgs,
    }),
  });
  const data = await res.json();
  return data.content?.map(b => b.text || "").join("") || "I'm here with you.";
}

function AddModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [ward, setWard] = useState("");
  function submit() {
    if (!name.trim()) return;
    onAdd({ id:"p"+Date.now(), name:name.trim(), room:room.trim()||"Room —", ward:ward.trim()||"General",
      state:"eyes_closed", confidence:0, alertsToday:0, monitoringSince:nowStr(),
      gradIdx:Math.floor(Math.random()*4), events:[], messages:[], timeline:[] });
    onClose();
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-title">Add patient</div>
        <div className="modal-sub">Enter details to begin monitoring.</div>
        <div className="field-label">Full name</div>
        <input className="field-input" placeholder="e.g. Margaret Chen" value={name} onChange={e=>setName(e.target.value)} autoFocus />
        <div className="field-label">Room number</div>
        <input className="field-input" placeholder="e.g. Room 12" value={room} onChange={e=>setRoom(e.target.value)} />
        <div className="field-label">Ward</div>
        <input className="field-input" placeholder="e.g. ICU, Neurology" value={ward} onChange={e=>setWard(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} />
        <div className="modal-btns">
          <button className="btn-p" style={{flex:1}} onClick={submit}>Add patient</button>
          <button className="btn-g" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ patients, onSelect, onAdd }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="dash-wrap">
      <div className="dash-title">Patient rooms</div>
      <div className="dash-sub">{patients.length} {patients.length===1?"patient":"patients"} currently monitored</div>
      <div className="patient-grid">
        {patients.map(p => (
          <div key={p.id} className="gc pc" onClick={()=>onSelect(p.id)}>
            <div className="pc-top">
              <div className="pc-avatar" style={{background:AVATAR_GRADIENTS[p.gradIdx]}}>{p.name.charAt(0)}</div>
              <div>
                <div className="pc-name">{p.name}</div>
                <div className="pc-room">{p.room} · {p.ward}</div>
              </div>
            </div>
            <div className="pc-status">
              <div className="pc-dot" style={{background:p.state==="eyes_open"?"#6ec8a4":SP}} />
              <div className="pc-status-text">{p.state==="eyes_open"?"Eyes open — alert sent":"Resting"}</div>
              {p.state==="eyes_open"&&<div className="orb" style={{marginLeft:"auto"}}/>}
            </div>
            <div className="pc-meta">
              <div><div className="pc-meta-val">{p.alertsToday}</div><div className="pc-meta-label">Alerts</div></div>
              <div><div className="pc-meta-val">{p.confidence}%</div><div className="pc-meta-label">Confidence</div></div>
              <div><div className="pc-meta-val">{p.monitoringSince}</div><div className="pc-meta-label">Since</div></div>
            </div>
          </div>
        ))}
        <div className="add-card" onClick={()=>setShowModal(true)}>
          <div className="add-circle">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke={MP} strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{fontSize:13,color:MP}}>Add new patient</div>
        </div>
      </div>
      {showModal && <AddModal onAdd={onAdd} onClose={()=>setShowModal(false)} />}
    </div>
  );
}

function MonitorView({ patient }) {
  return (
    <div className="detail-grid">
      <div className="left-rail">
        <div className="rail-av-wrap">
          <div className="rail-av" style={{background:AVATAR_GRADIENTS[patient.gradIdx]}}>{patient.name.charAt(0)}</div>
          <div className="rail-name">{patient.name}</div>
          <div className="rail-room">{patient.room} · {patient.ward}</div>
        </div>
        <div className="rail-nav">
          {["Monitor","Notifications","Timeline","Settings"].map((item,i)=>(
            <div key={item} className={`rail-item${i===0?" active":""}`}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.1"/></svg>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="cam-section">
        <div className="cam-frame">
          <div className="arch"/>
          <div className="scan-line" style={{top:"30%"}}/>
          <div className="face-lm">
            <div className="eye-row-lm"><div className="eye-dot-lm"/><div className="eye-dot-lm"/></div>
            <div className="mouth-lm"/>
          </div>
          <div className="cam-label">FACE DETECTED · {patient.room.toUpperCase()}</div>
          <div className="rec-wrap"><div className="rec-dot"/><span className="rec-text">LIVE</span></div>
        </div>
        <div className="state-hero">
          <div>
            <div className="eyebrow" style={{marginBottom:4}}>Eye state</div>
            <div className="sh-title">{patient.state==="eyes_open"?"Eyes open":"Eyes closed"}</div>
            <div className="sh-sub">{patient.state==="eyes_open"?"Stable for 4.2 seconds":"Resting peacefully"}</div>
            <div className="conf-label-row"><span>Confidence</span><span>{patient.confidence}%</span></div>
            <div className="track"><div className="track-fill" style={{width:`${patient.confidence}%`}}/></div>
          </div>
          {patient.state==="eyes_open"&&<div className="stable-badge">Stable signal</div>}
        </div>
        <div className="cam-controls">
          <button className="btn-p">Pause monitoring</button>
          <button className="btn-g">Settings</button>
        </div>
      </div>

      <div className="right-rail">
        <div className="gc" style={{padding:18}}>
          <div className="eyebrow">Recent events</div>
          <div className="ev-list">
            {patient.events.length===0&&<div style={{fontSize:12,color:SP}}>No events yet.</div>}
            {patient.events.map((e,i)=>(
              <div key={i} className="ev-item">
                <div className="ev-pip" style={{background:e.type==="open"?"#6ec8a4":e.type==="alert"?"#f4867e":SP}}/>
                <div><div className="ev-body">{e.text}</div><div className="ev-time">{e.time}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div className="gc" style={{padding:18}}>
          <div className="eyebrow">Detection settings</div>
          {[{label:"Alert threshold",val:"3 sec"},{label:"Cooldown window",val:"5 min"},
            {label:"Notify family",val:<div className="tgl"><div className="tgl-k"/></div>},
            {label:"AI suggestions",val:<div className="tgl"><div className="tgl-k"/></div>}
          ].map((s,i)=>(
            <div key={i} className="sr">
              <span className="sr-name">{s.label}</span>
              {typeof s.val==="string"?<span className="sr-val">{s.val}</span>:s.val}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatView({ patient, onUpdateMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsEnd = useRef(null);

  useEffect(()=>{ msgsEnd.current?.scrollIntoView({behavior:"smooth"}); },[patient.messages,loading]);

  async function send(text) {
    const t = text.trim();
    if (!t || loading) return;
    setInput("");
    const userMsg = {from:"us",text:t,time:`You · ${nowStr()}`};
    const updated = [...patient.messages, userMsg];
    onUpdateMessages(patient.id, updated);
    setLoading(true);
    try {
      const reply = await callClaude(updated);
      onUpdateMessages(patient.id, [...updated, {from:"ai",text:reply,time:`Vigil AI · ${nowStr()}`}]);
    } catch {
      onUpdateMessages(patient.id, [...updated, {from:"ai",text:"Something went wrong. Please try again.",time:`Vigil AI · ${nowStr()}`}]);
    }
    setLoading(false);
  }

  return (
    <div className="chat-page">
      {patient.state==="eyes_open"&&(
        <div className="alert-banner">
          <div className="ab-inner">
            <div className="ab-glyph">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#5db88a" strokeWidth="1.2"/>
                <path d="M4.5 7l2 2 3.5-3.5" stroke="#5db88a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="ab-title">Eyes open detected — {nowStr()}</div>
              <div className="ab-sub">Your loved one may be awake and looking for you</div>
            </div>
          </div>
          <button className="btn-join">Start video call</button>
        </div>
      )}
      <div className="chat-grid">
        <div className="gc chat-box">
          <div className="chat-hdr">
            <span className="chat-title">{patient.name} — family chat</span>
            <span className="online-chip">AI assistant online</span>
          </div>
          <div className="msgs">
            {patient.messages.length===0&&(
              <div style={{fontSize:13,color:SP,textAlign:"center",marginTop:40,fontStyle:"italic"}}>
                No messages yet. Say hello below.
              </div>
            )}
            {patient.messages.map((m,i)=>(
              <div key={i} className={`msg-w ${m.from}`}>
                <div className={`bubble ${m.from}`}>{m.text}</div>
                <div className="bub-meta">{m.time}</div>
              </div>
            ))}
            {loading&&(
              <div className="msg-w them">
                <div className="typing-bubble">
                  <div className="td"/><div className="td"/><div className="td"/>
                </div>
              </div>
            )}
            <div ref={msgsEnd}/>
          </div>
          <div className="chips-label">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="#b3aade" strokeWidth="1"/>
              <path d="M3 5h4M5 3v4" stroke="#b3aade" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            AI-suggested
          </div>
          <div className="chips-row">
            {SUGGESTIONS.map((s,i)=>(
              <button key={i} className="chip" onClick={()=>send(s)} disabled={loading}>{s}</button>
            ))}
          </div>
          <div className="input-row">
            <input className="msg-inp" placeholder="Send a message..." value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&send(input)}
              disabled={loading}/>
            <button className="send-btn" onClick={()=>send(input)} disabled={loading||!input.trim()}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M12 1L5.5 7.5M12 1L8 12L5.5 7.5M12 1L1 5L5.5 7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="gc" style={{padding:18}}>
            <div className="eyebrow">Patient</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <div style={{width:42,height:42,borderRadius:"50%",background:AVATAR_GRADIENTS[patient.gradIdx],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:DP,border:"1.5px solid rgba(124,107,191,0.3)",flexShrink:0}}>
                {patient.name.charAt(0)}
              </div>
              <div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:DP}}>{patient.name}</div>
                <div style={{fontSize:11,color:MP}}>{patient.room} · {patient.ward}</div>
              </div>
            </div>
            {[
              {label:"Eye state",val:patient.state==="eyes_open"?"Open":"Closed",green:patient.state==="eyes_open"},
              {label:"Alerts today",val:String(patient.alertsToday)},
              {label:"Monitoring since",val:patient.monitoringSince},
            ].map((s,i)=>(
              <div key={i} className="si">
                <span className="si-label">{s.label}</span>
                <span className={`si-val${s.green?" green":""}`}>{s.val}</span>
              </div>
            ))}
          </div>
          <div className="gc" style={{padding:18}}>
            <div className="eyebrow">Today's timeline</div>
            {patient.timeline.length===0&&<div style={{fontSize:12,color:SP}}>No events yet.</div>}
            {patient.timeline.map((t,i)=>(
              <div key={i} className="tl-row">
                <div className="tl-dot" style={{background:t.color}}/>
                <span className="tl-label">{t.label}</span>
                <span className="tl-time">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Vigil() {
  const [patients, setPatients] = useState(INIT_PATIENTS);
  const [selectedId, setSelectedId] = useState(null);
  const [tab, setTab] = useState("monitor");
  const selected = patients.find(p=>p.id===selectedId);
  const awake = patients.filter(p=>p.state==="eyes_open").length;

  function addPatient(p) { setPatients(prev=>[...prev,p]); }
  function updateMessages(id, messages) { setPatients(prev=>prev.map(p=>p.id===id?{...p,messages}:p)); }

  function goHome() { setSelectedId(null); setTab("monitor"); }

  return (
    <>
      <style>{css}</style>
      <div className="vp">
        <nav className="topnav">
          <div className="logo-mark" onClick={goHome}>
            <div className="logo-dot"/>
            <span className="logo-serif">Vigil</span>
          </div>
          <div className="nav-links">
            {selectedId && <>
              <button className={`nav-link${tab==="monitor"?" active":""}`} onClick={()=>setTab("monitor")}>Monitor</button>
              <div className="div-line"/>
              <button className={`nav-link${tab==="chat"?" active":""}`} onClick={()=>setTab("chat")}>Family chat</button>
              <div className="div-line"/>
            </>}
            <button className={`nav-link${!selectedId?" active":""}`} onClick={goHome}>All patients</button>
          </div>
          <div className="orb-row">
            {awake>0&&<div className="orb"/>}
            <span>{awake>0?`${awake} awake`:`${patients.length} monitored`}</span>
          </div>
        </nav>

        {!selectedId && (
          <Dashboard patients={patients} onSelect={id=>{setSelectedId(id);setTab("monitor");}} onAdd={addPatient}/>
        )}

        {selectedId && selected && (
          <div className="detail-wrap">
            <div className="breadcrumb">
              <span className="bc-link" onClick={goHome}>All patients</span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l4 3.5-4 3.5" stroke={SP} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{color:DP}}>{selected.name}</span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 2l4 3.5-4 3.5" stroke={SP} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{color:MP}}>{tab==="monitor"?"Monitor":"Family chat"}</span>
            </div>
            {tab==="monitor" ? <MonitorView patient={selected}/> : <ChatView patient={selected} onUpdateMessages={updateMessages}/>}
          </div>
        )}
      </div>
    </>
  );
}