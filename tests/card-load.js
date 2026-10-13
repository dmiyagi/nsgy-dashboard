function fn(name){const a=source.indexOf('function '+name+'(');return source.slice(a,source.indexOf('\n}',a)+2)}
report(new Function(`
let _pendingRender=false,pendingRenderT=null,uiLockUntil=1500,editing=false,now=0,draws=0,timer;
const Date={now:()=>now},clearTimeout=()=>{},setTimeout=(f,d)=>{timer={f,d};return 1};
const activeEdit=()=>editing,uiBusy=()=>editing||now<uiLockUntil;
const renderReadOnly=f=>f(),renderAll=()=>draws++,renderBlocks=()=>{};
${['deferPendingRender','renderAllSafe'].map(fn).join('\n')}
renderAllSafe();
if(draws||timer.d!==1520)throw Error('Tap guard retry not scheduled promptly');
now=1520;timer.f();
if(draws!==1||_pendingRender)throw Error('Cards waited for clock tick');
editing=true;renderAllSafe();timer.f();
if(draws!==1||!_pendingRender)throw Error('Active editor was replaced');
editing=false;deferPendingRender();timer.f();
if(draws!==2)throw Error('Pending cards did not render after editing');
return 'Card load scheduling checks PASS';
`)());
