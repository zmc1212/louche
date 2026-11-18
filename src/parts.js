/* 耧车部件建模与注册(12 件)。
   布局:车体沿局部 +x 前进,双轮 Y-Z 平面;耧斗在架上,三耧腿向后下伸,
   腿尖开沟落种;后拖挞(覆土板)。种子粒子从腿尖落至地面。 */
(function (MECH) {
  var P = MECH.P, M3 = null, D = MECH.DIM;

  function group() { return new THREE.Group(); }

  function buildAxle() {
    var g = group();
    var axle = P.cyl(0.035, 0.035, D.W + 0.4, M3.steelD, 0, D.rWheel, 0, 10);
    axle.rotation.x = P.ROTX;
    g.add(axle);
    return g;
  }

  function buildFrame() {   // 车架 + 双辕
    var g = group();
    g.add(P.box(0.10, 0.07, 1.5, M3.woodD, 0, D.rWheel + 0.10, 0));
    g.add(P.box(0.06, 0.06, 0.08, M3.wood, 0, D.rWheel + 0.16, 0));
    for (var s = -1; s <= 1; s += 2) {
      var yuan = P.cyl(0.032, 0.04, 1.9, M3.woodD, s * 0.12, D.rWheel + 0.06, 0.95, 10);
      yuan.rotation.x = Math.PI / 2 - 0.12;
      g.add(yuan);
    }
    return g;
  }

  function buildWheel(side) {
    var g = group();
    var holder = group();
    holder.rotation.y = Math.PI / 2;     // 轮平面 Y-Z(法线 X)
    holder.add(P.torus(D.rWheel - 0.015, 0.026, M3.iron, 0, 0, 0, 30));
    holder.add(P.torus(D.rWheel - 0.07, 0.024, M3.woodD, 0, 0, 0, 30));
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var s = P.box(0.035, D.rWheel - 0.16, 0.045, M3.wood, 0, 0, 0);
      s.position.set(Math.cos(a) * (0.06 + (D.rWheel - 0.16) / 2), Math.sin(a) * (0.06 + (D.rWheel - 0.16) / 2), 0);
      s.rotation.z = a - Math.PI / 2;
      holder.add(s);
    }
    g.add(holder);
    return { group: g };
  }

  function buildHopper() {   // 耧斗 + 调节板
    var g = group();
    g.add(P.box(0.24, 0.14, 0.72, M3.wood, 0, 0, 0));
    var gate = P.box(0.16, 0.10, 0.30, M3.woodD, 0.02, -0.03, 0);
    gate.rotation.y = 0.5;
    g.add(gate);
    [-0.28, 0.28].forEach(function (z) {
      g.add(P.box(0.045, 0.46, 0.045, M3.woodD, 0, -0.30, z));
    });
    g.userData.gate = gate;
    return { group: g };
  }

  function buildLeg(k) {   // 耧腿(后弯下伸,内空管)
    var g = group();
    var leg = P.box(0.06, 0.62, 0.085, M3.woodD, 0, -0.31, 0);
    g.add(leg);
    var tip = P.mesh(new THREE.ConeGeometry(0.05, 0.10, 6), M3.iron, 0, -0.66, 0);
    tip.rotation.x = Math.PI;
    g.add(tip);
    var tube = P.cyl(0.016, 0.016, 0.56, M3.steelD, 0, -0.30, 0, 6);
    g.add(tube);
    g.userData.k = k;
    return { group: g };
  }

  function buildTa() {   // 挞(覆土板,后拖)
    var g = group();
    g.add(P.box(0.95, 0.05, 0.16, M3.woodD, 0, 0, 0));
    g.add(P.box(0.05, 0.22, 0.05, M3.wood, -0.42, 0.14, 0));
    g.add(P.box(0.05, 0.22, 0.05, M3.wood, 0.42, 0.14, 0));
    g.add(P.box(0.9, 0.04, 0.05, M3.rope, 0, 0.28, 0));
    return { group: g };
  }

  /* —— 注册 —— */
  MECH.PART_DEFS = function () {
    M3 = MECH.Scene3D.M;
    function def(o) { return MECH._def(o); }

    def({ id: "axle", name: "AXLE · 车轴", sub: "轮距 1.0(演示)", phase: 0, at: 0.15, dur: 1.0,
      build: buildAxle, target: [0, 0, 0], start: [0, 3.0, 2.6], mid: [0, 1.8, 1.2], anchor: [0, 0.1, 0.5] });
    def({ id: "frame", name: "FRAME · 车架双辕", sub: "一牛引之 · 独双辕", phase: 0, at: 0.7, dur: 1.2,
      build: buildFrame, target: [0, 0, 0], start: [0, 3.4, -2.6], mid: [0, 2.0, -1.2], anchor: [0, 0.42, 0.5] });
    def({ id: "wheelL", name: "WHEEL · 车轮 L", sub: "径一尺(演示)", phase: 0, at: 1.6, dur: 1.0, kind: "kine",
      build: function () { return buildWheel(0); }, target: [D.W / 2, D.rWheel, 0], off: [0, 0, 6.0] });
    def({ id: "wheelR", name: "WHEEL · 车轮 R", sub: "与左轮同径", phase: 0, at: 2.1, dur: 1.0, kind: "kine",
      build: function () { return buildWheel(1); }, target: [-D.W / 2, D.rWheel, 0], off: [0, 0, 6.0] });

    def({ id: "hopper", name: "HOPPER · 耧斗+调节板", sub: "开度可调(←/→)", phase: 1, at: 3.8, dur: 1.2, kind: "kine",
      build: buildHopper, target: [0, 1.00, 0.1], off: [0, 1.6, 2.0] });
    for (var k = 0; k < 3; k++) {
      def({ id: "leg" + k, name: "LEG · 耧腿 " + (k + 1), sub: "中空管 · 腿尖开沟", phase: 2, at: 5.6 + k * 0.55, dur: 0.9, kind: "kine",
        build: (function (kk) { return function () { return buildLeg(kk); }; })(k),
        target: [0, 0.72, D.zLegs[k]], off: [0, 1.4, (k % 2 ? 1.4 : -1.4)] });
    }
    def({ id: "ta", name: "TA · 挞(覆土板)", sub: "后拖覆土", phase: 3, at: 8.4, dur: 1.1,
      build: buildTa, target: [0, 0.10, -0.95], start: [0, 2.4, -2.6], mid: [0, 1.2, -1.6], anchor: [0, 0.2, 0.4] });
  };

  /* —— 运动学分发 —— */
  MECH.KINE = function (st) {
    var root = MECH.Scene3D.root;
    /* 车体沿局部 +x 前进 → root yaw? 保持局部系:直接沿局部 x 滚动:
       root yaw 0,车沿 +x? 本站车首沿局部 +z 更贴近系列 → 用 zhi_nan_che 方式:
       车首 = 局部 +z,前进沿 +z,地面沿 z 滚动 */
    root.position.set(0, 0, 0);
    root.rotation.y = 0;
    MECH.Scene3D.scrollGround(0, st.dist);
    /* 车轮滚动(法线 X) */
    var wl = MECH.Parts.entry("wheelL");
    if (wl && wl.shown) wl.group.rotation.x = st.psi;
    var wr = MECH.Parts.entry("wheelR");
    if (wr && wr.shown) wr.group.rotation.x = st.psi;
    /* 调节板开度 */
    var hp = MECH.Parts.entry("hopper");
    if (hp && hp.shown) hp.group.userData.gate.rotation.y = 0.5 - st.opening * 0.85;
  };
})(window.MECH = window.MECH || {});
