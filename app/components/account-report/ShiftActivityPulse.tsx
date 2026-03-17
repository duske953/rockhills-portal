'use client';

const ShiftActivityPulse = ({ customers }: { customers: any[] }) => {
  return (
    <div className="w-full flex items-center gap-1.5 px-1 py-3 group">
      <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse group-hover:bg-primary transition-colors" />
      <div className="flex-1 h-[1px] rounded-full bg-slate-100 relative overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        {customers.map((_, i) => (
          <div
            key={i}
            className="absolute h-3 w-[1px] bg-primary/40 blur-[0.5px] group-hover:bg-primary group-hover:h-5 transition-all duration-500"
            style={{
              left: `${(i / Math.max(1, customers.length - 1)) * 96 + 2}%`,
              opacity: 0.2 + (i / customers.length) * 0.8,
            }}
          />
        ))}
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-primary/30 animate-pulse group-hover:bg-primary transition-colors" />
    </div>
  );
};

export default ShiftActivityPulse;
