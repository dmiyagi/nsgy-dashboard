/* Run with node tests/regressions.js; JavaScriptCore may supply `source`. */
const appSource = typeof source === 'string' ? source : require('fs').readFileSync(require('path').join(__dirname, '../index.html'), 'utf8');
new Function(appSource.includes('<script') ? [...appSource.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n') : appSource);
function extract(name) {
  const start=appSource.indexOf('function '+name+'(');
  if(start<0)throw new Error('Missing function: '+name);
  const firstLine=appSource.slice(start,appSource.indexOf('\n',start));
  if(firstLine.trim().endsWith('}'))return firstLine;
  return appSource.slice(start,appSource.indexOf('\n}',start)+2);
}
const names=['savedContentFingerprint','save','renderReadOnly','normalizeDeletionStamps','parseSyncDocument','mergeState','mergeWorkRecord','mergeFields','fieldStamp','mergeWorkArray','mergeDoneList','mergeSxArray','mergeRoundCheckState','chartNextDueMin','applyChartSeenSnooze','toggleAutoTimers','attachBoardTodo','boardVisible','spineMotorParts','examOptionKey','reconcileTaskList','examIntactText','examStructFromText','examGivenFields','examVisibleFields','examDefaultFields','examAllFieldKeys','examFieldKeysForMode','examMotorKeys','examRecord','roundExamIntact','roundExamSave','renderExamCards','roundExamBuilderHtml','examPickHtml','examFieldWrap','examInputHtml','examSpineMotorHtml','spineExamWarningHtml','examCarryoverText','examPupilParts','examPupilHtml','isDressingRemoval','workflowSet','normalizeDressingChecklist','setChartAutoTimers','soExamFirst','autoTimersDisabled','roundAutoTimersOff','setRoundAutoTimers','handoffNotesRecord','handoffNotesSave'];
const optionConstants=(appSource.match(/const EX_[A-Z_]+_OPTS=[^\n]+/g)||[]).join("\n");
const setup=`
${optionConstants}
const assert=(value,message)=>{if(!value)throw new Error(message)};
const workKey=t=>String(t||'').trim().toLowerCase(),wasDone=(o,t)=>(o.doneKeys||[]).includes(workKey(t));
let BOARD_AUTO_TIMERS_OFF=false;
let S={tombFormat:2,consults:[],rounds:[],formerWounds:[]};
let writes=0,pushes=0,dirty=false,syncApplying=false,lastSaved=JSON.stringify(S);
const localStorage={setItem(){writes++}};const LS='local';
const markSyncDirty=()=>{dirty=true},schedulePush=()=>{pushes++};
const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const editedExamInputs=new Set();const autosave=()=>{};
const document={getElementById:()=>null},sxNow=()=>Date.now(),stampF=(r,k)=>{r.fAt=r.fAt||{};r.fAt[k]=Date.now()};
const touch=c=>c.updatedAt=Date.now(),render=()=>{},renderRounds=()=>{},renderCal=()=>{},showToast=()=>{},resetReviewClock=()=>{};
const nowMin=()=>600,chartSeenFollowupISO=()=> '2026-10-05T12:00:00Z';
const TOMB_KEEP_MS=45*24*3600*1000;
const TYPES={PROC:{},PCON:{},CONSULT:{}},TYPE_WF={PROC:[['staff','Tell nursing'],['consent','Consent']]},WF_ITEMS=[];
const effectivelyDone=(o,t)=>!!t.done;
const MERGE_FIELDS=['note','exam','plan','loc','prob','raw','morningNotes','daytimeNotes'];
`;
const checks=`
// Opening/compacting a device must never queue a write.
S.consults=[{id:'1',note:'old',updatedAt:100,collapsed:false}];lastSaved=JSON.stringify(S);
S.consults[0].collapsed=true;save();assert(!dirty&&pushes===0,'Compact view queued a remote write');
renderReadOnly(()=>{S.consults[0].reviewDueISO='generated';S.consults[0].collapsed=false});
assert(!dirty,'Rendering marked the device dirty');
S.consults[0].note='edited';S.consults[0].updatedAt=200;save();assert(dirty&&pushes===1,'Actual edit was not queued');
// Field timestamps are compared BEFORE either device stamps are merged.
let field=mergeFields({updatedAt:900,note:'old',fAt:{note:100}},{updatedAt:800,note:'new',fAt:{note:800}});
assert(field.note==='new','Stale iOS field beat newer desktop field');
field=mergeFields({updatedAt:900,note:'',fAt:{note:900}},{updatedAt:800,note:'old',fAt:{note:800}});
assert(field.note==='','Older device refilled a cleared field');
field=mergeFields({updatedAt:100,note:'old',fAt:{note:100}},{updatedAt:900,note:'',fAt:{note:900}});
assert(field.note==='','Newer cleared field did not propagate');
const now=Date.now();
const remote={tombFormat:2,consults:[{id:'p',updatedAt:now,note:'desktop new'}],rounds:[],tomb:{}};
const local={tombFormat:2,consults:[{id:'p',updatedAt:now-100,note:'iOS old'}],rounds:[],tomb:{}};
assert(mergeState(local,remote).consults[0].note==='desktop new','Newest record lost');
assert(remote.consults[0].note==='desktop new','Merge mutated the fetched remote baseline');
assert(mergeState({...local,tomb:{p:now-50}},remote).consults.length===1,'Old deletion wiped a newer edit');
assert(mergeState(local,{...remote,tomb:{p:now+1}}).consults.length===0,'New deletion lost');
const legacy={tomb:{p:now+7*24*3600*1000}};normalizeDeletionStamps(legacy);assert(legacy.tomb.p===now,'Legacy deletion timestamp migration');
let rejected=false;try{parseSyncDocument('{"broken":true}')}catch(e){rejected=true}assert(rejected,'Invalid remote data accepted');
// Per-card auto switches stop automatic chart timing, preserve manual dates.
const c={id:'chart',type:'CHART',worry:true,wf:{},snoozeISO:'manual',tasks:[]};S.consults=[c];
toggleAutoTimers(c.id);assert(c.autoTimersOff&&chartNextDueMin(c)===null,'Chart auto-off ignored');
applyChartSeenSnooze(c,'wseen1',true);assert(c.snoozeISO==='manual','Auto-off changed manual date');
toggleAutoTimers(c.id);assert(!c.autoTimersOff&&chartNextDueMin(c)===480,'Chart auto-on ignored');
applyChartSeenSnooze(c,'wseen1',true);assert(c.autoChartSnoozeISO===c.snoozeISO,'Auto snooze not tracked');
toggleAutoTimers(c.id);assert(c.snoozeISO===null,'Auto snooze retained after switching off');
BOARD_AUTO_TIMERS_OFF=true;assert(chartNextDueMin(c)===null,'Chart ignored shared global timer switch');BOARD_AUTO_TIMERS_OFF=false;
// General to-dos may attach and detach without losing their content.
S.rounds=[{id:'r1',label:'NCCU12 Wu',team:'BLUE'}];
const todo={type:'TODO',prob:'Print lists',tasks:[{t:'Print lists',done:false,dueISO:'2026-10-05'}]};
attachBoardTodo(todo,'');assert(todo.loc===''&&boardVisible(todo),'Unattached to-do missing from board');
attachBoardTodo(todo,'round:r1');assert(todo.roundId==='r1'&&todo.loc==='NCCU12 Wu','Patient attachment failed');
attachBoardTodo(todo,'');assert(!todo.roundId&&todo.tasks[0].dueISO==='2026-10-05','Detaching lost task data');
assert(spineMotorParts('4+/5',6).every(x=>x==='4+'),'Upper fraction shorthand');
assert(spineMotorParts('5/4/3/2/1',5).length===5,'Lower motor count');
assert(examOptionKey('withdraws')===examOptionKey('withdraw'),'Exam variant match');
const task={t:'scan',done:true,dueISO:'kept'};assert(reconcileTaskList({tasks:[task]},['call'])[0]===task,'Refresh lost saved task');
const sample='eyes closed\\nOx0 in Portuguese with son\\nPERRL\\nBUE squeeze hands to command\\nBLE wiggle toes to command';
const parsed=examStructFromText(sample);
assert(parsed.ox==='Ox0 in Portuguese with son','Orientation context was lost');
const fields=examGivenFields(parsed);
assert(fields.includes('ox')&&fields.includes('pup')&&fields.includes('bue')&&!fields.includes('corneal'),'Absent findings were added');
const defs=Object.fromEntries(examAllFieldKeys().map(k=>[k,1]));
assert(examVisibleFields({exam:sample},'basic',defs).length===fields.length,'Editor did not prioritize given findings');
assert(examVisibleFields({exam:sample,examFieldsCustom:true,examFieldLayout:'custom',examFields:[]},'basic',defs).length===0,'Removing every field restored defaults');
assert(examDefaultFields('pediatric','bilateral').includes('mental'),'Missing pediatric base');
assert(examDefaultFields('spine','bilateral').includes('bueSp'),'Missing bilateral spine base');
assert(examDefaultFields('intubated','unilateral').includes('rue'),'Missing unilateral intubated base');
assert(examCarryoverText('BUE 4/5\\nDysarthria',['BUE 5/5'])==='Dysarthria','Edited strength retained a contradictory old value');
const editor=roundExamBuilderHtml({id:'patient',exam:sample},sample);
assert(editor.includes('ex_ox_patient')&&!editor.includes('id="ex_corneal_patient"'),'Builder added absent fields');
const consult={id:'consult',type:'CONSULT',exam:sample,examMode:'basic'};S.consults.push(consult);
roundExamIntact(consult.id);
assert(consult.exam==='AOx3\\nPERRL\\nEOMI\\nBUE 5/5\\nBLE 5/5','Consult intact shortcut');
assert(consult.examHist.some(h=>h.text===sample),'Intact shortcut lost previous exam');
assert(examGivenFields(examStructFromText(consult.exam)).includes('eomi'),'EOMI did not populate dropdown');
assert(examIntactText('spine','unilateral').split('\\n').map(l=>l.split(': ')[1].split('/').length).join(',')==='6,6,5,5','Intact spine motor counts');
const pupil=examStructFromText('PERRL · R pupil 3 mm');
assert(pupil.pupilR==='3'&&pupil.pupilL===''&&pupil.pup==='PERRL','Optional right-only pupil size');
assert(examStructFromText('R 5/5/5/5/5/5').pupilR==='','Spine motor grade became a pupil size');
const oldPupils=examStructFromText('R 3 brisk, L 4 reactive');
assert(examPupilParts(oldPupils).finding==='R brisk, L reactive','Old pupil sizes stayed in dropdown');
const pupilHtml=examPupilHtml('p',oldPupils);
assert(pupilHtml.includes('ex_pupR_p')&&pupilHtml.includes('ex_pupL_p'),'Missing independent pupil boxes');
const dressing={type:'PROC',prob:'remove drssg',wf:{},steps:[{t:'Rm dssg',done:true},{t:'Tell the staff thread (nurse + charge + covering APP)',done:false}],tasks:[{t:'Gauze',done:false}]};
normalizeDressingChecklist(dressing);
assert(workflowSet(dressing).map(x=>x[0]).join(',')==='supplies,doproc,handoff','Dressing checklist was not simplified');
assert(dressing.steps.length===0&&dressing.tasks.length===0&&dressing.wf.doproc&&dressing.procLegacyWork.length===3,'Legacy dressing work was lost or still required');
assert(!isDressingRemoval({type:'PROC',prob:'place EVD'}),'Other procedures were simplified');
assert(!EX_MOTOR_OPTS.some(x=>/^[0-5][+-]?$/.test(x)),'Single-digit motor options remained');
assert(EX_MOTOR_OPTS.includes('FC antigravity')&&EX_MOTOR_OPTS.includes('spont antigravity'),'Missing antigravity options');
assert(examOptionKey('4+')===examOptionKey('4+/5'),'Legacy short grade did not match full grade');
S.consults=[{id:'a',type:'CHART',autoTimersOff:false,snoozeISO:'auto',autoChartSnoozeISO:'auto'},{id:'b',type:'CHART',autoTimersOff:true,snoozeISO:'manual'},{id:'c',type:'CONSULT',autoTimersOff:false},{id:'d',type:'CHART',closed:true,autoTimersOff:false}];
setChartAutoTimers(true);assert(S.consults[0].autoTimersOff&&S.consults[1].autoTimersOff&&S.consults[0].snoozeISO===null&&S.consults[1].snoozeISO==='manual','Bulk off failed or cleared a manual date');
assert(!S.consults[2].autoTimersOff&&!S.consults[3].autoTimersOff,'Bulk chart toggle changed other cards');
setChartAutoTimers(false);assert(!S.consults[0].autoTimersOff&&!S.consults[1].autoTimersOff,'Bulk chart on failed');
setRoundAutoTimers(true);
assert(roundAutoTimersOff()&&autoTimersDisabled({type:'CHART'})&&autoTimersDisabled({type:'CONSULT',roundId:'round-1'}),'Rounds timer setting did not cover new or linked cards');
assert(!autoTimersDisabled({type:'CONSULT'}),'Rounds toggle affected unrelated board consults');
setRoundAutoTimers(false);
assert(!roundAutoTimersOff()&&!autoTimersDisabled(S.consults[0]),'Rounds timers could not be reenabled');
assert(S.consults[1].snoozeISO==='manual','Rounds timer toggle cleared a manually scheduled date');
assert(soExamFirst(['Events','One-liner','Labs','Exam','One-liner 2']).join('|')==='One-liner|One-liner 2|Exam|Events|Labs','Exam was not immediately after the one-liner');
handoffNotesSave('morning',{value:'NCCU12 Wu morning updates'});handoffNotesSave('daytime',{value:'NCCU12 Wu afternoon updates'});
const handoff=handoffNotesRecord();assert(handoff.morningNotes.includes('morning')&&handoff.daytimeNotes.includes('afternoon')&&!boardVisible(handoff),'Sign-out notes were not saved separately');
const mergedNotes=mergeFields({updatedAt:500,morningNotes:'old',daytimeNotes:'day new',fAt:{morningNotes:100,daytimeNotes:500}},{updatedAt:400,morningNotes:'morning new',daytimeNotes:'old day',fAt:{morningNotes:400,daytimeNotes:200}});
assert(mergedNotes.morningNotes==='morning new'&&mergedNotes.daytimeNotes==='day new','Independent handoff note edits were lost');
return 'Regression checks PASS';
`;
const result=new Function(setup+names.map(extract).join('\n')+checks)();
if(typeof console!=='undefined')console.log(result);
if(typeof report==='function')report(result);
result;

// Exercise the actual GET/merge/PATCH path with two saved device snapshots.
const syncNames=['doSync','parseSyncDocument','normalizeDeletionStamps','mergeState','mergeWorkRecord','mergeFields','fieldStamp','mergeWorkArray','mergeDoneList','mergeSxArray','mergeRoundCheckState','syncDoc'];
const syncSetup=`
const assert=(v,m)=>{if(!v)throw new Error(m)};
const workKey=t=>String(t||'').trim().toLowerCase(),wasDone=(o,t)=>(o.doneKeys||[]).includes(workKey(t));
const TOMB_KEEP_MS=45*24*3600*1000,MERGE_FIELDS=['note','exam','plan','loc','prob','raw'];
const SYNC_FILE='board',SK_DIRTY='dirty',SK_LAST='last',LS='local',MIN_SYNC_GAP=0;
let dirty='',syncing=false,syncAgain=false,syncBlocked='',lastSyncAt=0,syncRunSeq=0,syncStartedAt=0,pushT=0,retryT=0,gistCache=null,gistEtag='',syncFail=0,syncApplying=false,startupCompactBoard=true,lastSaved='',BOARD_AUTO_TIMERS_OFF=false;
let patches=0,autosaveT=null;const flushAutosave=()=>{};
const values={},localStorage={getItem:k=>k==='dirty'?dirty:values[k],setItem:(k,v)=>{values[k]=v}};
const cfg={token:'mock',gist:'mock'};
const syncCfg=()=>cfg,recoverStaleSync=()=>{},setDot=()=>{},openSync=()=>{},syncPausedUntil=()=>0,shouldPullSync=()=>true,hasSyncDirty=()=>!!dirty;
const clearTimeout=()=>{},schedulePush=()=>{},clearSyncDirty=()=>{dirty=''},renderAllSafe=()=>{},compactBoardForStartup=()=>{S.consults.forEach(c=>c.collapsed=true)};
const document={getElementById:()=>null};
let remote={tombFormat:2,consults:[{id:'p',note:'desktop new',updatedAt:200,created:1}],rounds:[],tomb:{},day:{date:'',checks:{}}};
let S={tombFormat:2,consults:[{id:'p',note:'iOS old',updatedAt:100,created:1}],rounds:[],tomb:{}};
const ghGistGet=async()=>({gist:{files:{board:{content:JSON.stringify(remote)}}}});
const fetchGistFile=async f=>f.content;
const gh=async(path,opts)=>{patches++;remote=JSON.parse(JSON.parse(opts.body).files.board.content)};
`;
const syncChecks=`
return (async()=>{
 await doSync(true);
 assert(patches===0,'Opening a clean stale iOS cache sent a PATCH');
 assert(S.consults[0].note==='desktop new','Clean iOS did not pull desktop data');
 S.consults[0].note='iOS edit';S.consults[0].updatedAt=300;dirty='300';
 await doSync(true);
 assert(patches===1&&remote.consults[0].note==='iOS edit','An actual iOS edit failed to save');
 // Closing and reopening after that successful save remains read-only.
 S.consults[0].collapsed=false;
 await doSync(true);
 assert(patches===1,'Reopening pushed a display-only change');
 return 'Sync lifecycle checks PASS';
})()
`;
const syncResult=new Function(syncSetup+syncNames.map(n=>extract(n).replace(/^function doSync/, 'async function doSync')).join('\n')+syncChecks)();
syncResult.then(v=>{if(typeof console!=='undefined')console.log(v);if(typeof report==='function')report(v)},e=>{if(typeof report==='function')report('FAIL: '+e.message);else throw e});
