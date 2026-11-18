/* 图纸面板(B 键):耧车侧视总图 + 三管下种详图 + 尺寸表 */
(function (MECH) {
  var red = "#8C2F1E";

  function arrow(ctx, x1, y1, x2, y2, text, below) {
    ctx.strokeStyle = "rgba(42,38,32,0.4)";
    ctx.fillStyle = "rgba(42,38,32,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    var s = 4, dir = x2 >= x1 ? 1 : -1;
    ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - s * dir, y2 - 3); ctx.lineTo(x2 - s * dir, y2 + 3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + s * dir, y1 - 3); ctx.lineTo(x1 + s * dir, y1 + 3); ctx.closePath(); ctx.fill();
    ctx.font = "600 10px Menlo, monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, (x1 + x2) / 2, below ? (y1 + 13) : (y1 - 5));
  }

  MECH.BP = {
    no: "Fig. 07 · 复原总图",
    title: "三脚耧车 · 开沟下种覆土一体",
    src: "王祯《农书》耧车图 · 西汉赵过发明(三脚耧) · 《天工开物》引",
    draw: function (ctx, w, h) {
      var D = MECH.DIM;
      ctx.clearRect(0, 0, w, h);
      var chainH = 44, chainY = h - chainH - 12, topY = 34;
      var ink = "#2A2620";
      ctx.fillStyle = red;
      ctx.font = "700 11px Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("下种率 ∝ 开度(线性)· 三管一致性 ±2%(载入断言)· 且种且耰一牛引之", w * 0.045, topY - 10);

      /* ============ 左:侧视图 ============ */
      var S = Math.min(w * 0.44 / 3.4, (chainY - topY - 26) / 1.8);
      var ox = w * 0.05, oy = chainY - 16;
      var X = function (m) { return ox + (m + 1.5) * S; }, Y = function (m) { return oy - m * S; };
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("侧视 SIDE(车首向右)", ox, Y(1.7));
      /* 车轮 */
      ctx.beginPath(); ctx.arc(X(0), Y(D.rWheel), D.rWheel * S, 0, Math.PI * 2); ctx.stroke();
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(X(0), Y(D.rWheel));
        ctx.lineTo(X(0) + Math.cos(a) * D.rWheel * S * 0.9, Y(D.rWheel) - Math.sin(a) * D.rWheel * S * 0.9);
        ctx.stroke();
      }
      /* 车架 + 双辕 */
      ctx.strokeRect(X(-0.5), Y(D.rWheel + 0.10), 1.0 * S, 0.09 * S);
      ctx.beginPath();
      ctx.moveTo(X(0), Y(D.rWheel + 0.14));
      ctx.lineTo(X(1.2), Y(D.rWheel + 0.34));
      ctx.stroke();
      /* 耧斗 + 调节板 + 三腿(向后) */
      ctx.strokeRect(X(-0.75), Y(D.rWheel + 0.95), 0.26 * S, 0.15 * S);
      ctx.fillText("耧斗", X(-0.75), Y(D.rWheel + 0.95) - 5);
      ctx.beginPath();
      ctx.moveTo(X(-0.62), Y(D.rWheel + 0.95));
      ctx.lineTo(X(-0.62), Y(0.06));
      ctx.stroke();
      ctx.fillText("耧腿(中空)", X(-0.60), Y(0.36));
      /* 腿尖开沟 */
      ctx.beginPath();
      ctx.moveTo(X(-0.62), Y(0.06));
      ctx.lineTo(X(-0.62), Y(-0.02));
      ctx.stroke();
      /* 挞 */
      ctx.strokeRect(X(-1.15), Y(0.06), 0.6 * S, 0.05 * S);
      ctx.fillText("挞(覆土)", X(-1.15), Y(0.06) + 12);
      /* 行进箭头 */
      ctx.strokeStyle = "rgba(42,38,32,0.45)";
      ctx.beginPath();
      ctx.moveTo(X(-0.2), Y(-0.12));
      ctx.lineTo(X(0.8), Y(-0.12));
      ctx.stroke();
      ctx.fillText("行进 →", X(0.2), Y(-0.16));

      /* ============ 右:三管下种详图 ============ */
      var ox2 = w * 0.55;
      ctx.font = "700 11px sans-serif";
      ctx.fillStyle = ink;
      ctx.fillText("三管下种(顶视)", ox2, topY + 18);
      var gx = ox2, gy = topY + 32, gw = w - ox2 - 24, gh = chainY - gy - 44;
      ctx.strokeStyle = "rgba(42,38,32,0.5)";
      ctx.strokeRect(gx, gy, gw, gh);
      /* 三沟 */
      D.zLegs.forEach(function (z, k) {
        var y = gy + gh / 2 + z / 0.4 * gh * 0.32;
        ctx.strokeStyle = "rgba(42,38,32,0.45)";
        ctx.beginPath(); ctx.moveTo(gx + 8, y); ctx.lineTo(gx + gw - 8, y); ctx.stroke();
        ctx.font = "600 8px sans-serif";
        ctx.fillText("沟" + (k + 1), gx + 8, y - 4);
        /* 种子点 */
        ctx.fillStyle = ink;
        for (var i = 0; i < 10; i++) {
          ctx.beginPath();
          ctx.arc(gx + 20 + i * (gw - 40) / 9, y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.fillStyle = red;
      ctx.font = "700 10px Menlo, monospace";
      ctx.fillText("行距一致 · 落种均匀(±2%)", gx + 8, gy + gh - 8);

      /* ============ 底部:参数链 ============ */
      var boxes = [
        ["牛引双辕", "一牛引之"], ["耧斗调板", "开度可调"], ["三耧腿", "中空下种管"],
        ["腿尖开沟", "行距一致"], ["种子入沟", "率 ∝ 开度"], ["后拖挞", "覆土压种"]
      ];
      var bwid = (w * 0.91) / boxes.length;
      for (var b = 0; b < boxes.length; b++) {
        var bx2 = w * 0.045 + b * bwid;
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        ctx.strokeRect(bx2, chainY, bwid - 10, chainH);
        ctx.font = "700 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(boxes[b][0], bx2 + (bwid - 10) / 2, chainY + 17);
        ctx.font = "600 8.5px Menlo, monospace";
        ctx.fillStyle = "rgba(42,38,32,0.55)";
        ctx.fillText(boxes[b][1], bx2 + (bwid - 10) / 2, chainY + 32);
        if (b < boxes.length - 1) {
          ctx.beginPath();
          ctx.moveTo(bx2 + bwid - 10, chainY + 20);
          ctx.lineTo(bx2 + bwid - 2, chainY + 20);
          ctx.stroke();
        }
      }
    },
    table:
      '<h4>车体</h4><table>' +
      '<tr><th>车轮(×2)</th><td>径一尺(演示)· 轮距 1.0 m</td><td>—</td></tr>' +
      '<tr><th>双辕</th><td>一牛引之</td><td>—</td></tr>' +
      '<tr><th>耧斗</th><td>种子斗 + 调节板(开度可调)</td><td>0..100%</td></tr>' +
      '<tr><th>耧腿(×3)</th><td>中空下种管 · 腿尖铁刃开沟</td><td>行距 0.30 m</td></tr>' +
      '<tr><th>挞</th><td>后拖覆土板</td><td>—</td></tr>' +
      '</table><h4>下种验算</h4><table>' +
      '<tr><th>满开度率</th><td>14 粒/s(三管合计)</td><td>—</td></tr>' +
      '<tr><th>线性</th><td>率 ∝ 开度(50% → 率减半)</td><td>断言</td></tr>' +
      '<tr><th>三管一致</th><td>计数差 ≤ 2%(载入 20s 模拟)</td><td>断言</td></tr>' +
      '</table><h4>文献</h4>' +
      '<p>王祯《农书》:「耧车,下种器也……一牛引之,三人随之,一种一耩,种随耧下」——西汉赵过发明三脚耧,早于西方同类约一千七百年。</p>'
  };
})(window.MECH = window.MECH || {});
