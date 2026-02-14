export default function ScreenLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-100 flex bg-white/50 flex-col items-center justify-center">
      <div className="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className="text-white font-medium animate-pulse">{message}</p>
    </div>
  );
}
