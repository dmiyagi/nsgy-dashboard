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
