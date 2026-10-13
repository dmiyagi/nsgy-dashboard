function fn(name){const a=source.indexOf('function '+name+'('),line=source.slice(a,source.indexOf('\n',a));return line.endsWith('}')?line:source.slice(a,source.indexOf('\n}',a)+2)}
report(new Function(`
const todayStr=()=>"2026-10-12",slotActiveKeys=()=>['icp','drainOutput'];
const slotVisibleFields=(r,k)=>k==='icp'?[['cur']]:[['out24']];
const slotVal=(r,k,f)=>(r.slots[k==='drainOutput'?'drain':k]||{})[f]||'';
${['nccuBaseline','nccuChangeCount','nccuResetOne','slotCaptureChange'].map(fn).join('\n')}
const r={slots:{icp:{cur:'8-20'},drain:{out24:'235'}},so:{Exam:'new'},soSnapDay:todayStr(),soSnap:{Exam:'old','slot:icp.cur':'8-18','slot:drain.out24':'200'}};
if(nccuChangeCount(r)!==3)throw Error('Wrong change count');
nccuResetOne(r);
if(nccuChangeCount(r)!==0)throw Error('Reset left change badge active');
slotCaptureChange(r,'icp','cur');r.slots.icp.cur='10-20';
if(nccuChangeCount(r)!==1)throw Error('New edit after reset was not tracked');
nccuResetOne(r);
if(nccuChangeCount(r)!==0||r.slots.icp.cur!=='10-20')throw Error('Reset changed saved values');
return 'Change tracking reset checks PASS';
`)());
