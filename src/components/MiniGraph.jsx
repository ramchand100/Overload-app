export const MiniGraph = ({ data }) => {
  if(!data||data.length<2) return <div style={{height:60,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ink3)",fontSize:12}}>Log more sessions to see your curve</div>;
  const W=280,H=60,pad=8;
  const vals=data.map(d=>d.kg);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const pts=vals.map((v,i)=>[pad+(i/(vals.length-1))*(W-pad*2),H-pad-((v-min)/range)*(H-pad*2)]);
  let d=`M ${pts[0]}`;
  for(let i=1;i<pts.length;i++){const[x1,y1]=pts[i-1],[x2,y2]=pts[i];d+=` Q ${(x1+x2)/2},${y1} ${x2},${y2}`;}
  return(
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs><linearGradient id="grd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2C2C2C" stopOpacity="0.08"/><stop offset="100%" stopColor="#2C2C2C" stopOpacity="0"/></linearGradient></defs>
      <path d={d+` L ${pts[pts.length-1][0]},${H} L ${pad},${H} Z`} fill="url(#grd)"/>
      <path d={d} fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round"/>
      {pts.map(([x,y],i)=>(<g key={i}><circle cx={x} cy={y} r="3.5" fill="#2C2C2C"/><text x={x} y={y-8} textAnchor="middle" fontSize="9" fill="#666" fontFamily="Inter,sans-serif" fontWeight="700">{vals[i]}</text></g>))}
    </svg>
  );
};
