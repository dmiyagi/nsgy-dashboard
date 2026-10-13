const start=source.indexOf('function teamRoomComparator(');
const fn=source.slice(start,source.indexOf('\n}',start)+2);
const result=new Function(`
const roundTeamKey=r=>r.team||'',roundRoom=r=>r.room||'',initialsOf=r=>r.name||'';
${fn}
const rows=[{team:'PINK',room:'B10'},{team:'BLUE',room:'B20'},{team:'PINK',room:'B2'},{team:'BLUE',room:'B3'}];
const result=rows.sort(teamRoomComparator).map(r=>r.team+':'+r.room).join(',');
if(result!=='BLUE:B3,BLUE:B20,PINK:B2,PINK:B10')throw new Error('Team-first / numeric room ordering failed');
return 'Team → Room sort checks PASS';
`)();report(result);
