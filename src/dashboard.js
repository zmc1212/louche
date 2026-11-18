/* 仪表盘:①行速+下种率 ②三管均匀性 ③开度板 ④沟内种子分布 */
(function (MECH) {
  var el = {}, D = MECH.DIM;
  var soft = "rgba(233,238,242,0.5)";

  MECH.DASH = { panels: [
    { title: "SOW · 行速下种率", meta: "率 ∝ 开度", dot: "teal",
      html: '<div class="big" id="d-rate">0</div><div class="k">粒/s · 三管合计</div>' +
            '<div class="bar"><i id="d-bar"></i></div>' +
            '<div class="rowline"><span>行速</span><b id="d-v">0.00 m/s</b></div>',
      init: initSow, draw: drawSow },
    { title: "UNIFORM · 三管均匀性", meta: "±2% 断言", dot: "blue", canvasH: 96, draw: drawUniform },
    { title: "GATE · 开度板", meta: "←/→ 调节", dot: "yellow",
      html: '<div class="big" id="d-gate">50%</div><div class="k">调节板开度</div>' +
            '<div class="bar"><i id="d-gbar"></i></div>' +
            '<div class="mini">下种率随开度线性</div>',
      init: initGate, draw: drawGate },
    { title: "ROWS · 沟内分布", meta: "顶视三沟", dot: "green", canvasH: 96, draw: drawRows }
  ] };

  function initSow(sec) {
    el.rate = sec.querySelector("#d-rate");
    el.bar = sec.querySelector("#d-bar");
    el.v = sec.querySelector("#d-v");
  }
  function initGate(sec) {
    el.gate = sec.querySelector("#d-gate");
    el.gbar = sec.querySelector("#d-gbar");
  }

  function drawSow(st, ph, pt, ctx, w, h) {
    var rate = D.seedRate * st.opening;
    if (el.rate) el.rate.textContent = rate.toFixed(1);
    if (el.bar) el.bar.style.width = Math.round(st.opening * 100) + "%";
    if (el.v) el.v.textContent = st.v.toFixed(2) + " m/s";
  }

  /* ② 三管计数条(应等高) */
  function drawUniform(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var c = st.drops.map(function (d) { return d.length; });
    var max = Math.max(1, Math.max.apply(null, c));
    for (var k = 0; k < 3; k++) {
      var x = 10 + k * (w - 20) / 3;
      var bw = (w - 20) / 3 - 10;
      ctx.fillStyle = "rgba(233,238,242,0.12)";
      ctx.fillRect(x, 12, bw, h - 34);
      ctx.fillStyle = ["#7FD8D8", "#E9C93C", "#6FBF73"][k];
      ctx.fillRect(x, 12 + (h - 34) * (1 - c[k] / max), bw, (h - 34) * c[k] / max);
      ctx.fillStyle = soft;
      ctx.font = "700 9px serif";
      ctx.textAlign = "center";
      ctx.fillText("管" + (k + 1), x + bw / 2, h - 6);
      ctx.font = "700 8px Menlo, monospace";
      ctx.fillStyle = "#E9EEF2";
      ctx.fillText(c[k], x + bw / 2, 10);
    }
    var dev = max - Math.min.apply(null, c);
    ctx.fillStyle = dev <= Math.max(1, max * 0.04) ? "#6FBF73" : "#D6543A";
    ctx.font = "700 8px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("偏差 " + dev + " 粒 · " + (dev <= Math.max(1, max * 0.04) ? "均匀 ✓" : "超差"), 4, h - 22);
  }

  function drawGate(st, ph, pt, ctx, w, h) {
    if (el.gate) el.gate.textContent = Math.round(st.opening * 100) + "%";
    if (el.gbar) el.gbar.style.width = Math.round(st.opening * 100) + "%";
  }

  /* ④ 沟内分布:顶视,三沟种子落点(窗内) */
  function drawRows(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var ox = 14, oy = h / 2, sx = 9, sz = 26;
    ctx.strokeStyle = "rgba(233,238,242,0.16)";
    D.zLegs.forEach(function (z) {
      var y = oy + z * 0.9;
      ctx.beginPath(); ctx.moveTo(ox, y); ctx.lineTo(w - 8, y); ctx.stroke();
    });
    var span = 6;
    for (var k = 0; k < 3; k++) {
      for (var i = 0; i < st.drops[k].length; i++) {
        var dt = st.time - st.drops[k][i];
        if (dt > span) continue;
        var x = ox + (span - dt) * sx;
        ctx.fillStyle = ["#7FD8D8", "#E9C93C", "#6FBF73"][k];
        ctx.beginPath(); ctx.arc(x, oy + D.zLegs[k] * 0.9, 1.6, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("行进 →(窗 6s)", 4, 10);
    ctx.fillText("行距一致", w - 46, 10);
  }
})(window.MECH = window.MECH || {});
