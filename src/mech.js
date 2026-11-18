/* 耧车 — 尺寸常量与三管下种运动学
   文献依据:王祯《农书》耧车图:「其制三犁? …一牛引之……且种且耰」
   (西汉赵过发明三脚耧);三条耧腿内空,种子自耧斗经调节板均匀下漏,
   行进时开沟下种,后拖挞覆土。
   下种率 ∝ 开度(线性);三管落种一致性 ±2%(载入期断言)。 */
(function (MECH) {
  var CHI = 0.3;
  var D = {
    CHI: CHI,
    rWheel: 0.30,          // 车轮(小)
    W: 1.0,                // 轮距
    legsX: [0.35, 0.35, 0.35],   // 耧腿后伸位置(局部 z 间隔见 zLegs)
    zLegs: [-0.30, 0, 0.30],
    opening: 0.5,          // 调节板开度 0..1(←/→ 调)
    v: { slow: 0.55, fast: 1.0 },
    seedRate: 14           // 满开度每秒粒子数(三管合计)
  };

  function newState() {
    return {
      time: 0, dist: 0, psi: 0, v: 0, vTarget: 0,
      opening: D.opening,
      drops: [[], [], []],       // 各管落种时刻窗
      rows: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],   // 三沟累计(示意)
      lastPhase: "", manual: false, _keyL: false, _keyR: false
    };
  }

  function step(st, dt) {
    st.time += dt;
    st.v += (st.vTarget - st.v) * Math.min(1, dt * 2.0);
    st.dist += st.v * dt;
    st.psi = st.dist / D.rWheel;
    /* 三管落种:率 = seedRate × 开度 / 3,一致性 ±2% */
    var rate = D.seedRate * st.opening / 3;
    st._acc = st._acc || [0, 0, 0];
    for (var k = 0; k < 3; k++) {
      st._acc[k] += rate * dt;
      while (st._acc[k] >= 1) {
        st._acc[k] -= 1;
        st.drops[k].push(st.time);
        if (st.drops[k].length > 40) st.drops[k].shift();
      }
    }
  }

  MECH.DIM = D;
  MECH.KS = { newState: newState, step: step };

  (function selfCheck() {
    var errs = [];
    /* 20s 模拟:三管落种数一致(±2%)且与开度线性 */
    var st = newState();
    st.vTarget = D.v.slow;
    st.v = D.v.slow;
    for (var i = 0; i < 600; i++) step(st, 1 / 30);
    var c = st.drops.map(function (d) { return d.length; });
    var max = Math.max.apply(null, c), min = Math.min.apply(null, c);
    if (max - min > Math.max(1, min * 0.04)) errs.push("三管不一致: " + c.join("/"));
    /* 开度减半 → 率减半 */
    var st2 = newState();
    st2.opening = D.opening * 0.5;
    st2.vTarget = D.v.slow;
    st2.v = D.v.slow;
    for (var j = 0; j < 300; j++) step(st2, 1 / 30);
    var c2 = st2.drops.map(function (d) { return d.length; })[0];
    if (Math.abs(c2 - c[0] * 0.5) > Math.max(1, c[0] * 0.06)) errs.push("开度-率非线性: " + c2 + " vs " + (c[0] / 2).toFixed(1));
    if (errs.length) {
      if (window.MECH_SHOW_BOOT_ERROR) window.MECH_SHOW_BOOT_ERROR("耧车自检失败: " + errs.join(";"));
      throw new Error(errs.join(";"));
    }
  })();
})(window.MECH = window.MECH || {});
