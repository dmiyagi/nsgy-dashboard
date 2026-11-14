const start=source.indexOf('function teamRoomComparator(');
const fn=source.slice(start,source.indexOf('\n}',start)+2);
const helpers=['roomUnitRank','compareRoomText','roomCardComparator'].map(name=>{const a=source.indexOf('function '+name+'(');return source.slice(a,source.indexOf('\n}',a)+2)}).join('\n');
const result=new Function(`
const roundTeamKey=r=>r.team||'',roundRoom=r=>r.room||'',initialsOf=r=>r.name||'';
${helpers}
${fn}
if(compareRoomText('NCCU07','NCCU12')>=0||compareRoomText('NCCU2','NCCU07')>=0||compareRoomText('NCCU09','NCCU9')!==0||compareRoomText('B99','B100')>=0)throw new Error('Numeric room comparison failed');
const rows=[{team:'PINK',room:'B10'},{team:'BLUE',room:'B20'},{team:'PINK',room:'B2'},{team:'BLUE',room:'B3'}];
const result=rows.sort(teamRoomComparator).map(r=>r.team+':'+r.room).join(',');
if(result!=='BLUE:B3,BLUE:B20,PINK:B2,PINK:B10')throw new Error('Team-first / numeric room ordering failed');
const units=[{room:'TICU4'},{room:'B706'},{room:'ED'},{room:'SICU2'},{room:'NCCU11'}];
if(units.sort(roomCardComparator).map(r=>r.room).join(',')!=='B706,NCCU11,ED,SICU2,TICU4')throw new Error('ED then outside ICUs must sort last');
return 'Team → Room sort checks PASS';
`)();report(result);

// Rooms are read off the text people actually type, and clinical shorthand is
// not a room: a patient in 4E12 was being filed under "POD1", or nowhere.
const roomResult=new Function(`
function constOf(src,name){const a=src.indexOf('const '+name+'=');return src.slice(a,src.indexOf('\\n',a))}
${['spineLevelToken','roomTokenOk','nameTokenOk','firstRoomToken','roundBedFromText','last3FromText','capPt'].map(name=>{const a=source.indexOf('function '+name+'(');return source.slice(a,source.indexOf('\n}',a)+2)}).join('\n')}
${(function(){const a=source.indexOf('const ROUND_BED_RE=');return source.slice(a,source.indexOf('\n',a))})()}
${(function(){const a=source.indexOf('const NOT_A_ROOM_RE=');return source.slice(a,source.indexOf('\n',a))})()}
const want=[['4E12 JON TBI POD1','4E12','JON'],['5E12 WIL TLIF POD1','5E12','WIL'],['2N4 ROD SDH','2N4','ROD'],
 ['7W12 HAN SDH','7W12','HAN'],['N5 SMI aSAH','N5','SMI'],['NCCU 7 ABC SDH','NCCU7','ABC'],['AT10 EXX aSAH POD2','AT10','EXX'],
 ['52F aSAH pcomm coiled POD2','',''],['TBI on PEEP 5 FiO2 82, GCS 8','',''],['L4-5 TLIF POD1','',''],
 ['SDH on 2L NC, SBP 160','',''],['Keppra 500 BID, Na 147','','']];
want.forEach(([text,room,name])=>{
  const r=roundBedFromText(text),n=last3FromText(text);
  if(r!==room||n!==name)throw new Error('Room/name parsed wrong for "'+text+'": got '+JSON.stringify(r)+'/'+JSON.stringify(n));
});
return 'Room + name parsing checks PASS';`)();report(roomResult);

