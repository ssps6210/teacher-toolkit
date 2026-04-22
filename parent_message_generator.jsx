import { useState, useCallback } from "react";

const Q_DATA = {
  q1:  { label: "Q1 四則運算", marks: 8,
         explain: "加減乘除的基本計算。乘法可以拆開算（例如 75×6 = 70×6 + 5×6 = 420+30 = 450），除法可以用估算來檢查答案。",
         tip: "建議每天做 5 分鐘口算練習，乘法口訣要熟，速度和準確度都很重要。" },
  q2:  { label: "Q2 運算順序 BODMAS", marks: 3,
         explain: "算式裡有加減乘除混合時，一定要先算乘除、再算加減。例如 24÷2 + 8 − 5×3，要先算 24÷2=12 和 5×3=15，再做加減，答案是 12+8−15 = 5。",
         tip: "記住口訣 BODMAS：括號 → 次方 → 乘除 → 加減。乘除一定在加減之前，千萬不能從左到右直接算！" },
  q3:  { label: "Q3 逆推思考", marks: 2,
         explain: "從最後的結果「倒推」回去找原來的數。把每一步的運算反過來做：加變減、乘變除，而且順序也要倒過來。這題：32+8=40，40÷5=8，8−6=2，所以原來的數是 2。",
         tip: "可以把每一步寫下來，然後從最後一步一步往回算，不要跳步驟。" },
  q4:  { label: "Q4 四捨五入（到百位）", marks: 2,
         explain: "捨入到百位，就要看十位的數字：0–4 就不進位（向下），5–9 就進位（向上）。例如 8923 的十位是 2，所以向下捨，答案是 8900。",
         tip: "捨入到哪一位，就看「那一位右邊那個數字」。容易記：看右邊、決定進不進。" },
  q5:  { label: "Q5 小數加減", marks: 4,
         explain: "小數計算最重要的是「小數點要對齊」。位數不夠的地方補 0，例如 2.8 要寫成 2.80 再跟 5.12 相加，7.0 − 3.3 也是要讓位數對齊再算。",
         tip: "每次做小數計算，先把小數點對齊寫好，再一列一列計算，這樣幾乎不會出錯。" },
  q6:  { label: "Q6 異分母分數相減", marks: 2,
         explain: "分母不同的分數不能直接相減，要先找最小公倍數（LCM），換成相同分母再算。7/8 − 5/12：LCM(8,12)=24，換算後 21/24 − 10/24 = 11/24。",
         tip: "找最小公倍數是關鍵！可以列出兩個數的倍數，找第一個共同的那個。" },
  q7:  { label: "Q7 分數應用", marks: 4,
         explain: "求「某數的幾分之幾」：先÷分母，再×分子。反過來求原數：先÷分子，再×分母。例如 96 的 5/8：96÷8=12，12×5=60。某數的 3/7 是 63：63÷3=21，21×7=147。",
         tip: "把分數想成指令：分母說要分幾份，分子說要拿幾份。反推時，分母和分子的操作對調。" },
  q8:  { label: "Q8 百分比計算", marks: 3,
         explain: "最快的方法是先求 10%（÷10），再湊出需要的百分比。例如 40% of 2400：先 10% = 240，再 ×4 = 960。也可以直接 2400 × 40 ÷ 100 = 960。",
         tip: "先求 10% 當「積木」，然後拼出需要的百分比，又快又準。" },
  q9:  { label: "Q9 數列規律", marks: 3,
         explain: "這題有三種不同的規律：(a) 每次減4的等差數列，答案 21；(b) 差距每次增加3（+1,+4,+7,+10,+13），答案 44；(c) 每項等於前兩項之和（像費波那契），答案 50。",
         tip: "遇到數列，第一步先算相鄰兩項的差。如果差固定就是等差；差不固定就再看差的差，或試試是否是前兩項相加。" },
  q10: { label: "Q10 分數小數百分比排序", marks: 3,
         explain: "把所有數換成小數再比較：3/4=0.75, 25%=0.25, 1/3≈0.333, 0.45, 1/5=0.2。由小到大：0.2, 0.25, 0.333, 0.45, 0.75，中間第三個是 1/3。",
         tip: "遇到混合比較，全部換成小數是最安全的做法，不要靠感覺判斷大小。" },
  q11: { label: "Q11 望遠鏡分數求和 I", marks: 4,
         explain: "這是「望遠鏡求和」技巧：把 1/(n×(n+1)) 拆成 1/n − 1/(n+1)。相加後中間項兩兩抵消，只剩頭和尾：1/(4×5)+…+1/(7×8) = (1/4−1/5)+(1/5−1/6)+(1/6−1/7)+(1/7−1/8) = 1/4−1/8 = 1/8。",
         tip: "一旦認出可以拆分的形式，做這種題目非常快！關鍵是看到 1/(n×(n+1)) 就想到拆分。" },
  q12: { label: "Q12 望遠鏡分數求和 II", marks: 4,
         explain: "當分子等於分母兩數之差，就能拆分。5/(1×6)：兩數差是5，所以 = 1/1−1/6。四項加起來中間抵消：1/1−1/21 = 20/21。這是 Q11 的升級版。",
         tip: "記住：分母兩個數相差多少，分子就是幾，就能用這個拆分技巧。" },
  q13: { label: "Q13 指數乘法法則", marks: 4,
         explain: "相同底數相乘，指數直接相加：3²×3³ = 3^(2+3) = 3⁵，所以 a=5。這是最基本的指數規則：aᵐ × aⁿ = aᵐ⁺ⁿ。",
         tip: "底數相同才能用這個規則。記住：相乘 → 指數加；相除 → 指數減。" },
  q14: { label: "Q14 指數除法法則", marks: 4,
         explain: "相同底數相除，指數相減：a¹⁰ ÷ a ÷ a³ = a^(10−1−3) = a⁶。連續除幾次就減幾次。規則：aᵐ ÷ aⁿ = aᵐ⁻ⁿ。",
         tip: "指數除法就是減法，跟乘法（加法）剛好相反。這題連除兩次，減兩次指數。" },
  q15: { label: "Q15 角度計算", marks: 6,
         explain: "三個核心規則：① 直線兩角之和 = 180°；② 對頂角相等（兩條線交叉，相對的兩個角）；③ 平行線同位角/錯角相等。答案：∠a=65°（180°−115°），∠b=∠c=115°（對頂角）。",
         tip: "做角度題：先把所有已知角標上，再找「補角對（加到180°）」和「對頂角對（相等）」，一步步把所有角算出來。" },
  q16: { label: "Q16 平行線角度", marks: 4,
         explain: "ST∥UV，遇到平行線先找補角：∠QRV = 180°−140° = 40°（直線補角）。再用三角形內角和 180°：x = 180°−72°−40° = 68°。",
         tip: "平行線題目步驟：① 先找補角，② 找錯角或同位角，③ 用三角形內角和。這個順序幾乎萬用。" },
  q17: { label: "Q17 格子鐵絲長度", marks: 4,
         explain: "n×n 格子的鐵絲公式：橫線 (n+1) 條 × 每條長 n，直線也一樣。6×6：橫線 7條×6cm + 直線 7條×6cm = 42+42 = 84cm。先用 3×3 驗證：4×3+4×3=24✓，再算 6×6。",
         tip: "先用已知數據驗證公式，確認正確後再套用到新數據，這樣不容易犯錯。" },
  q18: { label: "Q18 乘積末尾零個數", marks: 5,
         explain: "每個末尾 0 都是由一個因數 2 和一個因數 5 配對而成。4×6×15×50：找出所有的因數 2（共4個：2²×2×2）和因數 5（共3個：5×5²），配對3組，所以有 3 個零，乘積是 18000。",
         tip: "步驟：先把每個數分解成質因數，數清楚有幾個 2 和幾個 5，取較小的那個就是末尾零的個數。" },
  q19: { label: "Q19 比例應用+面積", marks: 5,
         explain: "設長=4k、寬=3k，周長公式：2(4k+3k)=14k=140，解出 k=10。長=40cm、寬=30cm，面積=40×30=1200cm²。",
         tip: "比例題的標準做法：設一個公倍數 k，把所有量用 k 表示，代入已知條件列方程解k。" },
  q20: { label: "Q20 三角形數字表", marks: 5,
         explain: "前 n 行共有 n(n+1)/2 個數字。第 10 行結束時共有 10×11/2=55 個數，所以第 11 行從第 56 個數開始。第 11 行第 6 個數 = 55+6 = 61。",
         tip: "先用公式算出第10行結束在哪裡（共55個），第11行從56開始，再數到第6個就是61。" },
  q21: { label: "Q21 三人數字文字題", marks: 5,
         explain: "設 Linda=x，則 Lucy=2x（Lucy 是 Linda 的兩倍），Lily=(3/4)×2x=(3/2)x（Lily 是 Lucy 的四分之三）。三數之和：x+2x+(3/2)x=45，化簡 (9/2)x=45，解得 x=10。",
         tip: "三人問題：讓最「基礎」的那個（通常是被最多人參照的）當 x，再用 x 表示其他人，列方程。" },
  q22: { label: "Q22 等邊三角形代數", marks: 5,
         explain: "等邊三角形三邊相等，所以 4x = 2x+6，解得 2x=6，x=3。代入得每邊長=4×3=12，因此 6y=12，y=2。",
         tip: "等邊三角形任意兩邊都相等，先選兩邊列方程求 x，再代回求 y，分兩步走，不要一次解兩個未知數。" },
  q23: { label: "Q23 奇數最大值問題", marks: 5,
         explain: "要讓最大數盡量大，其他四個數就要盡量小。最小的四個不同正奇數是 1, 3, 5, 7，和=16。所以最大數最多是 35−16=19。驗證：1+3+5+7+19=35✓，都是不同正奇數。",
         tip: "「最大化某個量」的標準策略：讓所有其他量取最小可能值。" },
  q24: { label: "Q24 平均速度", marks: 5,
         explain: "平均速度不能直接把兩個速度取平均！正確做法：算總距離÷總時間。第一段 20km/hr 騎 15 分=0.25hr，距離=5km；第二段 8km/hr 騎 30 分=0.5hr，距離=4km。總距離 9km ÷ 總時間 0.75hr = 12km/hr。",
         tip: "這是最常見的陷阱題！平均速度一定是「總距離÷總時間」，不是兩個速度加起來除以2。" },
  q25: { label: "Q25 博弈策略", marks: 5,
         explain: "Alice 的必勝策略：第一步從 B 堆取 12 塊（讓 A 堆=B 堆=300），之後 Bob 從哪堆取幾塊，Alice 就從另一堆取相同數量，永遠讓兩堆相等。當兩堆都剩 0 時，Alice 取最後一塊獲勝。",
         tip: "博弈題的關鍵：找讓局面「對稱」的策略，讓對手每次都面對相同的困境。" },
};

const STUDENTS = [
  { name: "James Fu",         score: 100,   wrong: [] },
  { name: "Nathan Wang",      score: 51.04, wrong: ["q2","q3","q11","q13","q15","q16","q17","q18","q19","q20","q21","q22","q24","q25"] },
  { name: "Chen Zhang",       score: 81.98, wrong: ["q4","q15","q16","q18","q20","q21"] },
  { name: "Yifan Gu",         score: 95,    wrong: ["q2","q21"] },
  { name: "Yuru Chen",        score: 82,    wrong: ["q13","q18","q20","q21","q24"] },
  { name: "Aoife Peng",       score: 74.98, wrong: ["q16","q18","q21","q22","q23","q24"] },
  { name: "YikTo Jin",        score: 92.02, wrong: ["q6","q11","q17"] },
  { name: "Milly Lu",         score: 100,   wrong: [] },
  { name: "Huai Jin Zhang",   score: 90,    wrong: ["q4","q6","q24"] },
  { name: "Gecheng Yang",     score: 100,   wrong: [] },
  { name: "Anna Huang",       score: 100,   wrong: [] },
  { name: "Yini Li",          score: 86,    wrong: ["q6","q15","q21","q24"] },
  { name: "Lachlan Morphett", score: 86.02, wrong: ["q3","q12","q20","q21"] },
  { name: "Noah Seho",        score: 100,   wrong: [] },
  { name: "Ruiyang Jiang",    score: 84,    wrong: ["q13","q18","q19","q20","q24"] },
  { name: "Mia P",            score: 79.02, wrong: ["q11","q12","q15","q19","q24"] },
  { name: "Eezer Tan",        score: 90,    wrong: ["q8","q15","q17"] },
  { name: "yuxiang zheng",    score: 85,    wrong: ["q6","q11","q20","q24"] },
  { name: "Lucas Ke 1",       score: 85.98, wrong: ["q8","q16","q19","q24"] },
  { name: "Neil Chen",        score: 85.02, wrong: ["q8","q11","q21","q24"] },
  { name: "Sunny Shen",       score: 78.02, wrong: ["q4","q5","q8","q12","q23","q24"] },
  { name: "Leo Lin",          score: 88.02, wrong: ["q6","q16","q21"] },
  { name: "Perry 1",          score: 54,    wrong: ["q8","q10","q14","q15","q16","q17","q18","q19","q20","q21","q22","q24","q25"] },
  { name: "Molly Zhang",      score: 86.02, wrong: ["q10","q20","q21","q24"] },
  { name: "Andi Yao",         score: 63.04, wrong: ["q1","q9","q13","q18","q19","q20","q21","q24"] },
  { name: "Grace Han",        score: 74.02, wrong: ["q6","q10","q12","q18","q21","q23","q24"] },
  { name: "Xuanyu Zhu",       score: 72,    wrong: ["q2","q4","q6","q11","q12","q21","q25"] },
];

const CLASS_AVG = 83.2;

function scoreColor(s) {
  if (s === 100) return "#4ade80";
  if (s >= 90)   return "#60a5fa";
  if (s >= 80)   return "#a3e635";
  if (s >= 70)   return "#fb923c";
  return "#f87171";
}
function scoreEmoji(s) {
  if (s === 100) return "🏆"; if (s >= 90) return "⭐";
  if (s >= 80)   return "✅"; if (s >= 70) return "🔶";
  return "💪";
}

function buildMessage(student, teacherName) {
  const { name, score, wrong } = student;
  const firstName = name.split(" ")[0];
  const diff = (score - CLASS_AVG).toFixed(1);
  const diffStr = Number(diff) >= 0 ? `比班級平均高了 ${Math.abs(diff)} 分` : `離班級平均差了 ${Math.abs(diff)} 分`;
  const sig = teacherName ? `\n— ${teacherName}` : "";

  if (wrong.length === 0) {
    return `${firstName} 家長您好 😊\n\n這次 Y6 期中考，${firstName} 拿到滿分 100 分 🏆！全卷 25 題都答對了，真的非常厲害，看得出來平時有認真學習，基礎非常紮實。\n\n請繼續保持這個好狀態，期待 ${firstName} 下次的表現！有任何問題歡迎隨時聯絡 🙏${sig}`;
  }

  const scoreComment = score >= 90 ? `整體表現非常好，${diffStr}，只有少數概念需要複習 💪`
    : score >= 80 ? `整體表現不錯，${diffStr}，有幾個概念需要再鞏固一下 📚`
    : score >= 70 ? `這次有些題目失了比較多分，${diffStr}，不過只要把以下概念補起來，進步空間很大！`
    : `這次考試遇到了不少挑戰，${diffStr}，以下這些概念需要認真複習，我們一起努力 💪`;

  const details = wrong.map(qk => {
    const q = Q_DATA[qk];
    return `📌 ${q.label}（${q.marks}分）\n   📖 ${q.explain}\n   💡 ${q.tip}`;
  }).join("\n\n");

  const closing = wrong.length <= 3
    ? `${firstName} 整體基礎很好，只需要針對以上幾個概念做練習就能更上一層樓！有需要練習題的話隨時跟我說 😊`
    : `建議每天專注複習一個概念，不用一次全部，兩週內就能把這些補起來。我這邊也會多留意 ${firstName} 的進度 😊`;

  return `${firstName} 家長您好 😊\n\n這裡是 ${teacherName || "老師"}，來跟您分享 ${firstName} 這次 Y6 期中考的成績。\n\n${scoreEmoji(score)} 本次得分：${score} / 100 分\n${scoreComment}\n\n${"─".repeat(28)}\n需要複習的題目（共 ${wrong.length} 題）\n${"─".repeat(28)}\n\n${details}\n\n${"─".repeat(28)}\n\n${closing}${sig}`;
}

export default function App() {
  const [selected, setSelected]   = useState(null);
  const [teacherName, setTeacherName] = useState("");
  const [expandedQ, setExpandedQ] = useState(null);
  const [search, setSearch]       = useState("");
  const [copied, setCopied]       = useState(false);
  const [allCopied, setAllCopied] = useState(false);

  const message = selected ? buildMessage(selected, teacherName) : "";

  const sortedStudents = [...STUDENTS]
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.score - a.score);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(message);
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  }, [message]);

  const copyAll = useCallback(() => {
    const all = STUDENTS.map(s =>
      `${"═".repeat(46)}\n【${s.name}  ${s.score}分】\n${"═".repeat(46)}\n${buildMessage(s, teacherName)}\n`
    ).join("\n\n");
    navigator.clipboard.writeText(all);
    setAllCopied(true); setTimeout(() => setAllCopied(false), 2500);
  }, [teacherName]);

  return (
    <div style={{ minHeight:"100vh", background:"#0d1117", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#e6edf3", display:"flex", flexDirection:"column" }}>

      {/* ── Top bar ── */}
      <div style={{ background:"#161b22", borderBottom:"1px solid #30363d", padding:"14px 20px", display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
        <div style={{ fontSize:19, fontWeight:800 }}>✉️ 家長訊息生成器</div>
        <div style={{ fontSize:12, color:"#8b949e", background:"#21262d", padding:"3px 10px", borderRadius:20, border:"1px solid #30363d" }}>
          Y6A · 27位 · 班均 {CLASS_AVG}
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap" }}>
          <input value={teacherName} onChange={e => setTeacherName(e.target.value)}
            placeholder="老師署名（選填）"
            style={{ padding:"7px 12px", borderRadius:8, fontSize:13, background:"#21262d", border:"1px solid #30363d", color:"#e6edf3", outline:"none", width:150 }} />
          <button onClick={copyAll} style={{
            padding:"8px 16px", borderRadius:8, fontSize:13, fontWeight:700,
            background: allCopied ? "#238636" : "#1f6feb",
            border:"none", color:"#fff", cursor:"pointer", transition:"background 0.2s",
          }}>
            {allCopied ? "✅ 已複製全班27則！" : "⚡ 一鍵複製全班訊息"}
          </button>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden", minHeight:0 }}>

        {/* ── Sidebar ── */}
        <div style={{ width:248, background:"#161b22", borderRight:"1px solid #30363d", display:"flex", flexDirection:"column", overflowY:"auto", flexShrink:0 }}>
          <div style={{ padding:"10px 10px 6px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 搜尋學生…"
              style={{ width:"100%", padding:"7px 11px", borderRadius:8, fontSize:12, background:"#21262d", border:"1px solid #30363d", color:"#e6edf3", outline:"none", boxSizing:"border-box" }} />
          </div>
          {sortedStudents.map(s => {
            const active = selected?.name === s.name;
            return (
              <button key={s.name} onClick={() => { setSelected(s); setExpandedQ(null); }}
                style={{ display:"flex", alignItems:"center", gap:9, padding:"9px 12px", border:"none", cursor:"pointer",
                  background: active ? "#1c2d4a" : "transparent",
                  borderLeft: active ? "3px solid #58a6ff" : "3px solid transparent",
                  color:"#e6edf3", textAlign:"left", borderBottom:"1px solid #21262d", transition:"background 0.1s" }}>
                <span style={{ fontSize:15 }}>{scoreEmoji(s.score)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight: active ? 700 : 400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{s.name}</div>
                  <div style={{ fontSize:11, color: scoreColor(s.score), marginTop:1 }}>
                    {s.score}分 · {s.wrong.length > 0 ? `${s.wrong.length}題失分` : "🎉全對"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Main ── */}
        <div style={{ flex:1, overflowY:"auto", padding:20, display:"flex", gap:20, flexWrap:"wrap", alignContent:"flex-start" }}>

          {!selected && (
            <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, color:"#8b949e", gap:10 }}>
              <div style={{ fontSize:44 }}>👈</div>
              <div style={{ fontSize:15 }}>從左側選擇學生</div>
              <div style={{ fontSize:12 }}>或點頂部「⚡ 一鍵複製全班訊息」直接複製全部 27 則</div>
            </div>
          )}

          {selected && (
            <>
              {/* ── Wrong Q panel ── */}
              <div style={{ flex:"0 0 340px", minWidth:280 }}>
                <div style={{ background:"#161b22", borderRadius:12, border:"1px solid #30363d", overflow:"hidden", marginBottom:14 }}>
                  {/* Student header */}
                  <div style={{ padding:"13px 16px", background:"#21262d", borderBottom:"1px solid #30363d" }}>
                    <div style={{ fontSize:15, fontWeight:700 }}>{selected.name}</div>
                    <div style={{ fontSize:12, marginTop:3, display:"flex", gap:10 }}>
                      <span style={{ color: scoreColor(selected.score) }}>{scoreEmoji(selected.score)} {selected.score} / 100</span>
                      <span style={{ color:"#8b949e" }}>
                        {Number((selected.score - CLASS_AVG).toFixed(1)) >= 0
                          ? `+${(selected.score-CLASS_AVG).toFixed(1)}` : (selected.score-CLASS_AVG).toFixed(1)} vs 班均
                      </span>
                    </div>
                  </div>

                  {selected.wrong.length === 0 ? (
                    <div style={{ padding:22, textAlign:"center", color:"#4ade80", fontSize:14 }}>🎉 全部答對，零失分！</div>
                  ) : (
                    <>
                      <div style={{ padding:"9px 16px 5px", fontSize:10, fontWeight:700, color:"#8b949e", textTransform:"uppercase", letterSpacing:1 }}>
                        失分題目 — 點開看詳細解析
                      </div>
                      {selected.wrong.map(qk => {
                        const q = Q_DATA[qk];
                        const open = expandedQ === qk;
                        return (
                          <div key={qk} style={{ borderTop:"1px solid #21262d" }}>
                            <button onClick={() => setExpandedQ(open ? null : qk)}
                              style={{ width:"100%", padding:"10px 16px", display:"flex", alignItems:"center", gap:10,
                                background: open ? "#1c2d4a" : "transparent", border:"none", color:"#e6edf3", cursor:"pointer",
                                textAlign:"left", transition:"background 0.1s" }}>
                              <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10,
                                background:"#f8514922", border:"1px solid #f8514955",
                                color:"#f85149", fontWeight:700, flexShrink:0 }}>{q.marks}分</span>
                              <span style={{ fontSize:13, flex:1 }}>{q.label}</span>
                              <span style={{ color:"#8b949e", fontSize:11 }}>{open ? "▲" : "▼"}</span>
                            </button>
                            {open && (
                              <div style={{ padding:"12px 16px 14px 38px", background:"#0d1117", borderTop:"1px solid #21262d" }}>
                                <div style={{ fontSize:11, color:"#8b949e", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:5 }}>📖 概念說明</div>
                                <div style={{ fontSize:13, color:"#c9d1d9", lineHeight:1.75, marginBottom:10 }}>{q.explain}</div>
                                <div style={{ fontSize:12, color:"#f0c040", lineHeight:1.65,
                                  background:"#f0c04012", padding:"9px 12px", borderRadius:8,
                                  borderLeft:"3px solid #f0c040" }}>
                                  💡 {q.tip}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* ── Message panel ── */}
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ background:"#161b22", borderRadius:12, border:"1px solid #30363d", overflow:"hidden", marginBottom:12 }}>
                  <div style={{ padding:"11px 16px", background:"#21262d", borderBottom:"1px solid #30363d",
                    display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:12, fontWeight:600, color:"#8b949e" }}>📨 WhatsApp / 微信 訊息預覽</div>
                    <div style={{ fontSize:11, color:"#8b949e" }}>{message.length} 字</div>
                  </div>
                  <div style={{ padding:"16px 18px", fontSize:13.5, lineHeight:1.9,
                    whiteSpace:"pre-wrap", color:"#e6edf3", maxHeight:540, overflowY:"auto",
                    fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
                    {message}
                  </div>
                </div>
                <button onClick={copy} style={{
                  width:"100%", padding:"13px", borderRadius:10, cursor:"pointer",
                  background: copied ? "#238636" : "#1f6feb",
                  border:"none", color:"#fff", fontSize:15, fontWeight:700,
                  transition:"background 0.2s",
                  boxShadow: copied ? "none" : "0 2px 14px rgba(31,111,235,0.35)",
                }}>
                  {copied ? "✅ 已複製！直接貼到 WhatsApp / 微信" : "📋 複製這則訊息"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
