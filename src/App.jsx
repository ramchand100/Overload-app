import { useState, useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { useData } from './useData'
import { TI } from './icons'
import { MiniGraph } from './components/MiniGraph'
import { WeightChart } from './components/WeightChart'
import { CalendarView } from './components/CalendarView'
import { WheelPicker } from './components/WheelPicker'
import { exportHistoryPdf } from './exportHistoryPdf'

/* ── Contextual line ── */
const CtxLine = ({ text, orange }) => (
  <div className={orange ? 'ctx-orange u1' : 'ctx-line u1'}>{text}</div>
)

/* ── CSS ── */
const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#FAFAFA;--white:#FFFFFF;--surface:#F2F2F2;--surface2:#E5E5E5;
    --ink:#1A1A1A;--ink2:#4A4A4A;--ink3:#909090;--ink4:#C0C0C0;
    --border:#E0E0E0;--border2:#CECECE;--ch:#2C2C2C;
    --orange:#E8500A;--orange-l:#FEF0EC;--orange-m:#F9C5B5;
    --green:#2D7A3A;--green-l:#EAF5EC;--green-m:#A8D9AD;
    --sh:0 1px 6px rgba(0,0,0,.05),0 2px 14px rgba(0,0,0,.04);
    --sh-md:0 2px 12px rgba(0,0,0,.08),0 4px 24px rgba(0,0,0,.05);
  }
  body{background:var(--bg);color:var(--ink);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased}
  .app{max-width:390px;margin:0 auto;height:100vh;height:100dvh;background:var(--bg);display:flex;flex-direction:column;overflow:hidden}
  @keyframes up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-50px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastOut{0%{opacity:1;transform:translate(-50%,0)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-10px)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .u0{animation:up .3s ease both}.u1{animation:up .3s .06s ease both}.u2{animation:up .3s .12s ease both}
  .u3{animation:up .3s .18s ease both}.u4{animation:up .3s .24s ease both}
  .topbar{padding:16px 20px 0;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
  .back-btn{width:34px;height:34px;border-radius:50%;background:var(--surface);border:none;display:flex;align-items:center;justify-content:center;font-size:15px;cursor:pointer;color:var(--ink);font-family:'Inter',sans-serif;font-weight:600}
  .brand{font-size:19px;font-weight:800;letter-spacing:-.5px;color:var(--ch)}
  .streak-btn{display:flex;align-items:center;gap:5px;background:var(--surface);border:none;border-radius:20px;padding:7px 13px;cursor:pointer;font-family:'Inter',sans-serif}
  .streak-num{font-size:15px;font-weight:800;color:var(--ch)}
  .lbl{font-size:11px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:1.4px;margin-bottom:8px}
  .ob-prog{padding:0 20px;margin-top:14px;flex-shrink:0}
  .ob-track{height:3px;background:var(--border);border-radius:2px;overflow:hidden}
  .ob-fill{height:100%;background:var(--ch);border-radius:2px;transition:width .35s ease}
  .btn-p{width:100%;padding:16px;background:var(--ch);color:white;border:none;border-radius:100px;font-size:15px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer;transition:transform .1s,opacity .1s}
  .btn-p:active{transform:scale(.98)}.btn-p:disabled{opacity:.22;cursor:not-allowed}
  .btn-o{width:100%;padding:14px;background:transparent;color:var(--ink2);border:1.5px solid var(--border2);border-radius:100px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer}
  .toast{position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--green);color:white;border-radius:100px;padding:10px 20px;font-size:13px;font-weight:700;font-family:'Inter',sans-serif;z-index:999;white-space:nowrap;box-shadow:var(--sh-md);animation:slideDown .3s ease both,toastOut .3s 2.3s ease forwards}
  /* Loading */
  .loading-screen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:var(--white)}
  .spinner{width:40px;height:40px;border:3px solid var(--border);border-top-color:var(--ch);border-radius:50%;animation:spin .8s linear infinite}
  .loading-text{font-size:14px;color:var(--ink3);font-weight:500}
  /* Auth screen */
  .auth-screen{flex:1;display:flex;flex-direction:column;background:var(--white)}
  .auth-hero{flex:1;display:flex;flex-direction:column;justify-content:center;padding:40px 32px}
  .auth-logo{font-size:44px;font-weight:900;letter-spacing:-2px;color:var(--ch);margin-bottom:8px}
  .auth-tagline{font-size:16px;color:var(--ink3);font-weight:500;margin-bottom:48px}
  .auth-btns{display:flex;flex-direction:column;gap:12px;padding:0 32px 48px}
  .google-btn{width:100%;padding:15px;background:var(--white);color:var(--ch);border:1.5px solid var(--border2);border-radius:100px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:var(--sh)}
  .email-form{display:flex;flex-direction:column;gap:10px}
  .auth-input{width:100%;padding:14px 16px;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;font-size:15px;font-family:'Inter',sans-serif;color:var(--ch);outline:none}
  .auth-input:focus{border-color:var(--ch)}
  .auth-toggle{text-align:center;font-size:13px;color:var(--ink3);cursor:pointer}
  .auth-toggle span{color:var(--ch);font-weight:600}
  .auth-error{font-size:13px;color:#cc3333;text-align:center;padding:4px 0}
  /* SPLASH */
  .splash{flex:1;display:flex;flex-direction:column;background:var(--white)}
  .splash-space{flex:1}
  .splash-bottom{padding:20px 24px 48px;display:flex;flex-direction:column;gap:12px}
  .splash-title{font-size:32px;font-weight:800;letter-spacing:-.6px;line-height:1.15;color:var(--ch)}
  .splash-sub{font-size:15px;color:var(--ink3);line-height:1.6}
  .splash-si{text-align:center;font-size:13px;color:var(--ink3)}
  .splash-si span{color:var(--ch);font-weight:600;cursor:pointer;text-decoration:underline}
  /* OB */
  .ob-info-pg{flex:1;display:flex;flex-direction:column;padding:28px 24px 0}
  .ob-info-top{flex:1;display:flex;flex-direction:column;justify-content:center;gap:22px}
  .ob-info-bottom{padding:22px 0 44px;display:flex;flex-direction:column;gap:10px}
  .ob-q{font-size:28px;font-weight:800;line-height:1.15;letter-spacing:-.5px;color:var(--ch)}
  .ob-body{font-size:15px;color:var(--ink2);line-height:1.75}.ob-body b{color:var(--ch);font-weight:700}
  .bar-visual{display:flex;align-items:flex-end;gap:8px;height:80px;justify-content:center}
  .bv-bar{border-radius:6px 6px 0 0;background:var(--ch);opacity:.12}.bv-bar.hi{opacity:1}
  .chart2{display:flex;flex-direction:column;gap:10px;width:100%}
  .c2-row{display:flex;align-items:center;gap:10px}
  .c2-lbl{font-size:11px;font-weight:600;color:var(--ink3);width:80px;line-height:1.3}
  .c2-wrap{flex:1;height:9px;background:var(--surface);border-radius:4px;overflow:hidden}
  .c2-bar{height:100%;border-radius:4px}
  .c2-val{font-size:12px;font-weight:700;width:32px;text-align:right}
  .bridge-pg{flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:40px 24px 48px}
  .bridge-title{font-size:32px;font-weight:800;letter-spacing:-.6px;line-height:1.15;color:var(--ch);margin-bottom:12px}
  .bridge-sub{font-size:15px;color:var(--ink3);line-height:1.65}
  .ob-pg{flex:1;display:flex;flex-direction:column;overflow:hidden;padding:20px 20px 0}
  .ob-pg-scroll{flex:1;overflow-y:auto;min-height:0;margin-top:20px}
  .ob-pg-scroll::-webkit-scrollbar{display:none}
  .ob-pg-bottom{padding:16px 0 44px;flex-shrink:0}
  .unit-toggle{display:flex;background:var(--surface);border-radius:100px;padding:4px;gap:2px;width:fit-content;margin:0 auto}
  .unit-opt{padding:8px 20px;border-radius:100px;font-size:13px;font-weight:700;color:var(--ink3);cursor:pointer;transition:all .15s}
  .unit-opt.on{background:var(--white);color:var(--ch);box-shadow:var(--sh)}
  .thanks-ring{width:140px;height:140px;border-radius:50%;background:radial-gradient(circle,rgba(232,80,10,.18) 0%,rgba(45,122,58,.1) 60%,transparent 75%);display:flex;align-items:center;justify-content:center;margin:0 auto 24px}
  .thanks-ring-inner{font-size:56px}
  .freq-list{display:flex;flex-direction:column;gap:10px}
  .freq-opt{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:18px 20px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:14px;box-shadow:var(--sh)}
  .freq-opt.on{background:var(--ch);border-color:var(--ch)}
  .freq-dots{display:flex;gap:4px;flex-shrink:0}
  .freq-dot{width:9px;height:9px;border-radius:50%;background:var(--border2)}
  .freq-opt.on .freq-dot{background:rgba(255,255,255,.45)}
  .freq-title{font-size:16px;font-weight:700;color:var(--ch);transition:color .15s}
  .freq-opt.on .freq-title{color:white}
  .freq-sub{font-size:12px;color:var(--ink3);margin-top:2px;transition:color .15s}
  .freq-opt.on .freq-sub{color:rgba(255,255,255,.5)}
  .split-list{display:flex;flex-direction:column;gap:9px}
  .split-opt{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:15px 17px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:12px;box-shadow:var(--sh)}
  .split-opt.on{background:var(--ch);border-color:var(--ch)}
  .split-emoji{font-size:24px;flex-shrink:0}
  .split-name{font-size:15px;font-weight:700;color:var(--ch);transition:color .15s}
  .split-opt.on .split-name{color:white}
  .split-desc{font-size:12px;color:var(--ink3);margin-top:2px;transition:color .15s}
  .split-opt.on .split-desc{color:rgba(255,255,255,.5)}
  .split-chk{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all .18s;flex-shrink:0;margin-left:auto}
  .split-opt.on .split-chk{background:white;border-color:white;color:var(--ch)}
  .q-opt{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:15px 17px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:12px;box-shadow:var(--sh)}
  .q-opt.on{background:var(--ch);border-color:var(--ch)}
  .q-opt-emoji{font-size:22px;flex-shrink:0}
  .q-opt-label{flex:1;font-size:15px;font-weight:700;color:var(--ch);transition:color .15s}
  .q-opt.on .q-opt-label{color:white}
  .q-opt-radio{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .q-opt-radio-dot{width:11px;height:11px;border-radius:50%;background:transparent}
  .q-opt.on .q-opt-radio{border-color:white}
  .q-opt.on .q-opt-radio-dot{background:white}
  .ex-sel-list{display:flex;flex-direction:column;gap:7px}
  .ex-opt{background:var(--white);border:1.5px solid var(--border);border-radius:13px;padding:13px 16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:10px;box-shadow:var(--sh)}
  .ex-opt.on{background:var(--ch);border-color:var(--ch)}
  .ex-opt-name{flex:1;font-size:14px;font-weight:600;color:var(--ch);transition:color .15s;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ex-opt.on .ex-opt-name{color:white}
  .ex-opt-chk{width:20px;height:20px;border-radius:6px;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:10px;color:transparent;transition:all .18s;flex-shrink:0}
  .ex-opt.on .ex-opt-chk{background:white;border-color:white;color:var(--ch)}
  /* TAB BAR */
  .tab-bar{background:var(--white);border-top:1px solid var(--border);display:flex;padding:8px 12px 22px;gap:4px;flex-shrink:0}
  .tab-item{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:8px 6px;border-radius:14px;transition:background .15s;border:none;background:transparent;font-family:'Inter',sans-serif}
  .tab-item.on{background:var(--surface)}
  .tab-icon{color:var(--ink3);transition:color .15s;display:flex}
  .tab-item.on .tab-icon{color:var(--ch)}
  .tab-label{font-size:11px;font-weight:500;color:var(--ink3);letter-spacing:-.1px}
  .tab-item.on .tab-label{color:var(--ch);font-weight:700}
  /* HOME */
  .home-scroll{flex:1;overflow-y:auto;padding:14px 18px 24px;display:flex;flex-direction:column;gap:10px}
  .home-scroll::-webkit-scrollbar{display:none}
  .ws-days{display:flex;gap:4px;padding:2px 0}
  .ws-day{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer}
  .ws-day:active{opacity:.7}
  .ws-day-name{font-size:9px;font-weight:600;color:var(--ink3);text-transform:uppercase;letter-spacing:.3px}
  .ws-ring-wrap{width:38px;height:38px;position:relative;display:flex;align-items:center;justify-content:center}
  .ws-ring-svg{position:absolute;inset:0}
  .ws-ring-inner{z-index:1;display:flex;align-items:center;justify-content:center}
  .ws-date-num{font-size:11px;font-weight:700}
  .ws-sess-lbl{font-size:8px;font-weight:700;text-align:center;max-width:38px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  .ctx-line{font-size:12px;color:var(--ink3);padding:2px 2px;font-weight:500}
  .ctx-orange{font-size:12px;color:var(--orange);padding:2px 2px;font-weight:600}
  .past-day-banner{background:var(--surface);border-radius:12px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between}
  .pdb-text{font-size:13px;font-weight:600;color:var(--ink2)}
  .pdb-back{background:none;border:none;font-size:12px;font-weight:600;color:var(--orange);cursor:pointer;font-family:'Inter',sans-serif}
  .empty-state{background:var(--white);border:1.5px dashed var(--border2);border-radius:16px;padding:24px 20px;text-align:center}
  .empty-state-icon{font-size:32px;margin-bottom:8px}
  .empty-state-text{font-size:14px;color:var(--ink3);line-height:1.55}
  /* Day cards */
  .day-card{background:var(--white);border:1.5px solid var(--border);border-radius:17px;overflow:hidden;box-shadow:var(--sh);cursor:pointer;transition:transform .1s}
  .day-card:active{transform:scale(.99)}
  .day-card-body{padding:14px 17px}
  .dc-top{display:flex;align-items:center;justify-content:space-between}
  .dc-left{display:flex;align-items:center;gap:8px;min-width:0}
  .dc-name{font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--ch);white-space:nowrap}
  .dc-name.green{color:var(--green)}
  .dc-pill-done{background:var(--green-l);color:var(--green);border:1px solid var(--green-m);border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;white-space:nowrap;flex-shrink:0}
  .dc-right{display:flex;align-items:center;gap:6px;flex-shrink:0}
  .dc-last{font-size:11px;color:var(--ink3);font-weight:500}
  .dc-remaining{font-size:11px;color:var(--orange);font-weight:600}
  .dc-subtitle{font-size:12px;color:var(--ink3);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .dc-bar-wrap{height:3px;background:var(--surface2)}
  .dc-bar{height:3px;transition:width .4s ease}
  .add-workout-row{background:var(--white);border:1.5px solid var(--ch);border-radius:17px;padding:14px 17px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:14px;font-weight:600;color:var(--ch);box-shadow:var(--sh)}
  /* Add Workout Modal */
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:60;display:flex;align-items:flex-end;justify-content:center}
  .modal-sheet{background:var(--white);border-radius:24px 24px 0 0;width:100%;max-width:390px;padding:20px 20px 44px;max-height:85vh;overflow-y:auto;animation:up .25s ease}
  .modal-sheet::-webkit-scrollbar{display:none}
  .modal-handle{width:40px;height:4px;background:var(--border2);border-radius:2px;margin:0 auto 20px}
  .modal-title{font-size:20px;font-weight:800;color:var(--ch);margin-bottom:4px;letter-spacing:-.4px}
  .modal-sub{font-size:13px;color:var(--ink3);margin-bottom:18px}
  .modal-split-opt{background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:12px;margin-bottom:8px}
  .modal-split-opt:active{transform:scale(.99)}
  .modal-split-opt.disabled{opacity:.35;cursor:not-allowed;pointer-events:none}
  .modal-split-emoji{font-size:22px;flex-shrink:0}
  .modal-split-name{font-size:15px;font-weight:700;color:var(--ch)}
  .modal-split-desc{font-size:12px;color:var(--ink3);margin-top:2px}
  .modal-split-badge{font-size:10px;font-weight:700;color:var(--orange);background:var(--orange-l);border-radius:20px;padding:2px 8px;margin-left:auto;white-space:nowrap;flex-shrink:0}
  /* Weekly volume chart */
  .vol-chart{display:flex;align-items:flex-end;gap:6px;height:80px;padding:0 4px}
  .vol-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
  .vol-bar{width:100%;border-radius:5px 5px 0 0;background:var(--ch);min-height:4px;transition:height .4s ease}
  .vol-bar.today{background:var(--orange)}
  .vol-bar.zero{background:var(--border2);opacity:.4}
  .vol-day-lbl{font-size:9px;font-weight:600;color:var(--ink3);text-transform:uppercase}
  .vol-day-lbl.today{color:var(--orange);font-weight:800}
  /* Exercise search */
  .ex-search-wrap{position:relative;margin-bottom:12px}
  .ex-search-inp{width:100%;background:var(--surface);border:1.5px solid var(--border);border-radius:12px;padding:11px 14px 11px 36px;font-size:14px;font-family:'Inter',sans-serif;color:var(--ch);outline:none}
  .ex-search-inp:focus{border-color:var(--ch)}
  /* Session screen */
  .sess-screen{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .sess-topbar{padding:16px 20px 0;display:flex;align-items:center;gap:12px;flex-shrink:0}
  .sess-title{font-size:19px;font-weight:800;letter-spacing:-.4px;color:var(--ch)}
  .sess-counter{padding:12px 20px 8px;flex-shrink:0}
  .sess-count-row{display:flex;align-items:baseline;gap:6px;margin-bottom:6px}
  .sess-count-num{font-size:17px;font-weight:800;color:var(--ch);letter-spacing:-.3px}
  .sess-count-total{font-size:13px;color:var(--ink3)}
  .sess-prog-bar-wrap{height:4px;background:var(--surface2);border-radius:2px;overflow:hidden}
  .sess-prog-bar{height:100%;border-radius:2px;transition:width .3s ease}
  .sess-scroll{flex:1;overflow-y:auto}
  .sess-scroll::-webkit-scrollbar{display:none}
  .sess-footer{padding:10px 16px 32px;border-top:1px solid var(--border);display:flex;gap:8px;flex-shrink:0;background:var(--white)}
  .sess-edit-btn{flex:1;padding:13px;background:var(--surface);border:1.5px solid var(--border);border-radius:100px;font-size:14px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;color:var(--ch);text-align:center}
  .sess-edit-btn.active{background:var(--ch);color:white;border-color:var(--ch)}
  .sess-finish-btn{flex:2;padding:13px;background:var(--ch);color:white;border:none;border-radius:100px;font-size:14px;font-weight:700;font-family:'Inter',sans-serif;cursor:pointer}
  .sess-finish-btn:disabled{opacity:.18;cursor:not-allowed}
  .sess-divider{height:1px;background:var(--border);margin:0 16px}
  /* Exercise blocks */
  .ex-block{background:var(--white);margin:8px 12px;border:1.5px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh)}
  .ex-block:last-of-type{margin-bottom:8px}
  .ex-hdr{padding:13px 16px 6px;display:flex;justify-content:space-between;align-items:flex-start}
  .ex-hdr-left{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1;margin-right:8px}
  .ex-name{font-size:15px;font-weight:700;color:var(--ch);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .muscle-tag{display:inline-block;background:var(--surface);color:var(--ink3);border-radius:20px;padding:2px 8px;font-size:10px;font-weight:600;width:fit-content}
  .ex-last-lbl{font-size:11px;color:var(--ink3);flex-shrink:0}
  .set-col-hdrs{display:grid;grid-template-columns:48px 52px 1fr 1fr 36px;gap:5px;padding:3px 16px 1px}
  .sch{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.7px;text-align:center}
  .sch:first-child{text-align:left}
  .set-row{display:grid;grid-template-columns:48px 52px 1fr 1fr 36px;gap:5px;padding:7px 16px;align-items:center;border-top:1px solid var(--border)}
  .set-n{font-size:12px;font-weight:700;color:var(--ink3)}
  .set-last-num{font-size:12px;font-weight:600;color:var(--ink3);text-align:center}
  .set-inp{width:100%;background:var(--surface);border:1.5px solid var(--border2);border-radius:10px;padding:9px 0;font-size:17px;font-weight:700;font-family:'Inter',sans-serif;color:var(--ch);text-align:center;outline:none;transition:border-color .15s}
  .set-inp:focus{border-color:var(--orange);background:var(--white)}
  .set-inp.pr{border-color:var(--green);background:var(--green-l)}
  .set-tick{width:36px;height:40px;border-radius:10px;border:1.5px solid var(--border);background:var(--white);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;font-size:14px;color:transparent;font-weight:800;flex-shrink:0}
  .set-tick.on{background:var(--green);border-color:var(--green);color:white}
  .ex-footer{padding:7px 16px 10px;display:flex;justify-content:space-between}
  .add-set-btn{background:none;border:none;font-size:13px;font-weight:700;color:var(--ch);font-family:'Inter',sans-serif;cursor:pointer;padding:0}
  .rm-set-btn{background:none;border:none;font-size:12px;font-weight:600;color:var(--ink3);font-family:'Inter',sans-serif;cursor:pointer;padding:0}
  .ex-done-row{padding:11px 16px;display:flex;align-items:center;gap:10px;cursor:pointer}
  .ex-done-tick{width:22px;height:22px;border-radius:7px;background:var(--green);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:800;flex-shrink:0}
  .ex-done-name{flex:1;font-size:14px;font-weight:600;color:var(--green);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ex-done-detail{font-size:12px;color:var(--ink3);font-weight:500;white-space:nowrap}
  .edit-mode{padding:14px 16px;border-top:1px solid var(--border)}
  .edit-ex-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
  .edit-ex-row:last-child{border-bottom:none}
  .edit-ex-name{flex:1;font-size:14px;font-weight:600;color:var(--ch);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .rm-btn{background:none;border:none;font-size:15px;color:var(--ink3);cursor:pointer;padding:4px}
  .edit-add-row{display:flex;gap:8px;margin-top:10px}
  .edit-inp{flex:1;background:var(--surface);border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;font-size:14px;font-family:'Inter',sans-serif;color:var(--ch);outline:none}
  .edit-add-plus{width:38px;height:38px;background:var(--ch);border:none;border-radius:10px;color:white;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0}
  .qa-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
  .qa{padding:5px 11px;background:var(--surface);border:1.5px solid var(--border);border-radius:20px;font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;white-space:nowrap}
  .delete-workout-btn{width:100%;margin-top:12px;padding:11px;background:transparent;border:1.5px solid #FFCCCC;border-radius:100px;font-size:13px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;color:#CC3333;text-align:center}
  /* PROGRESS */
  .prog-scroll{flex:1;overflow-y:auto;padding:14px 18px 24px;display:flex;flex-direction:column;gap:14px}
  .prog-scroll::-webkit-scrollbar{display:none}
  .pr-card{background:var(--ch);border-radius:18px;padding:20px;position:relative;overflow:hidden}
  .pr-blob{position:absolute;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(232,80,10,.22) 0%,transparent 65%);top:-50px;right:-50px}
  .pr-lbl{font-size:11px;color:rgba(255,255,255,.38);font-weight:700;text-transform:uppercase;letter-spacing:1.4px;margin-bottom:6px;position:relative}
  .pr-ex-name{font-size:15px;font-weight:700;color:rgba(255,255,255,.7);position:relative;margin-bottom:4px}
  .pr-nums{display:flex;align-items:baseline;gap:10px;position:relative;margin-bottom:5px}
  .pr-from{font-size:28px;font-weight:800;color:rgba(255,255,255,.45);letter-spacing:-.5px}
  .pr-arrow{font-size:18px;color:rgba(255,255,255,.4)}
  .pr-to{font-size:36px;font-weight:900;color:white;letter-spacing:-.6px}
  .pr-unit{font-size:14px;color:rgba(255,255,255,.5);font-weight:600}
  .pr-sub{font-size:12px;color:rgba(255,255,255,.38);position:relative}
  .stats-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
  .stat-mini{background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:12px 10px;box-shadow:var(--sh);text-align:center}
  .stat-mini-lbl{font-size:10px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
  .stat-mini-val{font-size:22px;font-weight:800;letter-spacing:-.4px;line-height:1;color:var(--ch)}
  .stat-mini-sub{font-size:10px;color:var(--ink3);margin-top:2px}
  /* Progress header + hero */
  .prog-hdr-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}
  .prog-month{font-size:13px;color:var(--ink3);font-weight:600}
  .prog-hero{background:var(--ch);border-radius:20px;padding:22px 20px;position:relative;overflow:hidden;margin-bottom:14px;flex-shrink:0}
  .prog-hero-blob{position:absolute;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.06);top:-70px;right:-60px}
  .prog-hero-lbl{font-size:11px;color:rgba(255,255,255,.7);font-weight:700;text-transform:uppercase;letter-spacing:1.4px;margin-bottom:8px;position:relative}
  .prog-hero-title{font-size:28px;font-weight:800;color:white;letter-spacing:-.5px;position:relative;margin-bottom:6px;line-height:1.1}
  .prog-hero-sub{font-size:14px;color:rgba(255,255,255,.8);position:relative;margin-bottom:16px}
  .prog-hero-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;position:relative}
  .phs-item{background:rgba(255,255,255,.14);border-radius:12px;padding:10px 6px;text-align:center}
  .phs-val{font-size:20px;font-weight:800;color:white;line-height:1}
  .phs-lbl{font-size:11px;color:rgba(255,255,255,.75);margin-top:3px}
  /* Segmented control: Strength / Calendar / History */
  .seg-ctrl{display:flex;background:var(--surface);border-radius:100px;padding:4px;gap:2px;margin-bottom:16px}
  .seg-opt{flex:1;text-align:center;padding:9px 0;border-radius:100px;font-size:13px;font-weight:700;color:var(--ink3);cursor:pointer;transition:all .15s}
  .seg-opt.on{background:var(--white);color:var(--ch);box-shadow:var(--sh)}
  /* Range pills (Week/1M/6M/1Y/All) */
  .range-row{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:12px}
  .range-pills{display:flex;flex-wrap:wrap;gap:2px;background:var(--surface);border-radius:100px;padding:3px}
  .range-pill{flex-shrink:0;padding:5px 11px;border-radius:100px;font-size:12px;font-weight:700;color:var(--ink3);background:transparent;cursor:pointer;white-space:nowrap}
  .range-pill.on{background:var(--ch);color:white}
  /* Category tabs (Push/Pull/Legs) */
  .cat-tabs{display:flex;background:var(--white);border:1.5px solid var(--border);border-radius:14px;box-shadow:var(--sh);margin-bottom:12px;overflow:hidden}
  .cat-tab{flex:1;text-align:center;padding:12px 4px;font-size:14px;font-weight:700;color:var(--ink3);cursor:pointer;border-bottom:2.5px solid transparent}
  .cat-tab.on{color:var(--ch);border-bottom-color:var(--ch)}
  /* Strength curve card */
  .str-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;box-shadow:var(--sh);margin-bottom:8px;overflow:hidden}
  .str-card-hdr{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;gap:10px}
  .str-card-name{font-size:15px;font-weight:700;color:var(--ch)}
  .str-card-sub{font-size:12px;color:var(--ink3);margin-top:2px}
  .str-card-nums{display:flex;align-items:baseline;gap:6px;font-size:13px;color:var(--ink3);white-space:nowrap}
  .str-card-body{padding:0 16px 16px;border-top:1px solid var(--border)}
  .chart-hdr{display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px;font-size:13px}
  .chart-title{font-weight:700;color:var(--ch)}
  .chart-delta{font-weight:700;color:var(--green)}
  .chart-stats-row{display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--border)}
  .chart-stat{text-align:center;flex:1}
  .chart-stat-lbl{font-size:11px;color:var(--ink3);margin-bottom:2px}
  .chart-stat-val{font-size:15px;font-weight:800;color:var(--ch)}
  .split-cards-wrap{overflow-x:auto;margin:0 -18px;padding:0 18px}
  .split-cards-wrap::-webkit-scrollbar{display:none}
  .split-cards-row{display:flex;gap:10px;width:max-content}
  .split-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:14px;min-width:130px;max-width:160px;box-shadow:var(--sh);flex-shrink:0}
  .split-card-name{font-size:12px;font-weight:800;color:var(--ch);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
  .split-card-exs{display:flex;flex-direction:column;gap:5px}
  .split-card-ex{font-size:12px;font-weight:600;color:var(--ink3);cursor:pointer;padding:3px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .split-card-ex.active{color:var(--orange);font-weight:700}
  .prog-graph-wrap{background:var(--white);border:1.5px solid var(--border);border-radius:16px;overflow:hidden;box-shadow:var(--sh)}
  .pge-top{padding:14px 16px 0;display:flex;justify-content:space-between;align-items:center}
  .pge-name{font-size:14px;font-weight:700;color:var(--ch)}
  .pge-gain{font-size:12px;font-weight:700;background:var(--green-l);color:var(--green);border-radius:20px;padding:3px 9px;border:1px solid var(--green-m)}
  .pge-graph{padding:8px 16px 2px}
  .pge-range{display:flex;justify-content:space-between;padding:8px 16px 12px;border-top:1px solid var(--border)}
  .pge-start{font-size:11px;color:var(--ink3)}
  .pge-end{font-size:12px;font-weight:700;color:var(--ch)}
  .cal-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:16px;box-shadow:var(--sh)}
  .hist-sess{background:var(--white);border:1.5px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh);margin-bottom:7px}
  .hist-sess-hdr{padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer}
  .hist-sess-date{font-size:13px;font-weight:700;color:var(--ch)}
  .hist-sess-name{font-size:12px;color:var(--ink3)}
  .hist-sess-chev{font-size:11px;color:var(--ink3);transition:transform .2s;display:inline-block}
  .hist-sess-chev.open{transform:rotate(180deg)}
  .hist-sess-body{border-top:1px solid var(--border);padding:12px 16px;display:flex;flex-direction:column;gap:10px}
  .hist-ex-name{font-size:13px;font-weight:700;color:var(--ch);margin-bottom:4px}
  .hist-set-row{display:flex;gap:10px;padding:4px 0;border-bottom:1px solid var(--border)}
  .hist-set-row:last-child{border-bottom:none}
  .hist-set-n{font-size:12px;color:var(--ink3);width:40px;font-weight:600}
  .hist-set-val{font-size:12px;font-weight:600;color:var(--ch)}
  /* PROFILE */
  .profile-scroll{flex:1;overflow-y:auto;padding:0 0 44px;display:flex;flex-direction:column}
  .profile-scroll::-webkit-scrollbar{display:none}
  .profile-section-lbl{font-size:13px;font-weight:600;color:var(--ink3);padding:14px 20px 6px}
  .profile-group{background:var(--white);border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:4px}
  .profile-row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s}
  .profile-row:last-child{border-bottom:none}.profile-row:active{background:var(--surface)}
  .profile-row-icon{width:20px;height:20px;display:flex;align-items:center;justify-content:center;color:var(--ink2);flex-shrink:0}
  .profile-row-label{flex:1;font-size:15px;font-weight:500;color:var(--ch)}
  .profile-row-value{font-size:14px;font-weight:600;color:var(--ink3);margin-right:4px}
  .profile-row-chev{color:var(--ink3);display:flex;align-items:center}
  .profile-user-card{display:flex;align-items:center;gap:14px;background:var(--white);padding:16px 20px;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:4px}
  .puc-av{width:52px;height:52px;border-radius:50%;background:var(--ch);color:white;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer}
  .puc-name-row{display:flex;align-items:center;gap:6px;cursor:pointer}
  .puc-name{font-size:17px;font-weight:700;color:var(--ch)}
  .puc-name-inp{font-size:17px;font-weight:700;color:var(--ch);border:none;border-bottom:2px solid var(--orange);background:transparent;outline:none;font-family:'Inter',sans-serif;width:160px}
  .puc-sub{font-size:13px;color:var(--ink3);margin-top:2px}
  .profile-version{text-align:center;padding:20px;font-size:12px;color:var(--ink3)}
  .units-toggle{display:flex;background:var(--surface);border-radius:100px;padding:3px;gap:2px}
  .ut-opt{padding:5px 12px;border-radius:100px;font-size:12px;font-weight:600;cursor:pointer;color:var(--ink3);font-family:'Inter',sans-serif}
  .ut-opt.on{background:var(--white);color:var(--ch);box-shadow:var(--sh)}
  .notif-toggle{width:44px;height:26px;border-radius:13px;background:var(--surface2);border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
  .notif-toggle.on{background:var(--green)}
  .notif-knob{width:20px;height:20px;border-radius:50%;background:white;position:absolute;top:3px;left:3px;transition:left .2s;box-shadow:0 1px 4px rgba(0,0,0,.15)}
  .notif-toggle.on .notif-knob{left:21px}
  /* Achievements */
  .achieve-scroll{flex:1;overflow-y:auto;padding:0 0 44px}
  .achieve-scroll::-webkit-scrollbar{display:none}
  .achieve-hero{background:var(--ch);padding:32px 24px 28px;text-align:center;position:relative;overflow:hidden}
  .ah-blob{position:absolute;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(232,80,10,.25) 0%,transparent 65%);top:-60px;right:-60px}
  .ah-num{font-size:72px;font-weight:900;color:white;line-height:1;letter-spacing:-3px;position:relative}
  .ah-label{font-size:15px;color:rgba(255,255,255,.45);position:relative;margin-top:4px}
  .ah-best{font-size:12px;color:rgba(255,255,255,.3);position:relative;margin-top:5px}
  .badge-section-lbl{font-size:13px;font-weight:600;color:var(--ink3);padding:14px 20px 6px}
  .badge-group{background:var(--white);border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
  .badge-row{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border)}
  .badge-row:last-child{border-bottom:none}
  .badge-ico{width:42px;height:42px;border-radius:13px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
  .badge-ico.locked{opacity:.4;filter:grayscale(1)}.badge-ico.unlocked{background:var(--green-l)}
  .badge-name{font-size:14px;font-weight:700;color:var(--ch)}.badge-desc{font-size:12px;color:var(--ink3);margin-top:2px}
  .badge-date{font-size:11px;color:var(--orange);font-weight:600;margin-top:2px}.badge-hint{font-size:11px;color:var(--ink3);margin-top:2px}
`

/* ── DATA ── */
const EX_LIB = {
  Push: [
    'Bench Press',
    'Incline DB Press',
    'OHP',
    'Decline Bench Press',
    'Cable Fly',
    'Pec Deck',
    'Lateral Raise',
    'Front Raise',
    'Tricep Pushdown',
    'Skull Crushers',
    'Overhead Tricep Extension',
    'Dips',
    'Close Grip Bench',
    'Machine Chest Press',
  ],
  Pull: [
    'Pull-ups',
    'Chin-ups',
    'Barbell Row',
    'Cable Row',
    'Seated Row',
    'Lat Pulldown',
    'Single Arm DB Row',
    'Face Pulls',
    'Bicep Curl',
    'Hammer Curl',
    'Incline DB Curl',
    'Preacher Curl',
    'Cable Curl',
    'Reverse Curl',
    'Shrugs',
  ],
  Legs: [
    'Squat',
    'Front Squat',
    'Romanian Deadlift',
    'Deadlift',
    'Leg Press',
    'Hack Squat',
    'Leg Curl',
    'Leg Extension',
    'Calf Raise',
    'Seated Calf Raise',
    'Hip Thrust',
    'Bulgarian Split Squat',
    'Lunges',
    'Glute Kickback',
  ],
  Upper: [
    'Bench Press',
    'Incline DB Press',
    'OHP',
    'Pull-ups',
    'Cable Row',
    'Lat Pulldown',
    'Lateral Raise',
    'Face Pulls',
    'Bicep Curl',
    'Tricep Pushdown',
    'Close Grip Bench',
    'Seated Row',
    'Hammer Curl',
    'Rear Delt Fly',
  ],
  Lower: [
    'Squat',
    'Romanian Deadlift',
    'Deadlift',
    'Leg Press',
    'Leg Curl',
    'Leg Extension',
    'Calf Raise',
    'Hip Thrust',
    'Bulgarian Split Squat',
    'Lunges',
    'Hack Squat',
    'Glute Kickback',
    'Seated Calf Raise',
    'Nordic Curl',
  ],
  'Full Body': [
    'Squat',
    'Bench Press',
    'Deadlift',
    'Pull-ups',
    'OHP',
    'Barbell Row',
    'Bicep Curl',
    'Tricep Pushdown',
    'Leg Press',
    'Lateral Raise',
    'Face Pulls',
    'Calf Raise',
  ],
  Chest: [
    'Flat Bench Press',
    'Incline DB Press',
    'Decline Bench Press',
    'Cable Fly',
    'Pec Deck',
    'Machine Chest Press',
    'Dips',
    'Push-ups',
  ],
  Back: [
    'Deadlift',
    'Pull-ups',
    'Chin-ups',
    'Barbell Row',
    'Cable Row',
    'Seated Row',
    'Lat Pulldown',
    'Single Arm DB Row',
    'Face Pulls',
    'Shrugs',
  ],
  Shoulders: [
    'OHP',
    'DB Shoulder Press',
    'Lateral Raise',
    'Front Raise',
    'Rear Delt Fly',
    'Arnold Press',
    'Cable Lateral Raise',
    'Face Pulls',
  ],
  Arms: [
    'Barbell Curl',
    'DB Curl',
    'Hammer Curl',
    'Preacher Curl',
    'Cable Curl',
    'Tricep Pushdown',
    'Skull Crushers',
    'Overhead Tricep Extension',
    'Close Grip Bench',
    'Dips',
    'Tricep Kickback',
  ],
  'Chest & Back': [
    'Bench Press',
    'Pull-ups',
    'Incline DB Press',
    'Barbell Row',
    'Cable Fly',
    'Lat Pulldown',
    'Pec Deck',
    'Cable Row',
  ],
  'Shoulders & Arms': [
    'OHP',
    'Barbell Curl',
    'Lateral Raise',
    'Tricep Pushdown',
    'Rear Delt Fly',
    'Hammer Curl',
    'Arnold Press',
    'Skull Crushers',
  ],
}
const getExLib = (d) => EX_LIB[d] || EX_LIB['Push']
const MUSCLE_TAGS = {
  'Bench Press': 'Chest',
  'Incline DB Press': 'Chest',
  'Decline Bench Press': 'Chest',
  'Flat Bench Press': 'Chest',
  'Cable Fly': 'Chest',
  'Pec Deck': 'Chest',
  'Machine Chest Press': 'Chest',
  Dips: 'Chest/Tri',
  'Push-ups': 'Chest',
  OHP: 'Shoulders',
  'DB Shoulder Press': 'Shoulders',
  'Lateral Raise': 'Shoulders',
  'Front Raise': 'Shoulders',
  'Rear Delt Fly': 'Rear Delts',
  'Arnold Press': 'Shoulders',
  'Cable Lateral Raise': 'Shoulders',
  'Pull-ups': 'Back/Bi',
  'Chin-ups': 'Back/Bi',
  'Barbell Row': 'Back',
  'Cable Row': 'Back',
  'Seated Row': 'Back',
  'Lat Pulldown': 'Back',
  'Single Arm DB Row': 'Back',
  'Face Pulls': 'Rear Delts',
  Shrugs: 'Traps',
  'Bicep Curl': 'Biceps',
  'DB Curl': 'Biceps',
  'Hammer Curl': 'Biceps',
  'Incline DB Curl': 'Biceps',
  'Preacher Curl': 'Biceps',
  'Cable Curl': 'Biceps',
  'Reverse Curl': 'Biceps',
  'Tricep Pushdown': 'Triceps',
  'Skull Crushers': 'Triceps',
  'Overhead Tricep Extension': 'Triceps',
  'Close Grip Bench': 'Triceps',
  'Tricep Kickback': 'Triceps',
  Squat: 'Quads',
  'Front Squat': 'Quads',
  'Romanian Deadlift': 'Hamstrings',
  Deadlift: 'Back/Legs',
  'Leg Press': 'Quads',
  'Hack Squat': 'Quads',
  'Leg Curl': 'Hamstrings',
  'Leg Extension': 'Quads',
  'Calf Raise': 'Calves',
  'Seated Calf Raise': 'Calves',
  'Hip Thrust': 'Glutes',
  'Bulgarian Split Squat': 'Quads/Glutes',
  Lunges: 'Quads/Glutes',
  'Glute Kickback': 'Glutes',
  'Nordic Curl': 'Hamstrings',
}
const ALL_SPLITS = [
  {
    id: 'ppl',
    emoji: '💪',
    name: 'Push / Pull / Legs',
    desc: 'Most popular. Best for 5–6 days.',
    days: ['Push', 'Pull', 'Legs'],
  },
  {
    id: 'ul',
    emoji: '🔄',
    name: 'Upper / Lower',
    desc: 'Great balance. Best for 4 days.',
    days: ['Upper', 'Lower'],
  },
  {
    id: 'fb',
    emoji: '⚡',
    name: 'Full Body',
    desc: 'Train everything each session.',
    days: ['Full Body'],
  },
  {
    id: 'bro',
    emoji: '🏆',
    name: 'Bro Split',
    desc: 'One muscle group per day.',
    days: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs'],
  },
  {
    id: 'arnold',
    emoji: '🦁',
    name: 'Arnold Split',
    desc: 'Chest+Back, Shoulders+Arms, Legs.',
    days: ['Chest & Back', 'Shoulders & Arms', 'Legs'],
  },
]
const FREQ_OPTS = [
  { id: '1-3', label: '1 – 3 days', sub: 'Just getting started or busy schedule', dots: 2 },
  { id: '4-5', label: '4 – 5 days', sub: 'Consistent trainer, solid commitment', dots: 4 },
  { id: '6-7', label: '6 – 7 days', sub: 'Dedicated, advanced lifter', dots: 6 },
]
const SEX_OPTS = [
  { id: 'male', label: 'Male', emoji: '♂️' },
  { id: 'female', label: 'Female', emoji: '♀️' },
  { id: 'other', label: 'Other', emoji: '⚪' },
]
const REFERRAL_OPTS = [
  { id: 'instagram', label: 'Instagram', emoji: '📷' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'youtube', label: 'YouTube', emoji: '▶️' },
  { id: 'google', label: 'Google', emoji: '🔍' },
  { id: 'reddit', label: 'Reddit', emoji: '👽' },
  { id: 'friend', label: 'Friend or family', emoji: '👥' },
  { id: 'appstore', label: 'App Store', emoji: '📱' },
  { id: 'other', label: 'Other', emoji: '✨' },
]
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const AVATAR_OPTS = ['💪', '🔥', '🏋️', '⚡', '🦁', '🐺', '🎯', '🚀']
const OB_PROGRESS = {
  ob_info: 8,
  ob_sex: 18,
  ob_referral: 26,
  ob_prior_apps: 34,
  ob_height: 42,
  ob_weight: 50,
  ob_dob: 58,
  ob_thanks: 64,
  ob_freq: 70,
  ob_split: 78,
  ob_exercises_base: 78,
  ob_exercises_span: 18,
  ob_auth: 96,
}

const DAYS_MON = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const JS_TO_MON = [6, 0, 1, 2, 3, 4, 5]
const today = new Date()
const todayMonIdx = JS_TO_MON[today.getDay()]
const getWeekDates = () => {
  const d = []
  for (let i = 0; i < 7; i++) {
    const dt = new Date(today)
    dt.setDate(today.getDate() - todayMonIdx + i)
    d.push(dt.getDate())
  }
  return d
}
const weekDates = getWeekDates()
const ini = (n) =>
  n.trim()
    ? n
        .trim()
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'
const fmtDate = (dt) =>
  new Date(dt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
const localDateStr = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const getMonthLabel = (dt) =>
  new Date(dt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
const CIRC = 2 * Math.PI * 16

/* ═══════════════════════════════════════
   MAIN APP
═══════════════════════════════════════ */
export default function App() {
  const { user, loading: authLoading, signOut, signInWithGoogle } = useAuth()
  const {
    profile,
    programs: dbPrograms,
    sessionLog: dbSessionLog,
    workoutState: dbWorkoutState,
    loading: dataLoading,
    saveProgram,
    deleteProgram,
    updateProgramExercises,
    saveSession,
    deleteSession,
    saveWorkoutState,
    updateProfile,
    deleteAccount,
  } = useData(user)

  const [screen, setScreen] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('overload_programs'))
      return saved && saved.length > 0 ? 'main' : 'splash'
    } catch {
      return 'splash'
    }
  })
  const [showAddWorkout, setShowAddWorkout] = useState(false)
  const [obFreq, setObFreq] = useState(null)
  const [obSplit, setObSplit] = useState(null)
  const [obExs, setObExs] = useState({})
  const [obExStep, setObExStep] = useState(0)
  const [obSex, setObSex] = useState(null)
  const [obReferral, setObReferral] = useState(null)
  const [obPriorApps, setObPriorApps] = useState(null)
  const [obHeightUnit, setObHeightUnit] = useState('ft')
  const [obHeightFt, setObHeightFt] = useState(5)
  const [obHeightIn, setObHeightIn] = useState(8)
  const [obHeightCm, setObHeightCm] = useState(173)
  const [obWeightUnit, setObWeightUnit] = useState('lbs')
  const [obWeightVal, setObWeightVal] = useState(160)
  const [obDobMonth, setObDobMonth] = useState(1)
  const [obDobDay, setObDobDay] = useState(1)
  const [obDobYear, setObDobYear] = useState(2000)
  // Local state (synced to Supabase on changes, persisted to localStorage for guests)
  const [programs, setPrograms] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('overload_programs')) || []
    } catch {
      return []
    }
  })
  const [sessionLog, setSessionLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('overload_sessionLog')) || []
    } catch {
      return []
    }
  })
  const [wSets, setWSets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('overload_wSets')) || {}
    } catch {
      return {}
    }
  })
  // null = editing today; otherwise the ms timestamp of the past day being backfilled
  const [sessionDate, setSessionDate] = useState(null)
  // Ephemeral scratch buffer for backfilling a past day — never persisted, discarded if
  // the session screen is left without hitting Finish. Keeps past-day edits from ever
  // touching the real (dateless) wSets buffer that represents today's live state.
  const [pastEditSets, setPastEditSets] = useState({})
  const activeSets = sessionDate !== null ? pastEditSets : wSets
  const setActiveSets = sessionDate !== null ? setPastEditSets : setWSets
  const [tab, setTab] = useState('home')
  const [sessionScreen, setSessionScreen] = useState(null)
  const [editingDay, setEditDay] = useState(null)
  const [editSearch, setEditS] = useState('')
  const [collapsedDone, setCollapsedDone] = useState({})
  const [trainedDays, setTrained] = useState({})
  const [lastTs, setLastTs] = useState({})

  const [viewingDayIdx, setViewingDayIdx] = useState(null)
  const [selectedProgressEx, setSelEx] = useState(null)
  const [expandedSess, setExpS] = useState({})
  const [userName, setUserName] = useState('Athlete')
  const [editingName, setEditName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [userAvatar, setUserAvatar] = useState(null)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [units, setUnits] = useState('kg')
  const [notifEnabled, setNotif] = useState(false)
  const [toast, setToast] = useState(null)
  const toastRef = useRef(null)
  const [progRangeStrength, setProgRangeStrength] = useState('All')
  const [progRangeHistory, setProgRangeHistory] = useState('All')
  const [progExCat, setProgExCat] = useState(null)
  const [expandedStr, setExpStr] = useState({})

  // Persist guest data locally so it survives page reloads / OAuth redirects
  useEffect(() => {
    localStorage.setItem('overload_programs', JSON.stringify(programs))
  }, [programs])
  useEffect(() => {
    localStorage.setItem('overload_sessionLog', JSON.stringify(sessionLog))
  }, [sessionLog])
  useEffect(() => {
    localStorage.setItem('overload_wSets', JSON.stringify(wSets))
  }, [wSets])

  // Sync Supabase data to local state — the backend is the source of truth once migration has settled
  useEffect(() => {
    if (!user || dataLoading) return
    const migrated = localStorage.getItem('overload_migrated') === 'true'
    if (migrated) {
      // Fully trust the DB for programs/sessions, including when empty (e.g. after Delete Account).
      setPrograms(
        dbPrograms.map((p) => ({
          id: p.id,
          split: { id: p.split_id, name: p.split_name },
          days: p.days,
          exs: p.exercises,
        })),
      )
      setSessionLog(dbSessionLog)
      // workoutState is different: a newly-added exercise gets a local placeholder "empty set" row
      // before it's ever saved to the backend, so we merge in the DB's saved values rather than
      // wholesale replacing — otherwise every not-yet-saved exercise would show 0 sets.
      setWSets((p) => ({ ...p, ...dbWorkoutState }))
    } else {
      // Migration hasn't finished yet — don't let an empty DB snapshot wipe not-yet-synced guest data
      if (dbPrograms.length > 0) {
        setPrograms(
          dbPrograms.map((p) => ({
            id: p.id,
            split: { id: p.split_id, name: p.split_name },
            days: p.days,
            exs: p.exercises,
          })),
        )
      }
      if (dbSessionLog.length > 0) setSessionLog(dbSessionLog)
      if (Object.keys(dbWorkoutState).length > 0) setWSets((p) => ({ ...p, ...dbWorkoutState }))
    }
    if (profile) {
      if (profile.name) setUserName(profile.name)
      if (profile.units) setUnits(profile.units)
      if (profile.notif_enabled !== undefined) setNotif(profile.notif_enabled)
      if (profile.avatar) setUserAvatar(profile.avatar)
    }
    if (dbPrograms.length > 0 && screen === 'splash') setScreen('main')
  }, [user, dataLoading, dbPrograms, dbSessionLog, dbWorkoutState, profile])

  // One-time migration: push guest data (from localStorage) into the new account
  useEffect(() => {
    if (!user || dataLoading) return
    if (localStorage.getItem('overload_migration_started') === 'true') return
    if (dbPrograms.length === 0 && (programs.length > 0 || sessionLog.length > 0)) {
      localStorage.setItem('overload_migration_started', 'true')
      ;(async () => {
        for (const prog of programs) await saveProgram(prog)
        for (const sess of [...sessionLog].reverse()) await saveSession(sess)
        for (const [exName, sets] of Object.entries(wSets)) await saveWorkoutState(exName, sets)
        localStorage.removeItem('overload_programs')
        localStorage.removeItem('overload_sessionLog')
        localStorage.removeItem('overload_wSets')
        localStorage.setItem('overload_migrated', 'true')
        setScreen('main')
      })()
    } else {
      localStorage.setItem('overload_migration_started', 'true')
      localStorage.setItem('overload_migrated', 'true') // nothing to migrate — DB can be trusted immediately
    }
  }, [user, dataLoading])

  // Rebuild this week's trained-day markers and per-day last-trained timestamps from real session
  // history on every load/change, instead of only mutating them in memory when a workout finishes.
  useEffect(() => {
    const weekMap = {}
    for (let i = 0; i < 7; i++) {
      const dt = new Date(today)
      dt.setDate(today.getDate() - todayMonIdx + i)
      const key = localDateStr(dt.getTime())
      const names = [
        ...new Set(sessionLog.filter((s) => localDateStr(s.date) === key).map((s) => s.dayName)),
      ]
      if (names.length) weekMap[i] = names
    }
    setTrained(weekMap)
    const lastMap = {}
    sessionLog.forEach((s) => {
      if (!lastMap[s.dayName] || s.date > lastMap[s.dayName]) lastMap[s.dayName] = s.date
    })
    setLastTs(lastMap)
  }, [sessionLog])

  const showToast = (msg) => {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 2800)
  }

  const toggleObEx = (day, ex) =>
    setObExs((p) => {
      const c = p[day] || []
      return { ...p, [day]: c.includes(ex) ? c.filter((e) => e !== ex) : [...c, ex] }
    })
  const splitDays = obSplit?.days || []
  const curObDay = splitDays[obExStep] || ''
  const isLastDay = obExStep === splitDays.length - 1

  const addProgram = async () => {
    if (!obSplit) {
      setScreen('main')
      return
    }
    const prog = { id: Date.now(), split: obSplit, days: obSplit.days, exs: obExs }
    const nextPrograms = [...programs, prog]
    setPrograms(nextPrograms)
    const ws = { ...wSets }
    obSplit.days.forEach((d) => {
      ;(obExs[d] || []).forEach((ex) => {
        if (!ws[ex]) ws[ex] = [{ w: '', r: '', done: false, lastW: '—', lastR: '—', typed: false }]
      })
    })
    setWSets(ws)
    // Write guest data to localStorage synchronously here too — don't rely solely on the
    // persistence useEffect below, which runs after paint and isn't guaranteed to fire
    // before an OAuth redirect navigates away (see the ob_auth Google button, which calls
    // addProgram() then signInWithGoogle()).
    localStorage.setItem('overload_programs', JSON.stringify(nextPrograms))
    localStorage.setItem('overload_wSets', JSON.stringify(ws))
    if (user) await saveProgram(prog)
    setScreen('main')
  }

  const handleDeleteWorkout = async (dayName) => {
    setPrograms((p) =>
      p
        .map((prog) =>
          prog.days.includes(dayName)
            ? {
                ...prog,
                days: prog.days.filter((d) => d !== dayName),
                exs: Object.fromEntries(Object.entries(prog.exs).filter(([d]) => d !== dayName)),
              }
            : prog,
        )
        .filter((prog) => prog.days.length > 0),
    )
    setSessionScreen(null)
    if (user) await deleteProgram(dayName)
    showToast(`${dayName} removed`)
  }

  const allDays = [...new Set(programs.flatMap((p) => p.days))]
  const getDayExs = (d) => {
    for (const p of programs) {
      if (p.exs[d]) return p.exs[d]
    }
    return []
  }

  const addSet = (ex) =>
    setActiveSets((p) => {
      const sets = p[ex] || []
      const prev = sets[sets.length - 1]
      const filledW = prev && prev.lastW !== '—' ? prev.lastW : ''
      const filledR = prev && prev.lastR !== '—' ? prev.lastR : ''
      return {
        ...p,
        [ex]: [
          ...sets,
          {
            w: filledW,
            r: filledR,
            done: false,
            lastW: prev?.lastW || '—',
            lastR: prev?.lastR || '—',
            typed: !!filledW,
          },
        ],
      }
    })
  const removeSet = (ex, idx) =>
    setActiveSets((p) => {
      const s = [...(p[ex] || [])]
      if (s.length <= 1) return p
      s.splice(idx, 1)
      return { ...p, [ex]: s }
    })
  const updateSet = (ex, i, f, v) =>
    setActiveSets((p) => {
      const s = [...(p[ex] || [])]
      s[i] = { ...s[i], [f]: v, typed: true }
      return { ...p, [ex]: s }
    })
  const tickSet = (ex, i) =>
    setActiveSets((p) => {
      const s = [...(p[ex] || [])]
      if (!s[i].done && !s[i].typed) return p
      s[i] = { ...s[i], done: !s[i].done }
      const next = { ...p, [ex]: s }
      if (!s[i].done && s.every((set) => set.done))
        setTimeout(() => setCollapsedDone((prev) => ({ ...prev, [ex]: true })), 300)
      return next
    })
  const removeExFromDay = async (day, ex) => {
    const newList = getDayExs(day).filter((e) => e !== ex)
    setPrograms((p) =>
      p.map((prog) => (prog.exs[day] ? { ...prog, exs: { ...prog.exs, [day]: newList } } : prog)),
    )
    if (user) await updateProgramExercises(day, newList)
  }
  const addExToDay = async (day, ex) => {
    if (!ex.trim()) return
    const trimmed = ex.trim()
    const newList = [...getDayExs(day), trimmed]
    setPrograms((p) =>
      p.map((prog) => (prog.exs[day] ? { ...prog, exs: { ...prog.exs, [day]: newList } } : prog)),
    )
    // Seed whichever buffer is currently live — wSets for a fresh/live session, or the
    // ephemeral pastEditSets buffer when reviewing a past/reopened session — so a newly
    // added exercise gets its first set row immediately instead of only a bare "Add Set".
    if (!activeSets[trimmed])
      setActiveSets((pw) => ({
        ...pw,
        [trimmed]: [{ w: '', r: '', done: false, lastW: '—', lastR: '—', typed: false }],
      }))
    setEditS('')
    if (user) await updateProgramExercises(day, newList)
  }
  const isPR = (ex, si, w, typed) => {
    if (!typed || !w) return false
    const lw = activeSets[ex]?.[si]?.lastW
    if (!lw || lw === '—' || lw === 'BW') return false
    return parseFloat(w) > parseFloat(lw)
  }
  const isExDone = (ex) => {
    const s = activeSets[ex] || []
    return s.length > 0 && s.every((s) => s.done)
  }
  const getBestSet = (ex) => {
    const sets = (activeSets[ex] || []).filter((s) => s.done && s.typed && s.w)
    if (!sets.length) return null
    const b = sets.reduce((a, s) => (parseFloat(s.w) > parseFloat(a.w) ? s : a), sets[0])
    return `${b.w}${units}×${b.r}`
  }

  const getSessPct = (dayName, dateMs = Date.now()) => {
    const dateKey = localDateStr(dateMs)
    const completed = sessionLog.find((s) => s.dayName === dayName && localDateStr(s.date) === dateKey)
    if (completed) {
      // The session already recorded whether everything intended was done — trust that
      // instead of recomputing a ratio against today's (possibly different) live set
      // counts, which can make a fully completed day look partial.
      if (!completed.partial) return 100
      if (typeof completed.totalSets === 'number' && completed.totalSets > 0) {
        return Math.round((completed.doneSets / completed.totalSets) * 100)
      }
      // Legacy session saved before totalSets/doneSets existed — fall back to the old
      // approximation so existing history doesn't break.
      const totalSaved = completed.exercises.reduce((a, ex) => a + ex.sets.length, 0)
      const totalExpected = getDayExs(dayName).reduce((a, ex) => a + (wSets[ex]?.length || 0), 0)
      if (totalExpected === 0) return 100
      return Math.min(100, Math.round((totalSaved / totalExpected) * 100))
    }
    // Only "today" is allowed to fall back to the live, dateless wSets buffer —
    // a past day with no saved session has nothing in progress by definition.
    if (dateKey !== localDateStr(Date.now())) return 0
    const exs = getDayExs(dayName)
    const tot = exs.reduce((a, ex) => a + (wSets[ex]?.length || 0), 0)
    const done = exs.reduce((a, ex) => a + (wSets[ex]?.filter((s) => s.done).length || 0), 0)
    return tot > 0 ? Math.round((done / tot) * 100) : 0
  }
  const anyDone = (dayName) =>
    getDayExs(dayName).some((ex) => (activeSets[ex] || []).some((s) => s.done))

  // Finishing a workout: for signed-in users, the DB write happens first and the UI only reflects
  // success once Supabase confirms it (backend is the source of truth) — on failure we show an
  // error and leave everything as-is rather than silently marking it done. Guest mode has no
  // backend to confirm against, so it stays optimistic/local-only.
  const doFinish = async (dayName, dateMs = Date.now()) => {
    const dateKey = localDateStr(dateMs)
    const existingSess = sessionLog.find(
      (s) => s.dayName === dayName && localDateStr(s.date) === dateKey,
    )
    // Re-finishing a reopened session (a correction, or just re-confirming) must keep any
    // exercise that was logged before but has since been removed from the day's template —
    // otherwise it would silently vanish from history for good.
    const exNames = existingSess
      ? [...new Set([...getDayExs(dayName), ...existingSess.exercises.map((e) => e.name)])]
      : getDayExs(dayName)
    // Keep ALL of a touched exercise's sets (not just the typed-or-done ones) so the true
    // set count for a partially-touched exercise survives into history and reopening — an
    // exercise with zero typed/done sets stays excluded entirely, same as before.
    const sessExs = exNames
      .map((ex) => {
        const sets = activeSets[ex] || []
        const touched = sets.some((s) => s.typed || s.done)
        return {
          name: ex,
          sets: touched ? sets.map((s) => ({ w: s.w || s.lastW, r: s.r || s.lastR, done: s.done })) : [],
        }
      })
      .filter((e) => e.sets.length > 0)
    // Save the true completion counts directly from live state at Finish time, rather than
    // making every later percentage display try to reconstruct them from the (necessarily
    // partial) saved `exercises` record. A session is only fully done when every set across
    // every exercise is actually ticked — matching an exercise once and leaving the rest
    // untouched no longer counts as "done".
    const totalSets = exNames.reduce((a, ex) => a + (activeSets[ex]?.length || 0), 0)
    const doneSets = exNames.reduce((a, ex) => a + (activeSets[ex]?.filter((s) => s.done).length || 0), 0)
    const isPartial = doneSets < totalSets
    const sessionPayload = { dayName, exercises: sessExs, partial: isPartial, totalSets, doneSets, date: dateMs }

    if (user) {
      const { error } = await saveSession(sessionPayload)
      if (error) {
        showToast("Couldn't save — check your connection and try again")
        return
      }
      // saveSession already updated the hook's own state; the sync effect mirrors it into local state.
    } else {
      const existingIdx = sessionLog.findIndex(
        (s) => s.dayName === dayName && localDateStr(s.date) === dateKey,
      )
      const newSession = { id: Date.now(), ...sessionPayload }
      if (existingIdx >= 0) {
        setSessionLog((p) => {
          const u = [...p]
          u[existingIdx] = { ...u[existingIdx], exercises: sessExs, partial: isPartial, totalSets, doneSets }
          return u
        })
      } else {
        setSessionLog((p) => [...p, newSession].sort((a, b) => b.date - a.date))
      }
    }

    // Sync the shared "last known weights" template per exercise, but only when this session
    // is the chronologically most recent one that touches that exercise. A live "today" finish
    // is always the latest by definition, so this doesn't change today's behavior. A backfilled
    // past day only flows forward for exercises where nothing more recent has been logged yet —
    // so a genuinely-latest backfill correctly becomes the new baseline (set count and numbers
    // included), without letting an old correction to distant history clobber more recent data.
    const nextWSets = {}
    for (const ex of exNames) {
      const latestOtherDate = sessionLog.reduce((max, s) => {
        if (s.id === existingSess?.id) return max
        if (!s.exercises.some((e) => e.name === ex)) return max
        return Math.max(max, s.date)
      }, -Infinity)
      if (dateMs < latestOtherDate) continue
      // Only a still-in-progress TODAY session preserves ticks — so coming back later today
      // to continue it shows what you've already done. Every other case (today fully done, or
      // any backfilled/past-day Finish regardless of its own partial state) resets done/typed —
      // a future fresh session should start unticked, carrying forward only the reference
      // numbers and set count, never "already done" checkmarks from a session that's over.
      // Checked by date rather than `sessionDate === null` — reopening today's own
      // already-finished session also sets sessionDate to a real (but still-today) timestamp.
      const isToday = localDateStr(dateMs) === localDateStr(Date.now())
      const updatedSets = isToday && isPartial
        ? (activeSets[ex] || []).map((s) => ({
            ...s,
            lastW: s.typed && s.w ? s.w : s.lastW,
            lastR: s.typed && s.r ? s.r : s.lastR,
          }))
        : (activeSets[ex] || []).map((s) => ({
            ...s,
            done: false,
            lastW: s.typed && s.w ? s.w : s.lastW,
            lastR: s.typed && s.r ? s.r : s.lastR,
            w: s.typed && s.w ? s.w : s.lastW !== '—' ? s.lastW : '',
            r: s.typed && s.r ? s.r : s.lastR !== '—' ? s.lastR : '',
            typed: false,
          }))
      nextWSets[ex] = updatedSets
      if (user) {
        const { error } = await saveWorkoutState(ex, updatedSets)
        if (error) showToast(`Couldn't save ${ex} — try again`)
      }
    }
    if (!user) setWSets((p) => ({ ...p, ...nextWSets }))
    // Signed-in: saveWorkoutState already updated the hook's state; the sync effect mirrors it locally.

    if (!isPartial) {
      setCollapsedDone({})
      setSessionScreen(null)
    }
    showToast(`${dayName} logged ✓`)
  }

  const buildGraphData = (exName) => {
    if (!exName || !sessionLog.length) return null
    const r = sessionLog
      .filter((s) => s.exercises && s.exercises.some((e) => e.name === exName))
      .slice(0, 8)
      .reverse()
    if (r.length < 2) return null
    return r
      .map((s, i) => {
        const ex = s.exercises.find((e) => e.name === exName)
        if (!ex || !ex.sets.length) return null
        const mk = Math.max(...ex.sets.map((s) => parseFloat(s.w) || 0).filter((v) => v > 0))
        return mk > 0 ? { w: `S${i + 1}`, kg: mk } : null
      })
      .filter(Boolean)
  }
  const buildPR = () => {
    if (!sessionLog.length) return null
    let bEx = null,
      bGain = 0,
      sKg = 0,
      eKg = 0
    const exNames = [
      ...new Set(sessionLog.flatMap((s) => (s.exercises ? s.exercises.map((e) => e.name) : []))),
    ]
    exNames.forEach((ex) => {
      const r = sessionLog
        .filter((s) => s.exercises && s.exercises.some((e) => e.name === ex))
        .slice(0, 20)
        .reverse()
      if (r.length < 2) return
      const f = r[0].exercises.find((e) => e.name === ex)
      const l = r[r.length - 1].exercises.find((e) => e.name === ex)
      if (!f || !l || !f.sets.length || !l.sets.length) return
      const fm = Math.max(...f.sets.map((s) => parseFloat(s.w) || 0))
      const lm = Math.max(...l.sets.map((s) => parseFloat(s.w) || 0))
      if (lm - fm > bGain) {
        bGain = lm - fm
        bEx = ex
        sKg = fm
        eKg = lm
      }
    })
    return bEx ? { ex: bEx, from: sKg, to: eKg, gain: bGain } : null
  }
  const buildWeeklyStats = () => {
    const tot = sessionLog.reduce(
      (a, s) => a + s.exercises.reduce((b, ex) => b + ex.sets.length, 0),
      0,
    )
    const wt = sessionLog.reduce(
      (a, s) =>
        a +
        s.exercises.reduce(
          (b, ex) =>
            b + ex.sets.reduce((c, st) => c + (parseFloat(st.w) || 0) * (parseInt(st.r) || 0), 0),
          0,
        ),
      0,
    )
    const reps = sessionLog.reduce(
      (a, s) =>
        a +
        s.exercises.reduce(
          (b, ex) => b + ex.sets.reduce((c, st) => c + (parseInt(st.r) || 0), 0),
          0,
        ),
      0,
    )
    return { sets: tot, weight: wt, reps }
  }

  const isDayDone = (i) => (trainedDays[i] || []).length > 0
  const getDaySessionLabel = (i) => (trainedDays[i] || []).join('/').slice(0, 5) || ''
  const getLastTrained = (day) => {
    const ts = lastTs[day]
    if (!ts) return 'Never'
    const diff = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return `${diff}d ago`
  }

  const prData = buildPR()
  const weekStats = buildWeeklyStats()
  const todaySessions = trainedDays[todayMonIdx] || []
  let ctxText = 'Tap a workout to start logging.'
  let ctxOrange = false
  if (todaySessions.length > 0) {
    const pct = getSessPct(todaySessions[0])
    ctxText = `${todaySessions[0]} ${pct === 100 ? 'logged today ✓' : `— ${pct}% today`}`
    ctxOrange = pct < 100
  } else {
    const lastDone = Object.entries(lastTs).sort((a, b) => b[1] - a[1])[0]
    if (lastDone) {
      const diff = Math.floor((Date.now() - lastDone[1]) / (1000 * 60 * 60 * 24))
      ctxText = `${lastDone[0]} — ${diff === 0 ? 'today' : diff === 1 ? 'yesterday' : `${diff} days ago`}. Up next?`
      ctxOrange = true
    }
  }
  const progGraphData = selectedProgressEx ? buildGraphData(selectedProgressEx) : null
  const progGraphGain =
    progGraphData && progGraphData.length >= 2
      ? `+${(progGraphData[progGraphData.length - 1].kg - progGraphData[0].kg).toFixed(1)}${units}`
      : null

  // Weekly volume — sets per day this week
  const weeklyVol = DAYS_MON.map((_, i) => {
    const dt = new Date(today)
    dt.setDate(today.getDate() - todayMonIdx + i)
    const dtStr = localDateStr(dt.getTime())
    const daySessions = sessionLog.filter((s) => localDateStr(s.date) === dtStr)
    const sets = daySessions.reduce(
      (a, s) => a + s.exercises.reduce((b, ex) => b + ex.sets.length, 0),
      0,
    )
    return {
      day: DAYS_MON[i].slice(0, 1),
      sets,
      isToday: i === todayMonIdx,
      isFuture: i > todayMonIdx,
    }
  })
  const maxVol = Math.max(...weeklyVol.map((d) => d.sets), 1)

  // Already existing programs split IDs
  const existingSplitIds = new Set(programs.map((p) => p.split?.id).filter(Boolean))
  const isViewingPast = viewingDayIdx !== null && viewingDayIdx !== todayMonIdx

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="app">
        <style>{S}</style>
        <div className="loading-screen">
          <div className="spinner" />
          <div className="loading-text">Loading Overload...</div>
        </div>
      </div>
    )
  }

  /* ════ ONBOARDING ════ */
  if (screen === 'splash')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="splash">
          <div
            className="splash-space"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}
          >
            <div className="pr-card u0" style={{ width: '100%' }}>
              <div className="pr-blob" />
              <div className="pr-lbl">Bench Press</div>
              <div className="pr-ex-name">Tracked with Overload</div>
              <div className="pr-nums">
                <div className="pr-from">135</div>
                <div className="pr-arrow">→</div>
                <div className="pr-to">185</div>
                <div className="pr-unit">lbs</div>
              </div>
              <div className="pr-sub">+50 lbs in 12 weeks</div>
            </div>
          </div>
          <div className="splash-bottom">
            <div className="splash-title u0">
              Get stronger,
              <br />
              one lift at a time.
            </div>
            <div className="splash-sub u1">
              Overload tracks your progressive overload automatically — never guess your next set
              again.
            </div>
            <button className="btn-p u2" onClick={() => setScreen('ob_info')}>
              Get Started
            </button>
            <div className="splash-si u3">
              Already have an account?{' '}
              <span
                onClick={async () => {
                  await signInWithGoogle()
                }}
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_info')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('splash')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_info}%` }} />
          </div>
        </div>
        <div className="ob-info-pg">
          <div className="ob-info-top">
            <div className="u0">
              <div className="ob-q">What is progressive overload?</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} className="u1">
              <div className="bar-visual">
                {[{ h: 30 }, { h: 44 }, { h: 58 }, { h: 70 }, { h: 85 }].map((b, i) => (
                  <div
                    key={i}
                    className={`bv-bar${i === 4 ? ' hi' : ''}`}
                    style={{ width: 38, height: b.h }}
                  />
                ))}
              </div>
            </div>
            <div className="ob-body u2">
              If you lift <b>slightly more each week</b> — more weight, more reps, or more sets —
              your muscles must keep adapting and growing. Overload takes 60 seconds to set up so
              you're ready to start tracking today.
            </div>
          </div>
          <div className="ob-info-bottom">
            <button className="btn-p u3" onClick={() => setScreen('ob_sex')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_sex')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_info')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_sex}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">What's your sex?</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              This helps tailor strength benchmarks.
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div className="freq-list u1">
              {SEX_OPTS.map((o) => (
                <div
                  key={o.id}
                  className={`q-opt${obSex === o.id ? ' on' : ''}`}
                  onClick={() => setObSex(o.id)}
                >
                  <div className="q-opt-emoji">{o.emoji}</div>
                  <div className="q-opt-label">{o.label}</div>
                  <div className="q-opt-radio">
                    <div className="q-opt-radio-dot" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" disabled={!obSex} onClick={() => setScreen('ob_referral')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_referral')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_sex')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_referral}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">Where did you hear about us?</div>
          </div>
          <div className="ob-pg-scroll">
            <div className="freq-list u1">
              {REFERRAL_OPTS.map((o) => (
                <div
                  key={o.id}
                  className={`q-opt${obReferral === o.id ? ' on' : ''}`}
                  onClick={() => setObReferral(o.id)}
                >
                  <div className="q-opt-emoji">{o.emoji}</div>
                  <div className="q-opt-label">{o.label}</div>
                  <div className="q-opt-radio">
                    <div className="q-opt-radio-dot" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button
              className="btn-p"
              disabled={!obReferral}
              onClick={() => setScreen('ob_prior_apps')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_prior_apps')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_referral')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_prior_apps}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">
              Have you tried other
              <br />
              workout tracking apps?
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div className="freq-list u1">
              {[
                { id: 'yes', label: 'Yes', emoji: '👍' },
                { id: 'no', label: 'No', emoji: '👎' },
              ].map((o) => (
                <div
                  key={o.id}
                  className={`q-opt${obPriorApps === o.id ? ' on' : ''}`}
                  onClick={() => setObPriorApps(o.id)}
                >
                  <div className="q-opt-emoji">{o.emoji}</div>
                  <div className="q-opt-label">{o.label}</div>
                  <div className="q-opt-radio">
                    <div className="q-opt-radio-dot" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button
              className="btn-p"
              disabled={!obPriorApps}
              onClick={() => setScreen('ob_height')}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_height')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_prior_apps')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_height}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">What is your height?</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              This will be taken into account for your strength benchmarks.
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div
              className="unit-toggle u1"
              style={{ marginTop: 24, marginBottom: 24 }}
            >
              <div
                className={`unit-opt${obHeightUnit === 'ft' ? ' on' : ''}`}
                onClick={() => setObHeightUnit('ft')}
              >
                ft, in
              </div>
              <div
                className={`unit-opt${obHeightUnit === 'cm' ? ' on' : ''}`}
                onClick={() => setObHeightUnit('cm')}
              >
                cm
              </div>
            </div>
            {obHeightUnit === 'ft' ? (
              <div className="u2" style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <WheelPicker
                  options={Array.from({ length: 6 }, (_, i) => i + 3)}
                  labelFn={(v) => `${v} ft`}
                  value={obHeightFt}
                  onChange={setObHeightFt}
                />
                <WheelPicker
                  options={Array.from({ length: 12 }, (_, i) => i)}
                  labelFn={(v) => `${v} in`}
                  value={obHeightIn}
                  onChange={setObHeightIn}
                />
              </div>
            ) : (
              <div className="u2" style={{ display: 'flex', justifyContent: 'center' }}>
                <WheelPicker
                  options={Array.from({ length: 121 }, (_, i) => i + 120)}
                  labelFn={(v) => `${v} cm`}
                  value={obHeightCm}
                  onChange={setObHeightCm}
                />
              </div>
            )}
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" onClick={() => setScreen('ob_weight')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_weight')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_height')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_weight}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">What is your weight?</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              This will be taken into account for your strength benchmarks.
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div
              className="unit-toggle u1"
              style={{ marginTop: 24, marginBottom: 24 }}
            >
              <div
                className={`unit-opt${obWeightUnit === 'lbs' ? ' on' : ''}`}
                onClick={() => setObWeightUnit('lbs')}
              >
                lbs
              </div>
              <div
                className={`unit-opt${obWeightUnit === 'kg' ? ' on' : ''}`}
                onClick={() => setObWeightUnit('kg')}
              >
                kg
              </div>
            </div>
            <div className="u2" style={{ display: 'flex', justifyContent: 'center' }}>
              <WheelPicker
                options={Array.from(
                  { length: obWeightUnit === 'lbs' ? 380 : 170 },
                  (_, i) => i + (obWeightUnit === 'lbs' ? 60 : 30),
                )}
                labelFn={(v) => `${v} ${obWeightUnit}`}
                value={obWeightVal}
                onChange={setObWeightVal}
              />
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" onClick={() => setScreen('ob_dob')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_dob')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_weight')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_dob}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">When were you born?</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              This will be taken into account for your strength benchmarks.
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div
              className="u1"
              style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}
            >
              <WheelPicker
                options={Array.from({ length: 12 }, (_, i) => i + 1)}
                labelFn={(v) => MONTH_NAMES[v - 1]}
                value={obDobMonth}
                onChange={setObDobMonth}
                width={110}
              />
              <WheelPicker
                options={Array.from({ length: 31 }, (_, i) => i + 1)}
                labelFn={(v) => `${v}`}
                value={obDobDay}
                onChange={setObDobDay}
                width={60}
              />
              <WheelPicker
                options={Array.from({ length: 100 }, (_, i) => today.getFullYear() - i)}
                labelFn={(v) => `${v}`}
                value={obDobYear}
                onChange={setObDobYear}
                width={70}
              />
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" onClick={() => setScreen('ob_thanks')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_thanks')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_dob')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_thanks}%` }} />
          </div>
        </div>
        <div className="bridge-pg">
          <div className="u0" style={{ textAlign: 'center' }}>
            <div className="thanks-ring">
              <div className="thanks-ring-inner">🏋️</div>
            </div>
            <div className="bridge-title">You're all set.</div>
            <div className="bridge-sub">Now let's build your training program.</div>
          </div>
          <button className="btn-p u1" onClick={() => setScreen('ob_freq')}>
            Continue
          </button>
        </div>
      </div>
    )
  if (screen === 'ob_freq')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_thanks')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_freq}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">
              How often do
              <br />
              you train?
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div className="freq-list u1">
              {FREQ_OPTS.map((f) => (
                <div
                  key={f.id}
                  className={`freq-opt${obFreq === f.id ? ' on' : ''}`}
                  onClick={() => setObFreq(f.id)}
                >
                  <div className="freq-dots">
                    {Array.from({ length: f.dots }, (_, i) => (
                      <div key={i} className="freq-dot" />
                    ))}
                  </div>
                  <div>
                    <div className="freq-title">{f.label}</div>
                    <div className="freq-sub">{f.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" disabled={!obFreq} onClick={() => setScreen('ob_split')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_split')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button
            className="back-btn"
            onClick={() => setScreen(programs.length > 0 ? 'main' : 'ob_freq')}
          >
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_split}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">Pick your split.</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>All splits shown</div>
          </div>
          <div className="ob-pg-scroll">
            <div className="split-list u1">
              {ALL_SPLITS.map((s) => (
                <div
                  key={s.id}
                  className={`split-opt${obSplit?.id === s.id ? ' on' : ''}`}
                  onClick={() => {
                    setObSplit(s)
                    setObExs({})
                    setObExStep(0)
                  }}
                >
                  <div className="split-emoji">{s.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div className="split-name">{s.name}</div>
                    <div className="split-desc">{s.desc}</div>
                  </div>
                  <div className="split-chk">✓</div>
                </div>
              ))}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button className="btn-p" disabled={!obSplit} onClick={() => setScreen('ob_exercises')}>
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  if (screen === 'ob_exercises') {
    const exLib = getExLib(curObDay)
    const curSel = obExs[curObDay] || []
    const progress =
      OB_PROGRESS.ob_exercises_base +
      ((obExStep + 1) / splitDays.length) * OB_PROGRESS.ob_exercises_span
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button
            className="back-btn"
            onClick={() => {
              obExStep > 0 ? setObExStep((s) => s - 1) : setScreen('ob_split')
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink3)' }}>
            {obExStep + 1}/{splitDays.length}
          </span>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="ob-pg">
          <div className="u0">
            <div className="ob-q">{curObDay} exercises.</div>
            <div style={{ fontSize: 14, color: 'var(--ink3)', marginTop: 4 }}>
              {curSel.length} selected
            </div>
          </div>
          <div className="ob-pg-scroll">
            <div className="ex-sel-list u1">
              {exLib.map((ex) => {
                const isOn = curSel.includes(ex)
                return (
                  <div
                    key={ex}
                    className={`ex-opt${isOn ? ' on' : ''}`}
                    onClick={() => toggleObEx(curObDay, ex)}
                  >
                    <div className="ex-opt-name" title={ex}>
                      {ex}
                    </div>
                    <div className="ex-opt-chk">✓</div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="ob-pg-bottom">
            <button
              className="btn-p"
              disabled={!curSel.length}
              onClick={() => {
                if (isLastDay) setScreen('ob_auth')
                else setObExStep((i) => i + 1)
              }}
            >
              {isLastDay ? 'Continue →' : `Next — ${splitDays[obExStep + 1]} →`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'ob_auth')
    return (
      <div className="app">
        <style>{S}</style>
        <div className="topbar">
          <button className="back-btn" onClick={() => setScreen('ob_exercises')}>
            ←
          </button>
        </div>
        <div className="ob-prog">
          <div className="ob-track">
            <div className="ob-fill" style={{ width: `${OB_PROGRESS.ob_auth}%` }} />
          </div>
        </div>
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 24px 48px' }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <div className="u0">
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  letterSpacing: '-1px',
                  color: 'var(--ch)',
                  marginBottom: 8,
                }}
              >
                Save your progress.
              </div>
              <div style={{ fontSize: 16, color: 'var(--ink3)', lineHeight: 1.6 }}>
                Sign in to back up your workouts to the cloud. Your data syncs across devices and is
                never lost.
              </div>
            </div>
            <div
              className="u1"
              style={{
                background: 'var(--surface)',
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: 24 }}>☁️</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ch)', marginBottom: 2 }}>
                  Cloud sync
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
                  Your sessions, sets and weights saved permanently.
                </div>
              </div>
            </div>
            <div
              className="u2"
              style={{
                background: 'var(--surface)',
                borderRadius: 16,
                padding: '16px',
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
              }}
            >
              <div style={{ fontSize: 24 }}>📱</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ch)', marginBottom: 2 }}>
                  Any device
                </div>
                <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
                  Log on your phone, see your history anywhere.
                </div>
              </div>
            </div>
          </div>
          <div className="u3" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              className="google-btn"
              onClick={async () => {
                await addProgram()
                await signInWithGoogle()
              }}
            >
              {TI.google} Sign in with Google
            </button>
            <button className="btn-o" onClick={addProgram}>
              Skip for now
            </button>
            <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink3)' }}>
              You can always sign in later from Profile
            </div>
          </div>
        </div>
      </div>
    )

  /* ════ SESSION SCREEN ════ */
  if (sessionScreen !== null) {
    const dayName = sessionScreen
    const completedSess = sessionLog.find(
      (s) => s.dayName === dayName && localDateStr(s.date) === localDateStr(sessionDate ?? Date.now()),
    )
    const exNames = getDayExs(dayName)
    // Reviewing a saved session must still show — and count — any exercise that was actually
    // logged even if it's since been removed from the day's template, otherwise its real
    // history silently disappears here. Edit mode (which manages the live program) and Reset
    // (which intentionally starts a fresh session from the current template) deliberately keep
    // using the plain `exNames` above instead.
    const displayExNames = completedSess
      ? [...new Set([...exNames, ...completedSess.exercises.map((e) => e.name)])]
      : exNames
    // Shadows the top-level getSessSetCounts (which Home's day-card list also calls and must
    // keep reading the real wSets) so this screen's own counters reflect activeSets instead.
    // For a fully-completed saved session, drop exercises that were never part of the saved
    // record and haven't been touched in this review — those only exist here because the
    // day's template grew after logging (e.g. a new exercise added on a later day), and
    // counting their untouched, never-logged sets is what made a genuinely 100% session look
    // partial. An exercise that *was* saved, or that you've actually edited just now (Add Set,
    // typing, ticking), still counts live as normal.
    const getSessSetCounts = () => {
      const relevant =
        completedSess && !completedSess.partial
          ? displayExNames.filter(
              (ex) =>
                completedSess.exercises.some((e) => e.name === ex) ||
                (activeSets[ex] || []).some((s) => s.typed || s.done),
            )
          : displayExNames
      const tot = relevant.reduce((a, ex) => a + (activeSets[ex]?.length || 0), 0)
      const done = relevant.reduce((a, ex) => a + (activeSets[ex]?.filter((s) => s.done).length || 0), 0)
      return { tot, done }
    }
    const isEdit = editingDay === dayName
    const { tot, done } = getSessSetCounts()
    const pct = tot > 0 ? Math.round((done / tot) * 100) : 0
    const hasAnyDone = anyDone(dayName)
    const quickAdds = getExLib(dayName)
      .filter((e) => !displayExNames.includes(e))
      .slice(0, 6)
    const getLastForEx = (exName, excludeId, log) => {
      for (const s of log) {
        if (s.id === excludeId) continue
        const exData = s.exercises.find((e) => e.name === exName)
        if (exData && exData.sets.length) {
          const best = exData.sets.reduce(
            (a, b) => ((parseFloat(b.w) || 0) > (parseFloat(a.w) || 0) ? b : a),
            exData.sets[0],
          )
          return { w: best.w, r: best.r, count: exData.sets.length }
        }
      }
      return null
    }
    const handleReset = async () => {
      const dateMs = sessionDate ?? Date.now()
      const dateKey = localDateStr(dateMs)
      const isToday = dateKey === localDateStr(Date.now())
      const completed = sessionLog.find(
        (s) => s.dayName === dayName && localDateStr(s.date) === dateKey,
      )
      if (completed) {
        // A session was already saved for this date — actually clear it, not just the on-screen taps
        if (user) {
          const { error } = await deleteSession(completed.id)
          if (error) {
            showToast("Couldn't reset — try again")
            return
          }
        }
        const remainingLog = sessionLog.filter((s) => s.id !== completed.id)
        if (!user) setSessionLog(remainingLog)
        const freshSets = {}
        exNames.forEach((ex) => {
          const last = getLastForEx(ex, completed.id, remainingLog)
          // Follow whichever session is now the most recent for this exercise (after the
          // deleted one is gone) for the set count too, not just the weight/reps — otherwise
          // resetting today's session could leave the shared template's set count stuck on
          // what today's own (now-deleted) session had, instead of the day that's now latest.
          const setCount = last ? last.count : (activeSets[ex] || []).length || 1
          freshSets[ex] = Array.from({ length: setCount }, () => ({
            w: last ? last.w : '',
            r: last ? last.r : '',
            done: false,
            lastW: last ? last.w : '—',
            lastR: last ? last.r : '—',
            typed: !!last,
          }))
        })
        // A past-day reset must never touch the shared "last known weights" template —
        // same principle as Finish (see doFinish) — so it only ever writes into the
        // ephemeral pastEditSets buffer, not the real wSets/workout_state. Checked by date
        // rather than `sessionDate !== null` — reopening today's own already-finished session
        // also sets sessionDate to a real (but still-today) timestamp.
        if (!isToday) {
          setPastEditSets((p) => ({ ...p, ...freshSets }))
        } else if (user) {
          for (const ex of exNames) await saveWorkoutState(ex, freshSets[ex])
        } else {
          setWSets((p) => ({ ...p, ...freshSets }))
        }
      } else {
        // Nothing saved yet for this date — just clear the unsaved taps on screen
        setActiveSets((p) => {
          const next = { ...p }
          exNames.forEach((ex) => {
            next[ex] = (p[ex] || []).map((s) => ({
              ...s,
              done: false,
              typed: s.lastW !== '—',
              w: s.lastW !== '—' ? s.lastW : '',
              r: s.lastR !== '—' ? s.lastR : '',
            }))
          })
          return next
        })
      }
      setCollapsedDone({})
      showToast(`${dayName} reset`)
      setSessionScreen(null)
      setSessionDate(null)
    }
    return (
      <div className="app">
        <style>{S}</style>
        {toast && <div className="toast">{toast}</div>}
        <div className="sess-screen">
          <div className="sess-topbar">
            <button
              className="back-btn"
              onClick={() => {
                setSessionScreen(null)
                setSessionDate(null)
                setEditDay(null)
                setCollapsedDone({})
              }}
            >
              ←
            </button>
            <div className="sess-title">{dayName}</div>
            <button
              className="back-btn"
              onClick={() => setEditDay(isEdit ? null : dayName)}
              style={{
                fontSize: 16,
                background: isEdit ? 'var(--ch)' : 'var(--surface)',
                color: isEdit ? 'white' : 'var(--ink)',
              }}
            >
              ✏️
            </button>
          </div>
          <div className="sess-counter">
            <div className="sess-count-row">
              <span className="sess-count-num">
                {done} / {tot}
              </span>
              <span className="sess-count-total">sets</span>
            </div>
            <div className="sess-prog-bar-wrap">
              <div
                className="sess-prog-bar"
                style={{
                  width: `${pct}%`,
                  background: pct === 100 ? 'var(--green)' : 'var(--orange)',
                }}
              />
            </div>
          </div>
          <div className="sess-divider" />
          <div className="sess-scroll">
            {isEdit ? (
              <div className="edit-mode">
                <div className="lbl" style={{ marginBottom: 10 }}>
                  Edit {dayName}
                </div>
                {exNames.length === 0 && (
                  <div style={{ fontSize: 13, color: 'var(--ink3)', padding: '8px 0' }}>
                    No exercises. Add some below.
                  </div>
                )}
                {exNames.map((ex) => (
                  <div className="edit-ex-row" key={ex}>
                    <div className="edit-ex-name" title={ex}>
                      {ex}
                    </div>
                    <button className="rm-btn" onClick={() => removeExFromDay(dayName, ex)}>
                      ✕
                    </button>
                  </div>
                ))}
                <div className="edit-add-row">
                  <input
                    className="edit-inp"
                    placeholder="Search or type exercise…"
                    value={editSearch}
                    onChange={(e) => setEditS(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addExToDay(dayName, editSearch)}
                  />
                  <button className="edit-add-plus" onClick={() => addExToDay(dayName, editSearch)}>
                    +
                  </button>
                </div>
                {quickAdds.length > 0 && (
                  <div className="qa-row">
                    {quickAdds.map((s) => (
                      <div key={s} className="qa" onClick={() => addExToDay(dayName, s)} title={s}>
                        + {s.length > 14 ? s.slice(0, 12) + '…' : s}
                      </div>
                    ))}
                  </div>
                )}
                <button className="delete-workout-btn" onClick={() => handleDeleteWorkout(dayName)}>
                  🗑 Remove {dayName} workout
                </button>
              </div>
            ) : displayExNames.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🏋️</div>
                <div style={{ fontSize: 14, color: 'var(--ink3)' }}>
                  No exercises yet.
                  <br />
                  Tap Edit to add some.
                </div>
              </div>
            ) : (
              displayExNames.map((ex) => {
                const sets = activeSets[ex] || []
                const exDone = isExDone(ex)
                const isCollapsed = collapsedDone[ex] && exDone
                const muscleTag = MUSCLE_TAGS[ex]
                const bestStr = getBestSet(ex)
                if (isCollapsed)
                  return (
                    <div key={ex} className="ex-block">
                      <div
                        className="ex-done-row"
                        onClick={() => setCollapsedDone((p) => ({ ...p, [ex]: false }))}
                      >
                        <div className="ex-done-tick">✓</div>
                        <div className="ex-done-name" title={ex}>
                          {ex}
                        </div>
                        {bestStr && <div className="ex-done-detail">{bestStr}</div>}
                      </div>
                    </div>
                  )
                return (
                  <div key={ex} className="ex-block">
                    <div className="ex-hdr">
                      <div className="ex-hdr-left">
                        <div className="ex-name" title={ex}>
                          {ex}
                        </div>
                        {muscleTag && <span className="muscle-tag">{muscleTag}</span>}
                      </div>
                      <div className="ex-last-lbl">Last</div>
                    </div>
                    {sets.length > 0 && (
                      <div className="set-col-hdrs">
                        <div className="sch">Set</div>
                        <div className="sch">Last</div>
                        <div className="sch">{units}</div>
                        <div className="sch">Reps</div>
                        <div className="sch" />
                      </div>
                    )}
                    {sets.map((s, si) => {
                      const prW = isPR(ex, si, s.w, s.typed)
                      return (
                        <div className="set-row" key={si}>
                          <div className="set-n">Set {si + 1}</div>
                          <div className="set-last-num">
                            {s.lastW !== '—' ? `${s.lastW}×${s.lastR}` : '—'}
                          </div>
                          <input
                            className={`set-inp${prW ? ' pr' : ''}`}
                            placeholder="0"
                            value={s.w}
                            onChange={(e) => updateSet(ex, si, 'w', e.target.value)}
                            onFocus={(e) => {
                              if (!s.typed && s.w) e.target.select()
                            }}
                            inputMode="decimal"
                          />
                          <input
                            className="set-inp"
                            placeholder="—"
                            value={s.r}
                            onChange={(e) => updateSet(ex, si, 'r', e.target.value)}
                            onFocus={(e) => {
                              if (!s.typed && s.r) e.target.select()
                            }}
                            inputMode="numeric"
                          />
                          <div
                            className={`set-tick${s.done ? ' on' : ''}`}
                            onClick={() => tickSet(ex, si)}
                          >
                            ✓
                          </div>
                        </div>
                      )
                    })}
                    <div className="ex-footer">
                      <button className="add-set-btn" onClick={() => addSet(ex)}>
                        ＋ Add Set
                      </button>
                      {sets.length > 1 && (
                        <button
                          className="rm-set-btn"
                          onClick={() => removeSet(ex, sets.length - 1)}
                        >
                          − Remove Set
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="sess-footer">
            {!isEdit && (
              <button className="sess-edit-btn" onClick={handleReset}>
                Reset
              </button>
            )}
            {isEdit && (
              <button className="sess-edit-btn active" onClick={() => setEditDay(null)}>
                ✓ Done
              </button>
            )}
            {!isEdit && (
              <button
                className="sess-finish-btn"
                disabled={!hasAnyDone}
                onClick={() => {
                  doFinish(dayName, sessionDate ?? Date.now())
                  setSessionScreen(null)
                  setSessionDate(null)
                  setCollapsedDone({})
                }}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  /* ════ MAIN APP ════ */
  return (
    <div className="app">
      <style>{S}</style>
      {toast && <div className="toast">{toast}</div>}
      <div className="topbar">
        <div className="brand">
          {tab === 'home' ? 'Overload' : tab === 'progress' ? 'Progress' : 'Profile'}
        </div>
      </div>

      {/* HOME */}
      {tab === 'home' && (
        <div className="home-scroll">
          <div className="ws-days u0">
            {DAYS_MON.map((_, i) => {
              const isToday = i === todayMonIdx
              const isViewing = viewingDayIdx === i
              const done = isDayDone(i)
              const sessLabel = getDaySessionLabel(i)
              const trainedSess = (trainedDays[i] || [])[0]
              const todaySessEntry = trainedSess
                ? sessionLog.find(
                    (s) =>
                      s.dayName === trainedSess &&
                      localDateStr(s.date) ===
                        localDateStr(today.getTime() - (todayMonIdx - i) * 86400000),
                  )
                : null
              const isPartialDay = done && todaySessEntry?.partial
              const partialPct = isPartialDay
                ? getSessPct(trainedSess, today.getTime() - (todayMonIdx - i) * 86400000)
                : 100
              const showCard = isToday || isViewing
              const dateColor = done
                ? isPartialDay
                  ? 'var(--orange)'
                  : 'var(--green)'
                : isViewing
                  ? 'var(--orange)'
                  : 'var(--ink3)'
              const dateFw = isToday || done ? 700 : 600
              return (
                <div
                  key={i}
                  className="ws-day"
                  onClick={() => {
                    if (i <= todayMonIdx) {
                      setViewingDayIdx(i === todayMonIdx ? null : i)
                    }
                  }}
                  style={{
                    background: showCard ? 'var(--white)' : 'transparent',
                    borderRadius: 14,
                    padding: '6px 2px',
                    boxShadow: showCard ? 'var(--sh)' : 'none',
                    transition: 'all .2s',
                  }}
                >
                  <div
                    className="ws-day-name"
                    style={{
                      color: showCard ? 'var(--ch)' : 'var(--ink3)',
                      fontWeight: showCard ? 700 : 600,
                    }}
                  >
                    {DAYS_MON[i]}
                  </div>
                  <div className="ws-ring-wrap">
                    <svg className="ws-ring-svg" viewBox="0 0 38 38">
                      <circle
                        cx="19"
                        cy="19"
                        r="16"
                        fill="none"
                        stroke="#D0D0D0"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      {done && !isPartialDay && (
                        <circle
                          cx="19"
                          cy="19"
                          r="16"
                          fill="rgba(45,122,58,.07)"
                          stroke="var(--green)"
                          strokeWidth="3"
                        />
                      )}
                      {done && isPartialDay && (
                        <circle
                          cx="19"
                          cy="19"
                          r="16"
                          fill="none"
                          stroke="var(--orange)"
                          strokeWidth="3"
                          strokeDasharray={`${(partialPct / 100) * CIRC} ${CIRC}`}
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '19px 19px' }}
                        />
                      )}
                      {done && isPartialDay && (
                        <circle cx="19" cy="19" r="14" fill="var(--white)" />
                      )}
                    </svg>
                    <div className="ws-ring-inner">
                      <span
                        className="ws-date-num"
                        style={{ color: dateColor, fontWeight: dateFw }}
                      >
                        {String(weekDates[i]).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <div
                    className="ws-sess-lbl"
                    style={{
                      color: done
                        ? isPartialDay
                          ? 'var(--orange)'
                          : 'var(--green)'
                        : 'transparent',
                      fontWeight: 700,
                    }}
                  >
                    {sessLabel || '‎'}
                  </div>
                </div>
              )
            })}
          </div>
          {isViewingPast && (
            <div className="past-day-banner u1">
              <div className="pdb-text">📅 Viewing past day</div>
              <button className="pdb-back" onClick={() => setViewingDayIdx(null)}>
                Back to today
              </button>
            </div>
          )}
          {!isViewingPast && allDays.length > 0 && <CtxLine text={ctxText} orange={ctxOrange} />}
          {allDays.length === 0 ? (
            <div className="empty-state u1">
              <div className="empty-state-icon">🏋️</div>
              <div className="empty-state-text">
                No workouts yet.
                <br />
                Add one below to start tracking.
              </div>
            </div>
          ) : (
            <div className="u1" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {allDays.map((dayName) => {
                const exNames = getDayExs(dayName)
                const viewIdx = viewingDayIdx !== null ? viewingDayIdx : todayMonIdx
                const isDoneToday = (trainedDays[viewIdx] || []).includes(dayName)
                const todaySess = isDoneToday
                  ? sessionLog.find(
                      (s) =>
                        s.dayName === dayName &&
                        localDateStr(s.date) ===
                          localDateStr(today.getTime() - (todayMonIdx - viewIdx) * 86400000),
                    )
                  : null
                const isPartialToday = isDoneToday && todaySess?.partial
                const isFullToday = isDoneToday && !isPartialToday
                const pct = isDoneToday
                  ? getSessPct(dayName, today.getTime() - (todayMonIdx - viewIdx) * 86400000)
                  : 0
                // A day shows no completion status at all until it's actually been finished —
                // live unsaved ticks in wSets shouldn't surface here just because you started.
                const barPct = isDoneToday ? pct : 0
                const showBar = barPct > 0
                const barColor = isFullToday ? 'var(--green)' : 'var(--orange)'
                const subtitle = exNames.slice(0, 3).join(' · ') + (exNames.length > 3 ? ' …' : '')
                return (
                  <div
                    key={dayName}
                    className="day-card"
                    onClick={() => {
                      // Reopening any already-fully-logged session (today's own, once
                      // finished, or any past day) reviews/edits the real saved record via
                      // the ephemeral buffer — only a fresh/in-progress today keeps using
                      // the live wSets buffer directly.
                      const reviewingSaved = viewIdx !== todayMonIdx || (isDoneToday && isFullToday)
                      if (!reviewingSaved) {
                        setSessionDate(null)
                        setSessionScreen(dayName)
                        return
                      }
                      const dateMs = today.getTime() - (todayMonIdx - viewIdx) * 86400000
                      const seed = {}
                      // Seed every exercise actually in the saved record too, not just ones
                      // still in the current template — otherwise an exercise logged that day
                      // but since removed from the day's template would have no data to show.
                      const namesToSeed = todaySess
                        ? [...new Set([...exNames, ...todaySess.exercises.map((e) => e.name)])]
                        : exNames
                      namesToSeed.forEach((ex) => {
                        const savedEx = todaySess?.exercises.find((e) => e.name === ex)
                        if (savedEx) {
                          // Sets now persist even when blank (as long as their exercise was
                          // touched), so tell apart a genuinely-blank preserved slot from a
                          // reviewed value instead of marking everything ticked/typed. Sets
                          // saved before this fix have no `done` field at all — treat those as
                          // done (the old behavior) rather than guessing they're unticked.
                          const isLegacySet = (s) => s.done === undefined
                          seed[ex] = savedEx.sets.map((s) => {
                            if (!s.w && !isLegacySet(s) && !s.done) {
                              const lastW = wSets[ex]?.[0]?.lastW ?? '—'
                              const lastR = wSets[ex]?.[0]?.lastR ?? '—'
                              return { w: '', r: '', done: false, lastW, lastR, typed: false }
                            }
                            return {
                              w: s.w,
                              r: s.r,
                              done: isLegacySet(s) ? true : !!s.done,
                              lastW: s.w,
                              lastR: s.r,
                              typed: true,
                            }
                          })
                        } else {
                          const setCount = (wSets[ex] || []).length || 1
                          const lastW = wSets[ex]?.[0]?.lastW ?? '—'
                          const lastR = wSets[ex]?.[0]?.lastR ?? '—'
                          // Pre-fill from the reference numbers, same as Add Set and a fresh
                          // session after finishing a prior day already do — matches those
                          // instead of leaving a blank field next to a "Last" reference.
                          seed[ex] = Array.from({ length: setCount }, () => ({
                            w: lastW !== '—' ? lastW : '',
                            r: lastR !== '—' ? lastR : '',
                            done: false,
                            lastW,
                            lastR,
                            typed: lastW !== '—',
                          }))
                        }
                      })
                      setPastEditSets(seed)
                      setSessionDate(dateMs)
                      setSessionScreen(dayName)
                    }}
                  >
                    <div className="day-card-body">
                      <div className="dc-top">
                        <div className="dc-left">
                          <span className={`dc-name${isFullToday ? ' green' : ''}`}>{dayName}</span>
                          {isFullToday && <span className="dc-pill-done">✓ Done</span>}
                          {isPartialToday && (
                            <span
                              style={{
                                background: 'var(--orange-l)',
                                color: 'var(--orange)',
                                border: '1px solid var(--orange-m)',
                                borderRadius: 20,
                                padding: '2px 9px',
                                fontSize: 11,
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {pct}%
                            </span>
                          )}
                        </div>
                        <div className="dc-right">
                          {!isDoneToday && <span className="dc-last">{getLastTrained(dayName)}</span>}
                          <div style={{ color: 'var(--ink3)', display: 'flex' }}>{TI.chevron}</div>
                        </div>
                      </div>
                      {exNames.length > 0 && <div className="dc-subtitle">{subtitle}</div>}
                    </div>
                    {showBar && (
                      <div className="dc-bar-wrap">
                        <div
                          className="dc-bar"
                          style={{ width: `${barPct}%`, background: barColor }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          <div className="add-workout-row u2" onClick={() => setShowAddWorkout(true)}>
            <div style={{ display: 'flex', color: 'var(--ch)' }}>{TI.plus}</div>
            <span>Add Workout</span>
          </div>
        </div>
      )}

      {/* ADD WORKOUT MODAL */}
      {showAddWorkout && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddWorkout(false)
          }}
        >
          <div className="modal-sheet">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <div>
                <div className="modal-title">{obSplit ? 'Pick exercises' : 'Add a workout'}</div>
                <div className="modal-sub">
                  {obSplit
                    ? `${obExStep + 1}/${obSplit.days.length} — ${obSplit.days[obExStep]}`
                    : 'Pick a split to add to your program'}
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddWorkout(false)
                  setObSplit(null)
                  setObExs({})
                  setObExStep(0)
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: 'none',
                  fontSize: 16,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
            {!obSplit ? (
              ALL_SPLITS.map((s) => {
                const alreadyHas = existingSplitIds.has(s.id)
                return (
                  <div
                    key={s.id}
                    className={`modal-split-opt${alreadyHas ? ' disabled' : ''}`}
                    onClick={() => {
                      if (alreadyHas) return
                      setObSplit(s)
                      setObExs({})
                      setObExStep(0)
                    }}
                  >
                    <div className="modal-split-emoji">{s.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div className="modal-split-name">{s.name}</div>
                      <div className="modal-split-desc">{s.desc}</div>
                    </div>
                    {alreadyHas && <div className="modal-split-badge">Added</div>}
                  </div>
                )
              })
            ) : (
              <div>
                <div
                  style={{ fontSize: 15, fontWeight: 700, color: 'var(--ch)', marginBottom: 12 }}
                >
                  {obSplit.days[obExStep]} exercises{' '}
                  <span style={{ color: 'var(--ink3)', fontWeight: 500, fontSize: 13 }}>
                    ({(obExs[obSplit.days[obExStep]] || []).length} selected)
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: 340,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  {getExLib(obSplit.days[obExStep]).map((ex) => {
                    const curDay = obSplit.days[obExStep]
                    const isOn = (obExs[curDay] || []).includes(ex)
                    return (
                      <div
                        key={ex}
                        className={`ex-opt${isOn ? ' on' : ''}`}
                        onClick={() => toggleObEx(curDay, ex)}
                      >
                        <div className="ex-opt-name">{ex}</div>
                        <div className="ex-opt-chk">✓</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button
                    className="btn-o"
                    style={{ flex: 1, padding: 12 }}
                    onClick={() => {
                      if (obExStep > 0) setObExStep((i) => i - 1)
                      else setObSplit(null)
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn-p"
                    style={{ flex: 2, padding: 12 }}
                    disabled={!(obExs[obSplit.days[obExStep]] || []).length}
                    onClick={async () => {
                      const isLast = obExStep === obSplit.days.length - 1
                      if (isLast) {
                        await addProgram()
                        setShowAddWorkout(false)
                      } else setObExStep((i) => i + 1)
                    }}
                  >
                    {obExStep === obSplit.days.length - 1
                      ? 'Add to program →'
                      : `Next — ${obSplit.days[obExStep + 1]} →`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROGRESS — redesigned to match Overload Web reference */}
      {tab === 'progress' &&
        (() => {
          const now = new Date()
          const monthSessions = sessionLog.filter((s) => {
            const d = new Date(s.date)
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
          })
          const monthSets = monthSessions.reduce(
            (a, s) => a + s.exercises.reduce((b, e) => b + e.sets.length, 0),
            0,
          )
          const monthVolume = monthSessions.reduce(
            (a, s) =>
              a +
              s.exercises.reduce(
                (b, e) =>
                  b +
                  e.sets.reduce(
                    (c, st) => c + (parseFloat(st.w) || 0) * (parseFloat(st.r) || 0),
                    0,
                  ),
                0,
              ),
            0,
          )
          const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
          const categories = [...new Set(programs.flatMap((p) => p.days || []))]
          const activeCat = progExCat && categories.includes(progExCat) ? progExCat : categories[0]
          const exToCat = {}
          programs.forEach((p) =>
            Object.entries(p.exs || {}).forEach(([day, exs]) =>
              (exs || []).forEach((e) => {
                if (!exToCat[e]) exToCat[e] = day
              }),
            ),
          )
          const rangeDaysStrength = { Week: 7, '1M': 30, '6M': 182, '1Y': 365, All: 100000 }[
            progRangeStrength
          ]
          const rangeCutoffStrength = Date.now() - rangeDaysStrength * 86400000
          const allTrackedExs = [
            ...new Set(sessionLog.flatMap((s) => s.exercises.map((e) => e.name))),
          ].filter((name) => !activeCat || exToCat[name] === activeCat)
          const exWithProgress = allTrackedExs
            .map((exName) => {
              const sessWithEx = sessionLog
                .filter(
                  (s) =>
                    s.exercises.some((e) => e.name === exName) &&
                    new Date(s.date).getTime() >= rangeCutoffStrength,
                )
                .slice()
                .reverse()
              const series = sessWithEx
                .map((s) => {
                  const exData = s.exercises.find((e) => e.name === exName)
                  const maxW = Math.max(
                    ...exData.sets.map((st) => parseFloat(st.w) || 0).filter((v) => v > 0),
                  )
                  return { date: s.date, weight: maxW }
                })
                .filter((p) => p.weight > 0)
              if (series.length === 0) return null
              const first = series[0].weight,
                last = series[series.length - 1].weight
              const pct = first ? Math.round(((last - first) / first) * 100) : 0
              return { name: exName, series, first, last, sessions: series.length, pct }
            })
            .filter(Boolean)
          const rangeDaysHistory = { Week: 7, '1M': 30, '6M': 182, '1Y': 365, All: 100000 }[
            progRangeHistory
          ]
          const rangeCutoffHistory = Date.now() - rangeDaysHistory * 86400000
          const rangeFilteredSessions = sessionLog.filter(
            (s) => new Date(s.date).getTime() >= rangeCutoffHistory,
          )

          return (
            <div className="prog-scroll">
              <div className="prog-hdr-row u0" style={{ justifyContent: 'flex-end' }}>
                <div className="prog-month">{monthLabel}</div>
              </div>

              {/* Hero card */}
              <div className="prog-hero u0">
                <div className="prog-hero-blob" />
                <div className="prog-hero-lbl">This month</div>
                {monthSessions.length === 0 ? (
                  <>
                    <div className="prog-hero-title">Log a workout</div>
                    <div className="prog-hero-sub">Your progress will show up here</div>
                  </>
                ) : (
                  <>
                    <div className="prog-hero-title">
                      {monthSessions.length} workout{monthSessions.length !== 1 ? 's' : ''} logged
                    </div>
                    <div className="prog-hero-sub">Keep up the momentum</div>
                  </>
                )}
                <div className="prog-hero-stats">
                  <div className="phs-item">
                    <div className="phs-val">{monthSessions.length}</div>
                    <div className="phs-lbl">sessions</div>
                  </div>
                  <div className="phs-item">
                    <div className="phs-val">{monthSets}</div>
                    <div className="phs-lbl">sets</div>
                  </div>
                  <div className="phs-item">
                    <div className="phs-val">
                      {monthVolume >= 1000 ? `${(monthVolume / 1000).toFixed(1)}k` : monthVolume}
                    </div>
                    <div className="phs-lbl">volume</div>
                  </div>
                </div>
              </div>

              <div className="lbl u2" style={{ marginTop: 4 }}>
                Calendar
              </div>
              <div
                className="u2"
                style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 16,
                  padding: '16px',
                  boxShadow: 'var(--sh)',
                }}
              >
                <CalendarView sessionLog={sessionLog} />
              </div>

              <div className="lbl u2" style={{ marginTop: 4 }}>
                Strength curves
              </div>
              <div
                className="u2"
                style={{
                  background: 'var(--white)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 16,
                  padding: '16px',
                  boxShadow: 'var(--sh)',
                }}
              >
                  <div className="range-pills" style={{ marginBottom: 12 }}>
                    {['Week', '1M', '6M', '1Y', 'All'].map((r) => (
                      <div
                        key={r}
                        className={`range-pill${progRangeStrength === r ? ' on' : ''}`}
                        onClick={() => setProgRangeStrength(r)}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                  {categories.length > 0 && (
                    <div className="cat-tabs">
                      {categories.map((c) => (
                        <div
                          key={c}
                          className={`cat-tab${activeCat === c ? ' on' : ''}`}
                          onClick={() => setProgExCat(c)}
                        >
                          {c}
                        </div>
                      ))}
                    </div>
                  )}
                  {exWithProgress.length === 0 ? (
                    <div
                      style={{
                        background: 'var(--white)',
                        border: '1.5px solid var(--border)',
                        borderRadius: 16,
                        padding: '20px 16px',
                        boxShadow: 'var(--sh)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--ch)',
                          marginBottom: 4,
                        }}
                      >
                        No data in this range
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--ink3)' }}>
                        Log sessions for this category to see strength curves here.
                      </div>
                    </div>
                  ) : (
                    exWithProgress.map((ex) => {
                      const diff = ex.last - ex.first
                      const open = !!expandedStr[ex.name]
                      return (
                        <div key={ex.name} className="str-card">
                          <div
                            className="str-card-hdr"
                            onClick={() => setExpStr((p) => ({ ...p, [ex.name]: !p[ex.name] }))}
                          >
                            <div>
                              <div className="str-card-name" style={{ color: 'var(--green)' }}>
                                {ex.name}
                              </div>
                              <div className="str-card-sub">
                                {ex.sessions} session{ex.sessions !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="str-card-nums">
                                <span style={{ color: 'var(--ink3)' }}>{ex.first}</span>{' '}
                                <span style={{ color: 'var(--ink3)' }}>→</span>{' '}
                                <b style={{ color: 'var(--ch)', fontSize: 15 }}>
                                  {ex.last}
                                  {units}
                                </b>
                                {diff !== 0 && (
                                  <span
                                    style={{
                                      background: diff > 0 ? 'var(--green-l)' : 'var(--orange-l)',
                                      color: diff > 0 ? 'var(--green)' : 'var(--orange)',
                                      borderRadius: 20,
                                      padding: '2px 8px',
                                      fontWeight: 700,
                                      fontSize: 11,
                                      marginLeft: 4,
                                    }}
                                  >
                                    {diff > 0 ? '+' : ''}
                                    {ex.pct}%
                                  </span>
                                )}
                              </div>
                              <span className={`hist-sess-chev${open ? ' open' : ''}`}>▼</span>
                            </div>
                          </div>
                          {open && (
                            <div className="str-card-body">
                              <div className="chart-hdr">
                                <span className="chart-title">Weight progression</span>
                                <span className="chart-delta">
                                  {diff >= 0 ? '+' : ''}
                                  {diff}
                                  {units} / {ex.sessions} session{ex.sessions !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <WeightChart points={ex.series} />
                              <div className="chart-stats-row">
                                <div className="chart-stat">
                                  <div className="chart-stat-lbl">Started</div>
                                  <div className="chart-stat-val">
                                    {ex.first}
                                    {units}
                                  </div>
                                </div>
                                <div className="chart-stat">
                                  <div className="chart-stat-lbl">Sessions</div>
                                  <div className="chart-stat-val">{ex.sessions}</div>
                                </div>
                                <div className="chart-stat">
                                  <div className="chart-stat-lbl">Current max</div>
                                  <div className="chart-stat-val" style={{ color: 'var(--green)' }}>
                                    {ex.last}
                                    {units}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

              <div className="u2" style={{ marginTop: 20 }}>
                  <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
                  <div className="range-row">
                    <div className="lbl">
                      Recent sessions
                    </div>
                    <div className="range-pills">
                      {['Week', '1M', '6M', '1Y', 'All'].map((r) => (
                        <div
                          key={r}
                          className={`range-pill${progRangeHistory === r ? ' on' : ''}`}
                          onClick={() => setProgRangeHistory(r)}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                  {rangeFilteredSessions.length > 0 && (
                    <div
                      className="range-pill on"
                      style={{ display: 'inline-block', marginBottom: 12, cursor: 'pointer' }}
                      onClick={() => exportHistoryPdf(rangeFilteredSessions, units)}
                    >
                      Export PDF
                    </div>
                  )}
                  {rangeFilteredSessions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <div className="empty-state-text">No sessions in this range.</div>
                    </div>
                  ) : (
                    rangeFilteredSessions.map((sess) => (
                      <div className="hist-sess" key={sess.id}>
                        <div
                          className="hist-sess-hdr"
                          onClick={() => setExpS((p) => ({ ...p, [sess.id]: !p[sess.id] }))}
                        >
                          <div>
                            <div
                              className="hist-sess-date"
                              style={{ color: sess.partial ? 'var(--orange)' : 'var(--green)' }}
                            >
                              {sess.dayName}
                            </div>
                            <div className="hist-sess-name">
                              {fmtDate(sess.date)} ·{' '}
                              {sess.exercises.reduce((a, e) => a + e.sets.length, 0)} sets
                            </div>
                          </div>
                          <span className={`hist-sess-chev${expandedSess[sess.id] ? ' open' : ''}`}>
                            ▼
                          </span>
                        </div>
                        {expandedSess[sess.id] && (
                          <div className="hist-sess-body">
                            {sess.exercises.map((ex, ei) => (
                              <div key={ei}>
                                <div className="hist-ex-name">{ex.name}</div>
                                {ex.sets.map((s, si) => (
                                  <div className="hist-set-row" key={si}>
                                    <div className="hist-set-n">Set {si + 1}</div>
                                    <div className="hist-set-val">
                                      {s.done ? `${s.w} ${units} × ${s.r} reps` : '—'}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
            </div>
          )
        })()}

      {/* PROFILE */}
      {tab === 'profile' && (
        <div className="profile-scroll">
          <div className="profile-user-card">
            <div className="puc-av" onClick={() => setShowAvatarPicker((v) => !v)}>
              {userAvatar || ini(userName)}
            </div>
            <div style={{ flex: 1 }}>
              {editingName ? (
                <input
                  className="puc-name-inp"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                  onBlur={async () => {
                    if (nameInput.trim()) {
                      setUserName(nameInput.trim())
                      if (user) await updateProfile({ name: nameInput.trim() })
                    }
                    setEditName(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (nameInput.trim()) setUserName(nameInput.trim())
                      setEditName(false)
                    }
                  }}
                />
              ) : (
                <div
                  className="puc-name-row"
                  onClick={() => {
                    setNameInput(userName)
                    setEditName(true)
                  }}
                >
                  <div className="puc-name">{userName}</div>
                  <div style={{ color: 'var(--ink3)', display: 'flex' }}>{TI.edit}</div>
                </div>
              )}
              <div className="puc-sub">
                {user ? `Signed in as ${user.email}` : 'Guest — data not saved'}
              </div>
            </div>
          </div>
          {showAvatarPicker && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                padding: '0 20px 16px',
                background: 'var(--white)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {AVATAR_OPTS.map((a) => (
                <div
                  key={a}
                  onClick={async () => {
                    setUserAvatar(a)
                    setShowAvatarPicker(false)
                    if (user) await updateProfile({ avatar: a })
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    cursor: 'pointer',
                    border: a === userAvatar ? '2px solid var(--ch)' : '2px solid transparent',
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}
          {!user && (
            <div
              style={{
                margin: '0 0 4px',
                background: 'var(--orange-l)',
                borderTop: '1px solid var(--orange-m)',
                borderBottom: '1px solid var(--orange-m)',
                padding: '12px 20px',
              }}
            >
              <div
                style={{ fontSize: 13, color: 'var(--orange)', fontWeight: 700, marginBottom: 4 }}
              >
                You're using guest mode
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink3)', marginBottom: 8 }}>
                Your data is saved locally. Sign in to back it up to the cloud.
              </div>
              <button
                className="google-btn"
                style={{ fontSize: 13, padding: '10px' }}
                onClick={async () => await signInWithGoogle()}
              >
                {TI.google} Sign in with Google
              </button>
            </div>
          )}

          <div className="profile-section-lbl">Preferences</div>
          <div className="profile-group">
            <div className="profile-row">
              <div className="profile-row-icon">{TI.weight}</div>
              <div className="profile-row-label">Units</div>
              <div className="units-toggle">
                <div
                  className={`ut-opt${units === 'kg' ? ' on' : ''}`}
                  onClick={async () => {
                    setUnits('kg')
                    if (user) await updateProfile({ units: 'kg' })
                  }}
                >
                  kg
                </div>
                <div
                  className={`ut-opt${units === 'lbs' ? ' on' : ''}`}
                  onClick={async () => {
                    setUnits('lbs')
                    if (user) await updateProfile({ units: 'lbs' })
                  }}
                >
                  lbs
                </div>
              </div>
            </div>
            <div className="profile-row">
              <div className="profile-row-icon">{TI.bell}</div>
              <div className="profile-row-label">Training reminders</div>
              <button
                className={`notif-toggle${notifEnabled ? ' on' : ''}`}
                onClick={async () => {
                  setNotif((p) => !p)
                  if (user) await updateProfile({ notif_enabled: !notifEnabled })
                }}
              >
                <div className="notif-knob" />
              </button>
            </div>
          </div>
          <div className="profile-section-lbl">Support & Legal</div>
          <div className="profile-group">
            {[
              { icon: TI.megaphone, label: 'Request a Feature' },
              { icon: TI.mail, label: 'Support Email' },
              { icon: TI.doc, label: 'Terms & Conditions' },
              { icon: TI.shield, label: 'Privacy Policy' },
            ].map((r, i) => (
              <div className="profile-row" key={i}>
                <div className="profile-row-icon">{r.icon}</div>
                <div className="profile-row-label">{r.label}</div>
                <div className="profile-row-chev">{TI.chevron}</div>
              </div>
            ))}
          </div>
          <div className="profile-section-lbl">Account Actions</div>
          <div className="profile-group">
            {user && (
              <div
                className="profile-row"
                onClick={async () => {
                  await signOut()
                  localStorage.removeItem('overload_migrated')
                  localStorage.removeItem('overload_migration_started')
                  setScreen('splash')
                  setPrograms([])
                  setSessionLog([])
                  setWSets({})
                }}
              >
                <div className="profile-row-icon">{TI.logout}</div>
                <div className="profile-row-label">Logout</div>
                <div className="profile-row-chev">{TI.chevron}</div>
              </div>
            )}
            <div
              className="profile-row"
              onClick={async () => {
                if (!user) {
                  if (!window.confirm("Clear your local guest data? This can't be undone.")) return
                  localStorage.removeItem('overload_programs')
                  localStorage.removeItem('overload_sessionLog')
                  localStorage.removeItem('overload_wSets')
                  setPrograms([])
                  setSessionLog([])
                  setWSets({})
                  setScreen('splash')
                  return
                }
                if (
                  !window.confirm(
                    'Delete your account? This permanently removes all your programs, sessions, and workout data. This cannot be undone.',
                  )
                )
                  return
                const { error } = await deleteAccount()
                if (error) {
                  showToast("Couldn't delete account — try again")
                  return
                }
                localStorage.removeItem('overload_migrated')
                localStorage.removeItem('overload_migration_started')
                localStorage.removeItem('overload_programs')
                localStorage.removeItem('overload_sessionLog')
                localStorage.removeItem('overload_wSets')
                setScreen('splash')
                setPrograms([])
                setSessionLog([])
                setWSets({})
                showToast('Account deleted')
              }}
            >
              <div className="profile-row-icon">{TI.trash}</div>
              <div className="profile-row-label" style={{ color: '#cc3333' }}>
                Delete Account
              </div>
              <div className="profile-row-chev">{TI.chevron}</div>
            </div>
          </div>
          <div className="profile-version">VERSION 1.0.0</div>
        </div>
      )}

      <div className="tab-bar">
        {[
          { id: 'home', icon: TI.home, label: 'Home' },
          { id: 'progress', icon: TI.progress, label: 'Progress' },
          { id: 'profile', icon: TI.profile, label: 'Profile' },
        ].map((t) => (
          <button
            key={t.id}
            className={`tab-item${tab === t.id ? ' on' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <div className="tab-icon">{t.icon}</div>
            <div className="tab-label">{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
