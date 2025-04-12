export const Loader = () => {
    return (
      <div className="fixed inset-0 z-9999999 flex items-center justify-center bg-opacity-40 backdrop-blur-[1px] pointer-events-auto">
        <div className="relative w-16 h-16">
          {/* Outer Spinning Ring */}
          <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
  
          {/* Inner Glowing Dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-brand-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping" />
        </div>
      </div>
    );
  };
  