/* 时间线(44s):车架 → 耧斗调节板 → 三耧腿 → 挞 → 慢行播种 → 均匀度展示 →
   开度对比 → 手动(←/→ 调开度) */
(function (MECH) {
  var KS = MECH.KS, D = MECH.DIM;

  MECH.PHASES = [
    { id: "base", name: "BASE · 车架双辕双轮", dur: 4, dot: "yellow", mode: "ASSEMBLING",
      cam: { theta: 0.55, phi: 1.20, r: 4.2, target: [0, 0.5, 0] }, drift: 0.03 },
    { id: "hopper", name: "HOPPER · 耧斗调节板", dur: 4, dot: "teal", mode: "ASSEMBLING",
      cam: { theta: 0.30, phi: 1.24, r: 2.8, target: [0, 0.9, 0.1] }, drift: 0.01 },
    { id: "legs", name: "LEGS · 三耧腿", dur: 4, dot: "orange", mode: "ASSEMBLING",
      cam: { theta: -0.35, phi: 1.22, r: 3.2, target: [0, 0.7, 0] }, drift: 0.012 },
    { id: "ta", name: "TA · 挞(覆土板)", dur: 3, dot: "blue", mode: "ASSEMBLING",
      cam: { theta: -0.7, phi: 1.20, r: 4.0, target: [0, 0.4, -0.5] }, drift: 0.02 },
    { id: "slow", name: "SOW · 行进播种(开度 0.5)", dur: 8, dot: "green", mode: "SOWING",
      cam: { theta: 0.75, phi: 1.20, r: 4.4, target: [0, 0.5, 0.3] }, drift: 0.01 },
    { id: "rows", name: "ROWS · 三沟均匀度", dur: 6, dot: "yellow", mode: "ROWS",
      cam: { theta: -0.15, phi: 1.30, r: 3.2, target: [0, 0.35, 0.5] }, drift: 0.006 },
    { id: "gate", name: "GATE · 开度对比(←/→)", dur: 7, dot: "pink", mode: "GATE",
      cam: { theta: 0.30, phi: 1.26, r: 3.0, target: [0, 0.7, 0.1] }, drift: 0.008 },
    { id: "manual", name: "MANUAL · ←/→ 调开度行进", dur: 8, dot: "red", mode: "MANUAL",
      cam: { theta: 0.55, phi: 1.20, r: 4.6, target: [0, 0.5, 0.3] }, drift: 0.02 }
  ];
  MECH.PHASE_IDS = ["base", "hopper", "legs", "ta", "slow", "rows", "gate", "manual"];

  var speeds = { slow: D.v.slow, rows: D.v.slow, gate: D.v.fast, manual: D.v.slow };

  MECH.newState = KS.newState;

  MECH.tick = function (st, ph, pt, dt) {
    if (ph.id !== st.lastPhase) {
      st.lastPhase = ph.id;
      st.manual = ph.id === "manual" || ph.id === "gate";
      if (ph.id === "gate") st.opening = 0.5;
    }
    st.vTarget = speeds[ph.id] || 0;
    if (st.manual && MECH.keys) {
      var L = MECH.keys.left, R = MECH.keys.right;
      if (L && !st._keyL) st.opening = Math.min(1, st.opening + 0.15);
      if (R && !st._keyR) st.opening = Math.max(0.1, st.opening - 0.15);
      st._keyL = L; st._keyR = R;
    }
    var d0 = st.drops.map(function (d) { return d.length; });
    KS.step(st, dt);
    /* 种子粒子:三管腿尖落下 */
    for (var k = 0; k < 3; k++) {
      if (st.drops[k].length > d0[k]) {
        MECH.Scene3D.spawnPuff(0, 0.10, D.zLegs[k], {
          max: 0.55, base: 0.045, vx: 0, vy: -0.5, vz: 0.02,
          opacity: 0.8, tint: 0xD8C08E, grow: 0.5
        });
      }
    }
  };

  MECH.status = function (st, ph, pt) {
    var pill = ph.name;
    if (ph.id === "slow" || ph.id === "gate" || ph.id === "manual") {
      pill = ph.name + " · 开度 " + Math.round(st.opening * 100) + "%";
    }
    return {
      mode: ph.mode,
      hot: st.opening > 0.8,
      pill: pill,
      a: "行速 " + st.v.toFixed(2) + " m/s",
      b: "开度 " + Math.round(st.opening * 100) + "%",
      c: "里程 " + (st.dist / D.CHI).toFixed(1) + " 尺"
    };
  };

  MECH.pinnedFor = function (ph) {
    function E(id) { var e = MECH.Parts.entry(id); return e ? (e.anchor || e.group) : null; }
    if (ph.id === "hopper") return [{ id: "p-hp", obj: E("hopper"), text: "耧斗 · 调节板开度可调" }];
    if (ph.id === "legs") return [
      { id: "p-l1", obj: E("leg0"), text: "耧腿 ×3 · 中空管下种" },
      { id: "p-l3", obj: E("leg2"), text: "三腿等距 · 行距一致", tone: "white" }
    ];
    if (ph.id === "ta") return [{ id: "p-ta", obj: E("ta"), text: "挞 · 后拖覆土" }];
    if (ph.id === "slow" || ph.id === "rows" || ph.id === "gate" || ph.id === "manual") return [
      { id: "p-hp", obj: E("hopper"), text: "下种率 ∝ 开度", tone: "white" },
      { id: "p-l1", obj: E("leg0"), text: "三管均匀 ±2%" }
    ];
    return [];
  };
})(window.MECH = window.MECH || {});
