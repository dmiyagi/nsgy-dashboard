/* Run with the JavaScriptCore harness supplying the application source. */
function fn(name){const a=source.indexOf('function '+name+'('),line=source.slice(a,source.indexOf('\n',a));return line.endsWith('}')?line:source.slice(a,source.indexOf('\n}',a)+2)}
const result=new Function(`
let nccuCompact=true;const nccuSessionViews=new Map();let patient={id:'p',nccuView:'full'};
const findAny=()=>patient,renderNccu=()=>{};
const slotActiveKeys=r=>r.keys||[],slotDef=k=>({fields:k==='exam'?[['cur']]:[['goal'],['out24'],['shift']]});
const soProfileKeys=()=>null,slotAuto=()=>[],slotKeysFromBoxes=()=>[];
${['nccuViewOf','nccuIsCompact','toggleOneNccuCompact','setNccuCompact','nccuReady','slotVisibleFields','slotDefFields','slotCustom','slotVal'].map(fn).join('\n')}
const assert=(x,m)=>{if(!x)throw new Error(m)};
assert(nccuIsCompact(patient),'New session did not start compact');
toggleOneNccuCompact('p');assert(!nccuIsCompact(patient),'Card did not expand');
patient={id:'p',nccuView:'compact'};assert(!nccuIsCompact(patient),'Remote snapshot collapsed expanded card');
setNccuCompact(true);assert(nccuIsCompact(patient),'Compact all did not compact');
setNccuCompact(false);assert(!nccuIsCompact(patient),'Expand all did not expand');
toggleOneNccuCompact('p');assert(nccuIsCompact(patient),'Per-card Compact failed');
const r={keys:['exam','drain'],exam:'AOx3',slots:{drain:{goal:'EVD at 10',out24:'100'}}};
assert(!nccuReady(r),'Missing shift output was marked ready');
r.slots.drain.shift='20';assert(nccuReady(r),'All filled boxes did not become ready');
r.slots.drain.goal='  ';assert(!nccuReady(r),'Whitespace was counted as filled');
r.slotFieldsOff={'drain.goal':true};assert(nccuReady(r),'Hidden box prevented readiness');
if(slotVisibleFields(r,'drain').length!==2)throw new Error('Hiding one field removed the other fields');
return 'SO readiness / session view checks PASS';
`)();
report(result);
const routing=new Function(`
let writes=[];
const slotVal=(r,k,f)=>((r.slots||{})[k]||{})[f]||'';
const slotUpdate=(r,k,f,v)=>{r.slots=r.slots||{};r.slots[k]=r.slots[k]||{};r.slots[k][f]=v;writes.push([k,f,v])};
const SLOT_SEED=[],stampF=()=>{},sxNow=()=>1;
${['soSlotMapping','syncTemplateSlots','routeDaytimeUpdate','templateIndividualValue','cleanDiWatchDuplicates'].map(fn).join('\n')}
const r={morningNotes:'original baseline'};
routeDaytimeUpdate(r,'Concern for SIADH');
if(r.slots.sodiumStudies.concern!=='Concern for SIADH'||r.slots.sodiumStudies.urineOsm!==undefined)throw new Error('SIADH update invented results');
routeDaytimeUpdate(r,'Urine osm 650, urine sodium 72, serum osm 270');
if(r.slots.sodiumStudies.urineOsm!=='650'||r.slots.sodiumStudies.urineNa!=='72'||r.slots.sodiumStudies.serumOsm!=='270'||r.morningNotes!=='original baseline')throw new Error('Urine studies were not mapped or baseline was changed');
syncTemplateSlots(r,'BP goal','SBP <160');if(r.slots.bp.goal!=='SBP <160')throw new Error('Template did not populate corresponding board parameter');
const old={so:{'DI watch':'Na 142, UOP 240, 130, Urine Osm 650, spec grav 1.003'},slots:{gu:{cur:'Na 142, UOP 240, 130, Urine Osm 650'},sodiumStudies:{concern:'Na 142, UOP 240; Na 142, UOP 240, 130'}}};
if(templateIndividualValue(old,'DI watch','diWatch','na')!=='142'||templateIndividualValue(old,'DI watch','diWatch','uop')!=='240, 130'||templateIndividualValue(old,'DI watch','diWatch','urineOsm')!=='650'||templateIndividualValue(old,'DI watch','diWatch','sg')!=='1.003')throw new Error('DI watch did not split into distinct measurements');
cleanDiWatchDuplicates(old);if(old.slots.gu.cur!==''||old.slots.sodiumStudies.concern!==''||old.diWatchLegacy.length!==2)throw new Error('DI output duplicates were not removed and archived');
routeDaytimeUpdate(r,'Concern for SIADH, urine osm 650');routeDaytimeUpdate(r,'Concern for SIADH, urine osm 660');
if(r.slots.sodiumStudies.concern.includes(';'))throw new Error('Typing appended incremental concern copies');
return 'Template mapping / daytime sodium routing checks PASS';
`)();report(routing);

const chartResult=new Function(`${['chartOnlyChecks','chartCheckStage'].map(fn).join('\n')}
let c={wf:{}};let stage=chartCheckStage(c);if(stage.k!=='ccam'||stage.undo)throw new Error('First chart check did not advance AM');
c.wf.ccam=1;stage=chartCheckStage(c);if(stage.k!=='ccpm'||stage.undo)throw new Error('Second chart check did not advance PM');
c.wf.ccpm=2;stage=chartCheckStage(c);if(stage.k!=='ccpm'||!stage.undo)throw new Error('Completed chart card did not offer Undo');
return 'Chart checkmark sequence checks PASS';`)();report(chartResult);

const consentResult=new Function(`${['consentCueText','hasMissingConsentCue'].map(fn).join('\n')}
for(const prob of ['OR 10/13 (consented)','OR 10/13 [consented]','OR 10/13','OR tomorrow','consented'])if(hasMissingConsentCue({prob}))throw new Error('Consent suggestion appeared without explicit missing consent');
for(const prob of ['OR 10/13 (not consented)','OR tomorrow (not yet consented)','NOT CONSENTED'])if(!hasMissingConsentCue({prob}))throw new Error('Explicit missing consent was not suggested');
return 'Explicit not-consented suggestion checks PASS';`)();report(consentResult);

const evdResult=new Function(`
const slotDef=k=>({order:{exam:10,drain:15,icp:20,drainOutput:25,na:40}[k]});
const soProfileIndex=()=>null,soProfileKeys=()=>null;
const slotParentOf=k=>({icp:'drain',drainOutput:'drain',na:'neuroplan'})[k]||'';
${['slotOrderIndex','slotGatherChildren','slotSortedKeys','slotVal'].map(fn).join('\n')}
const r={slotOrder:['exam','icp','drain','na'],slots:{drain:{goal:'EVD at 0',out24:'235',shift:'20'}}};
const order=slotSortedKeys(r,['exam','icp','drain','na','drainOutput']);
if(order.join(',')!=='exam,drain,icp,drainOutput,na')throw new Error('EVD, ICP and output order is incorrect');
if(slotVal(r,'drainOutput','out24')!=='235'||slotVal(r,'drainOutput','shift')!=='20')throw new Error('Splitting output lost existing measurements');
return 'EVD → ICP → output layout / saved values checks PASS';`)();report(evdResult);

const nestResult=new Function(`
const slotDef=k=>({order:{exam:10,drain:15,icp:20,drainOutput:25,neuroplan:29,na:40,brace:68,bp:60}[k],custom:false});
const soProfileIndex=()=>null,soProfileKeys=()=>null;
const SLOT_PARENT={na:'neuroplan',brace:'neuroplan',icp:'drain',drainOutput:'drain'};
const SLOT_NEIGHBOUR=[];const SLOT_HEADS=['neuroplan','drain','bp','resp','gi'];
${['slotOrderIndex','slotIsHead','slotParentOf','slotGatherChildren','slotSortedKeys'].map(fn).join('\n')}
const flat=slotSortedKeys({},['neuroplan','na','bp','brace','drain','icp']);
if(flat.indexOf('brace')!==flat.indexOf('neuroplan')+2)throw new Error('Bracing did not join its heading');
if(flat.indexOf('brace')>flat.indexOf('bp'))throw new Error('Bracing was left below Cards / BP');
if(flat.indexOf('icp')!==flat.indexOf('drain')+1)throw new Error('ICP left its drain heading');
const mine=slotSortedKeys({slotOrder:['bp','neuroplan','na','brace']},['neuroplan','na','bp','brace']);
if(mine.join(',')!=='bp,neuroplan,na,brace')throw new Error('An order arranged by hand was overridden by nesting');
if(!slotIsHead('bp')||!slotIsHead('gi')||slotIsHead('labs'))throw new Error('Systems and report rows are not told apart');
return 'Section nesting / hand-arranged order checks PASS';`)();report(nestResult);

const shortResult=new Function(`
const SO_PROFILES={},SO_PROFILE_ONLY={nccushort:true},SO_TMPLS={nccushort:{name:'Short NCCU',fields:[]}};
const soProfileCache={},SLOT_CUSTOM={},SO_SLOTS=[];
const slotDef=k=>({k:k,fields:[['goal'],['cur']],order:1});
const slotText=r=>String(r.raw||'');
const slotIsSpine=r=>/tlif|fusion|acdf|lami|cord/i.test(slotText(r));
const slotVal=(r,k,f)=>((r.slots||{})[k]||{})[f]||'';
const slotAuto=()=>['na','asm','drain','bp'],slotKeysFromBoxes=()=>['asm'],slotKeysBoxOff=()=>[];
const slotSortedKeys=(r,keys)=>keys;
${['slotFilled','soProfileForTemplate','soProfileKeys','soProfileIndex','slotActiveKeys'].map(fn).join('\n')}
SO_PROFILES.nccushort=r=>{
  const keys=['exam','neuroplan'];
  if(slotFilled(r,'ac')||/dvt|lovenox|heparin/i.test(slotText(r)))keys.push('ac');
  if(slotIsSpine(r)||slotFilled(r,'brace'))keys.push('brace');
  return keys;
};
const cranial={soT:'nccushort',raw:'aSAH pcomm coiled POD2, Keppra',slots:{na:{goal:'135-145'}}};
if(slotActiveKeys(cranial).join(',')!=='exam,neuroplan')throw new Error('Short NCCU brought rows it was not asked for');
const dvt={soT:'nccushort',raw:'aSAH POD2, lovenox held since 8/20',slots:{}};
if(slotActiveKeys(dvt).indexOf('ac')<0)throw new Error('Short NCCU dropped the DVT plan where it applies');
const spine={soT:'nccushort',raw:'L4-5 TLIF POD1, lovenox POD1',slots:{}};
if(slotActiveKeys(spine).join(',')!=='exam,neuroplan,ac,brace')throw new Error('Short NCCU dropped the spine plan');
const full={soT:'nccu',raw:'aSAH pcomm coiled POD2',slots:{}};
if(slotActiveKeys(full).indexOf('na')<0)throw new Error('A normal template lost its detected rows');
return 'Short NCCU walk checks PASS';`)();report(shortResult);

const compactExamResult=new Function(`
const examHistOpen={r:true};let S={rounds:[{id:'r',collapsed:false,examOpen:true}],consults:[{id:'c',type:'CHART',collapsed:false,examOpen:true}]};
const renderRounds=()=>{},renderCal=()=>{},save=()=>{};
${['compactExamTrend','togRoundCollapse','collapseRounds','collapseChartChecks'].map(fn).join('\n')}
togRoundCollapse('r');if(!S.rounds[0].collapsed||S.rounds[0].examOpen||examHistOpen.r)throw new Error('Card Compact did not close exam panels');
togRoundCollapse('r');if(S.rounds[0].examOpen)throw new Error('Reopening card reopened exam trend');
S.rounds[0].examOpen=true;collapseRounds(true);if(S.rounds[0].examOpen||S.consults[0].examOpen)throw new Error('Compact all did not close exam trends');
S.consults[0].examOpen=true;collapseChartChecks(true);if(S.consults[0].examOpen)throw new Error('Chart Compact did not close exam trend');
return 'Compact card / exam trend checks PASS';`)();report(compactExamResult);
