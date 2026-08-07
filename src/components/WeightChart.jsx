export const WeightChart = ({ points }) => {
  if(!points||points.length<2) return <div style={{height:90,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink3)",fontSize:12}}>Log 2+ sessions to see this chart</div>;
  const W=280,H=110,padL=26,padR=10,padT=18,padB=20;
  const vals=points.map(p=>p.weight);
  const min=Math.min(...vals),max=Math.max(...vals);
  const range=(max-min)||1;
  const innerW=W-padL-padR, innerH=H-padT-padB;
  const xy=points.map((p,i)=>[padL+(i/(points.length-1))*innerW, padT+innerH-((p.weight-min)/range)*innerH]);
  let d=`M ${xy[0]}`;
  for(let i=1;i<xy.length;i++) d+=` L ${xy[i]}`;
  const gridVals=[min,(min+max)/2,max];
  return(
    <svg width="100%" height={H+16} viewBox={`0 0 ${W} ${H+16}`} preserveAspectRatio="none">
      {gridVals.map((gv,i)=>{
        const y=padT+innerH-((gv-min)/range)*innerH;
        return(<g key={i}>
          <line x1={padL} y1={y} x2={W-padR} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="3,3"/>
          <text x={0} y={y+3} fontSize="9" fill="var(--ink3)" fontFamily="Inter,sans-serif">{Math.round(gv)}</text>
        </g>);
      })}
      <path d={d} fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {xy.map(([x,y],i)=>(<circle key={i} cx={x} cy={y} r="3.5" fill="var(--white)" stroke="var(--green)" strokeWidth="2"/>))}
      <text x={xy[xy.length-1][0]} y={xy[xy.length-1][1]-8} textAnchor="end" fontSize="10" fill="var(--green)" fontWeight="700" fontFamily="Inter,sans-serif">{vals[vals.length-1]}kg</text>
      {points.map((p,i)=>(<text key={i} x={xy[i][0]} y={H+12} textAnchor="middle" fontSize="8.5" fill="var(--ink3)" fontFamily="Inter,sans-serif">{new Date(p.date).toLocaleDateString("en-GB",{weekday:"short",day:"numeric"})}</text>))}
    </svg>
  );
};
