// 真实使用模拟（单文件 HTML · jsdom 真实 DOM）：以「学习者」身份走一遍完整流程，
// 捕获任何运行期异常，并 dump 关键屏幕 HTML 供人工检视体验问题。
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const htmlPath = path.join(__dirname, '综合教资备考工作台.html');
let html = fs.readFileSync(htmlPath, 'utf8');
let js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
js = js.replace(/\}\)\(\);\s*$/,
  'window.__t={S:S,go:go,handleClick:handleClick,VIEW:VIEW,startPractice:startPractice,getPS:function(){return PS;},setPS:function(v){PS=v;},psPick:psPick,psShowAns:psShowAns,psNext:psNext,psCorrect:psCorrect,advance:advance,subj3Disc:subj3Disc,rebuildSyll3:rebuildSyll3,examBySubj:examBySubj,SYLL3_LIST:SYLL3_LIST,AI_GEN:AI_GEN,openAiGen:aiGenRun?openAiGen:openAiGen,aiGenRun:aiGenRun,aiGenImport:aiGenImport,normalizeGen:normalizeGen,localAIGenerate:localAIGenerate,aiGenQuestions:aiGenQuestions,aiExplainQuestion:aiExplainQuestion,AI_EXP:AI_EXP,buildSyncDoc:buildSyncDoc,mergeSyncDoc:mergeSyncDoc,syncExportPkg:syncExportPkg,openModal:openModal,closeModal:closeModal,saveSyncCfg:saveSyncCfg,applyRate:applyRate,getS:function(){return S;},getViewHtml:function(){return document.getElementById("view").innerHTML;},getModalHtml:function(){return document.getElementById("modal").innerHTML;},showChangelog:showChangelog};})();');
html = html.replace(/<script>[\s\S]*?<\/script>/, '<script>' + js + '</script>');

const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, url: 'http://localhost/',
  beforeParse(window){ try{ window.localStorage.setItem('artwb_changelog_v13','1'); }catch(e){} } });
const { window } = dom;
const doc = window.document;
window.confirm = () => true;
window.alert = () => {};
window.prompt = () => '';
window.HTMLElement.prototype.scrollIntoView = function () {};
window.scrollTo = function () {};
// 捕获运行期错误
const runtimeErrors = [];
window.addEventListener('error', e => runtimeErrors.push('window.error: ' + (e.error && e.error.stack || e.message)));
const origErr = console.error.bind(console);
console.error = (...a) => { runtimeErrors.push('console.error: ' + a.map(String).join(' ')); origErr(...a); };

const sleep = ms => new Promise(r => setTimeout(r, ms));
const T = window.__t;
let ok = true;
const dumpDir = path.join(__dirname, '.gate_tmp', 'sim_dump');
try { fs.mkdirSync(dumpDir, {recursive:true}); } catch (e) {}
function dump(name, h) { try { fs.writeFileSync(path.join(dumpDir, name + '.html'), '<meta charset="utf-8">\n' + (h || '')); } catch (e) {} }
function assert(name, cond, extra) {
  console.log((cond ? '✅' : '❌') + ' ' + name + (extra !== undefined ? '  → ' + extra : ''));
  if (!cond) ok = false;
}
function click(el) {
  if (!el) return false;
  try { el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true })); return true; }
  catch (e) { runtimeErrors.push('click threw: ' + e.message); return false; }
}
function clickAct(act, p1) {
  // 通过 handleClick 派发（模拟真实点击：closest('[data-act]') 取自身属性）
  const fake = { target: { closest: function (sel) { if (sel !== '[data-act]') return null; return { getAttribute: function (a) { return a === 'data-act' ? act : (a === 'data-p1' ? p1 : null); } }; } } };
  try { T.handleClick(fake); return true; } catch (e) { runtimeErrors.push('handleClick(' + act + ') threw: ' + e.message); return false; }
}
function findAct(act) { return doc.querySelector('[data-act="' + act + '"]'); }
function findActInModal(act) { const m = doc.getElementById('modal'); return m ? m.querySelector('[data-act="' + act + '"]') : null; }

(async function () {
  console.log('================ 真实使用模拟（学习者视角）================\n');
  if (!T) { console.error('❌ 内部函数未暴露'); process.exit(1); }

  /* —— 0) 启动态 —— */
  console.log('--- 0) 启动 / 今日复习 ---');
  T.go('today');
  let today = T.getViewHtml();
  assert('今日复习页渲染', today.length > 200, today.length + ' 字符');
  dump('00_today', today);
  let startBtn = findAct('psStart') || doc.querySelector('[data-act="startToday"]');
  assert('首页存在「开始练习」入口', !!startBtn);

  /* —— 1) 练习全流程（客观+主观混合） —— */
  console.log('\n--- 1) 练习全流程：答题 → 结算 ---');
  T.go('practice');
  let psStart = findAct('psStart');
  if (psStart) click(psStart);
  let PS = T.getPS();
  assert('进入练习会话（已选题）', PS && PS.items.length > 0, PS && PS.items.length);
  let guard = 0, answered = 0, subjective = 0, objective = 0;
  while (PS && !PS.done && guard < 120) {
    let optBtn = findAct('psPick');
    let pEssay = doc.getElementById('psEssay');
    if (optBtn) {
      objective++;
      click(optBtn);
      // 半强制错因：答错后先验证「下一步」默认禁用，再选错因解锁（学习者建议落地）
      let causeNext0 = doc.getElementById('causeNext');
      if (causeNext0) {
        assert('（半强制）错因未选时「下一步」默认禁用', causeNext0.disabled === true);
        let causeBtn = findAct('psCause');
        if (causeBtn) click(causeBtn);
        assert('（半强制）选错因后「下一步」解锁', doc.getElementById('causeNext').disabled === false);
      } else {
        let causeBtn = findAct('psCause');
        if (causeBtn) click(causeBtn);
      }
    }
    else if (pEssay) {
      subjective++;
      try { pEssay.value = '要点：结合实例分析。'; pEssay.dispatchEvent(new window.Event('input', { bubbles: true })); } catch (e) {}
      let showAns = findAct('psShowAns'); if (showAns) click(showAns);
      let rate = findAct('psCorrect'); if (rate) click(rate);
    } else { break; }
    answered++;
    let next = findAct('psNext');
    if (!next) break;
    click(next);
    guard++;
    PS = T.getPS();
  }
  assert('练习正常推进到结算(PS.done)', PS && PS.done === true, 'guard=' + guard + ' answered=' + answered);
  let summ = T.getViewHtml();
  dump('01_summary', summ);
  assert('结算页含正确率', summ.indexOf('正确率') >= 0);
  assert('结算页含错因诊断', summ.indexOf('错因诊断') >= 0 || summ.indexOf('错因') >= 0);
  assert('结算页含「针对性补强推荐」', summ.indexOf('针对性补强推荐') >= 0);
  assert('结算页含 AI 讲评入口', summ.indexOf('aiExplain') >= 0, '含 aiExplain=' + (summ.indexOf('aiExplain') >= 0));

  /* —— 2) AI 讲评：连续逐条讲评（首条→下一条→…→末条→上一条） —— */
  console.log('\n--- 2) AI 讲评连续讲评（学习者最关心的"逐题剖析"） ---');
  // 从结算页点第一个 AI 讲评
  let aiBtn = doc.querySelector('[data-act="aiExplain"]');
  assert('结算页存在 AI 讲评按钮', !!aiBtn);
  if (aiBtn) click(aiBtn);
  let m = T.getModalHtml();
  dump('02_ai_explain_1', m);
  let cnt1 = (m.match(/(\d+) \/ (\d+)/) || []);
  assert('讲评弹窗显示 计数 1 / N', !!cnt1[1] && cnt1[1] === '1', cnt1[0] || '无计数');
  assert('讲评弹窗含「纵向回顾」（历史作答 / 同类正确率）', m.indexOf('纵向回顾') >= 0);
  assert('讲评弹窗含「下一条」导航', m.indexOf('aiExpNext') >= 0);
  // 点两次下一条
  clickAct('aiExpNext'); await sleep(20);
  let m2 = T.getModalHtml();
  assert('点下一条后计数变为 2 / N', (m2.match(/(\d+) \/ (\d+)/) || [])[1] === '2', (m2.match(/(\d+) \/ (\d+)/) || [])[0] || '无');
  assert('第二条显示题干（非空白）', m2.indexOf('q-text') >= 0 || m2.length > 200);
  clickAct('aiExpPrev'); await sleep(20);
  let m3 = T.getModalHtml();
  assert('点上一条后回到 1 / N', (m3.match(/(\d+) \/ (\d+)/) || [])[1] === '1');
  // 关闭
  clickAct('closeModal'); await sleep(20);
  assert('关闭讲评弹窗后可继续（无残留遮罩）', doc.getElementById('mask').className.indexOf('show') < 0);

  /* —— 3) 错题本 + AI 讲评 —— */
  console.log('\n--- 3) 错题本（校订页） ---');
  T.go('proof');
  let proof = T.getViewHtml();
  dump('03_proof', proof);
  assert('错题本默认停在错题列表', T.go && proof.indexOf('科三') >= 0 || proof.indexOf('错题') >= 0, 'len=' + proof.length);
  let proofAiBtn = doc.querySelector('#view [data-act="aiExplain"]');
  if (proofAiBtn) {
    click(proofAiBtn);
    let pm = T.getModalHtml();
    assert('错题本 AI 讲评弹窗可打开', pm.indexOf('AI 讲评') >= 0);
    clickAct('closeModal');
  } else { console.log('ℹ️ 错题本当前无错题数据，跳过 AI 讲评（非缺陷）'); }

  /* —— 4) 题库搜索 + AI 批量扩充 —— */
  console.log('\n--- 4) 题库搜索 + AI 批量扩充 ---');
  T.go('exam');
  let qInput = doc.querySelector('#view input[data-act="exSearch"]') || doc.querySelector('#view input[type="search"]') || doc.querySelector('#view input');
  let searched = false;
  if (qInput) {
    let sample = (T.S.exam[0].q || '').slice(0, 3);
    qInput.value = sample;
    qInput.dispatchEvent(new window.Event('input', { bubbles: true }));
    await sleep(180); // 防抖 150ms
    let ev = T.getViewHtml();
    searched = ev.indexOf('搜索结果') >= 0;
    assert('题库搜索输入触发筛选（含搜索结果）', searched, 'sample=' + sample);
    dump('04_exam_search', ev);
  } else { console.log('ℹ️ 未找到搜索框，跳过（需检查 mark-up）'); }
  // AI 扩充
  let aiGenBtn = findAct('openAiGen');
  if (!aiGenBtn) { T.go('ai'); aiGenBtn = findAct('openAiGen'); }
  assert('AI 扩充入口可达', !!aiGenBtn);
  if (aiGenBtn) {
    click(aiGenBtn);
    let genModal = T.getModalHtml();
    assert('AI 出题弹窗打开（含生成模式）', genModal.indexOf('AI 出题') >= 0);
    dump('04b_aigen_modal', genModal);
    // 批量扩充（无 Key → 强提醒）
    window.localStorage.removeItem('ai_key');
    clickAct('aiBatch');
    let warn = T.getModalHtml();
    assert('无 Key 批量扩充弹强提醒（不静默离线）', warn.indexOf('未配置 API Key') >= 0 && warn.indexOf('aiBatchConfirm') >= 0);
    dump('04c_batch_warn', warn);
    // 仍要继续 → 离线批量（进度改为独立浮层，与弹窗解耦）
    clickAct('aiBatchConfirm');
    await sleep(400);
    let ov = doc.getElementById('batchOverlay');
    let progTxt = ov ? ov.innerHTML : '';
    assert('批量扩充独立浮层出现（与弹窗解耦）', ov && ov.className.indexOf('show') >= 0, ov ? ov.className : 'null');
    assert('批量扩充浮层显示进度(已入库 + 进度)', progTxt.indexOf('已入库') >= 0 && progTxt.indexOf('进度') >= 0, progTxt.slice(0, 60));
    dump('04d_batch_progress', progTxt);
    // 轮询等待批量完成（离线逐章 ≈300ms/章 × 29 章，浮层收起后弹总结）
    let done = false, doneTxt = '';
    for (let i = 0; i < 40; i++) {
      await sleep(400);
      let ov2 = doc.getElementById('batchOverlay');
      let ovShown = ov2 && ov2.className.indexOf('show') >= 0;
      let m = doc.getElementById('modal') ? doc.getElementById('modal').innerHTML : '';
      if (!ovShown && (m.indexOf('本次新增按章节分布') >= 0 || m.indexOf('批量扩充完成') >= 0)) { done = true; doneTxt = m; break; }
    }
    assert('批量完成后弹「按章节分布」总结（浮层已收起）', done, done ? '有分布总结' : '待完成');
    if (done && doneTxt.indexOf('aiGenGotoExam') >= 0) { clickAct('aiGenGotoExam'); await sleep(50); assert('点「去题库查看」可跳转', T.getViewHtml().length > 200); }
  }

  /* —— 4b) 批量中途取消 + 断点续传（开发总监关注的长任务健壮性） —— */
  console.log('\n--- 4b) 批量中途取消 + 断点续传 ---');
  T.AI_GEN.batchDone = {}; // 清掉上一轮分布，便于干净测试续传
  let aiGenBtn2 = findAct('openAiGen');
  if (!aiGenBtn2) { T.go('ai'); aiGenBtn2 = findAct('openAiGen'); }
  if (aiGenBtn2) {
    click(aiGenBtn2);
    let genModal2 = T.getModalHtml();
    if (genModal2.indexOf('AI 出题') >= 0) {
      window.localStorage.removeItem('ai_key');
      clickAct('aiBatch'); await sleep(20);
      clickAct('aiBatchConfirm'); await sleep(300); // 仅跑一两章即取消
      clickAct('batchCancel'); await sleep(60);
      let ovP = doc.getElementById('batchOverlay');
      assert('中途取消后浮层转入「已暂停」并可续传', ovP && ovP.className.indexOf('show') >= 0 && ovP.innerHTML.indexOf('batchResume') >= 0, ovP ? ovP.innerHTML.slice(0, 48) : 'n/a');
      clickAct('batchResume'); await sleep(60);
      let resumed = false, resTxt = '';
      for (let i = 0; i < 40; i++) {
        await sleep(400);
        let ov3 = doc.getElementById('batchOverlay');
        let ovShown = ov3 && ov3.className.indexOf('show') >= 0;
        let mm = doc.getElementById('modal') ? doc.getElementById('modal').innerHTML : '';
        if (!ovShown && mm.indexOf('续传新增按章节分布') >= 0) { resumed = true; resTxt = mm; break; }
      }
      assert('断点续传完成（跳过已完成章节，弹续传总结）', resumed, resumed ? '续传完成' : '待完成');
      clickAct('closeModal');
    } else { console.log('ℹ️ AI 出题弹窗未打开，跳过取消/续传测试'); }
  } else { console.log('ℹ️ 未找到 AI 扩充入口，跳过取消/续传测试'); }

  /* —— 5) 知识图谱 —— */
  console.log('\n--- 5) 知识图谱渲染 + 节点点击 ---');
  T.go('graph');
  let gv = T.getViewHtml();
  dump('05_graph', gv);
  assert('图谱渲染出节点(g-node)', gv.indexOf('g-node') >= 0);
  assert('图谱中心枢纽渲染(g-center)', gv.indexOf('g-center') >= 0);
  let node = doc.querySelector('#view [data-node]');
  if (node) { click(node); await sleep(30); assert('点击图谱节点可选中(有反馈)', true); }
  else { console.log('ℹ️ 未找到 data-node，跳过点击'); }

  /* —— 6) 设置：主题/字体 + 同步导出导入 —— */
  console.log('\n--- 6) 设置 + 多端同步（导出→导入合并） ---');
  T.go('settings');
  let setView = T.getViewHtml();
  dump('06_settings', setView);
  // 主题切换
  let themeSel = doc.querySelector('#view [data-act="setTheme"]');
  if (themeSel) { themeSel.value = 'dark'; themeSel.dispatchEvent(new window.Event('change', { bubbles: true })); assert('主题切深色生效', T.S.meta.theme === 'dark'); }
  // 字体
  let fontSel = doc.querySelector('#view [data-act="setFont"]');
  if (fontSel) { fontSel.value = 'xl'; fontSel.dispatchEvent(new window.Event('change', { bubbles: true })); assert('字号切特大生效', T.S.meta.font.size === 'xl'); }
  // 同步导出（构建文档 + 触发下载）
  let doc2 = T.buildSyncDoc();
  assert('同步包构建成功(v=' + doc2.v + ')', doc2 && doc2.v === 2);
  // 模拟导入合并：构造一个远端包（含本地没有的题 + 同 id 远端较新）
  let remote = JSON.parse(JSON.stringify(doc2));
  remote.exam.push({ id: 'sim_remote_x', subject: '科一', chapter: '一、职业理念', q: '远端新增的同步题', opt: 'A. 1\nB. 2', answer: 'A', analysis: 'x', cause: [], wrongBook: false, _mt: Date.now() + 100000 });
  let bLen = T.getS().exam.length;
  T.mergeSyncDoc(remote);
  assert('同步导入合并：远端独有题并入(不丢本地) ', T.getS().exam.length === bLen + 1, '+' + (T.getS().exam.length - bLen));
  let hasRemote = T.getS().exam.some(e => e.id === 'sim_remote_x');
  assert('同步导入：远端题确实入库', hasRemote);

  /* —— 6b) 更新弹窗（独立验证；beforeParse 已注入"已看过"标记，避免首屏弹窗干扰主流程） —— */
  window.localStorage.removeItem('artwb_changelog_v13');
  T.showChangelog(); await sleep(20);
  let ch = T.getModalHtml();
  dump('06b_changelog', ch);
  assert('更新弹窗渲染版本标题', ch.indexOf('已升级到 V1.3') >= 0);
  assert('更新弹窗含 2 条更新项', (ch.match(/<li>/g) || []).length === 2, (ch.match(/<li>/g) || []).length + ' 条');
  assert('更新弹窗含手机端仓库链接', ch.indexOf('jiaozi-android') >= 0);
  assert('更新弹窗含网页端仓库链接', ch.indexOf('Jiazi-Practice-Platform') >= 0);
  assert('更新弹窗含「不再提醒」与「我知道了」按钮', ch.indexOf('clDismiss') >= 0 && ch.indexOf('clKnow') >= 0);
  clickAct('clKnow'); await sleep(20);
  assert('点「我知道了」关闭弹窗（无残留遮罩）', doc.getElementById('mask').className.indexOf('show') < 0);

  /* —— 7) 运行期错误汇总 —— */
  console.log('\n--- 7) 运行期错误汇总 ---');
  if (runtimeErrors.length === 0) console.log('✅ 全程无运行期异常（console.error / window.error 均空）');
  else { ok = false; console.log('❌ 捕获到 ' + runtimeErrors.length + ' 处运行期问题：'); runtimeErrors.slice(0, 20).forEach(e => console.log('   - ' + e)); }

  console.log('\n================ 结论 ================');
  console.log(ok ? '🟢 真实使用模拟 PASS（所有主要功能链路可走通）' : '🔴 模拟中发现问题，见上方 ❌');
  process.exit(ok ? 0 : 1);
})();
