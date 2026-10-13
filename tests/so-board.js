/* Run with the JavaScriptCore harness supplying the application source. */
function fn(name){const a=source.indexOf('function '+name+'('),line=source.slice(a,source.indexOf('\n',a));return line.endsWith('}')?line:source.slice(a,source.indexOf('\n}',a)+2)}
const result=new Function(`
let nccuCompact=true;const nccuSessionViews=new Map();let patient={id:'p',nccuView:'full'};
const findAny=()=>patient,renderNccu=()=>{};
const slotActiveKeys=r=>r.keys||[],slotDef=k=>({fields:k==='exam'?[['cur']]:[['goal'],['out24'],['shift']]});
${['nccuViewOf','nccuIsCompact','toggleOneNccuCompact','setNccuCompact','nccuReady','slotVisibleFields','slotVal'].map(fn).join('\n')}
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
${['slotOrderIndex','slotSortedKeys','slotVal'].map(fn).join('\n')}
const r={slotOrder:['exam','icp','drain','na'],slots:{drain:{goal:'EVD at 0',out24:'235',shift:'20'}}};
const order=slotSortedKeys(r,['exam','icp','drain','na','drainOutput']);
if(order.join(',')!=='exam,drain,icp,drainOutput,na')throw new Error('EVD, ICP and output order is incorrect');
if(slotVal(r,'drainOutput','out24')!=='235'||slotVal(r,'drainOutput','shift')!=='20')throw new Error('Splitting output lost existing measurements');
return 'EVD → ICP → output layout / saved values checks PASS';`)();report(evdResult);
