export default function LoadingSpinner({ show = true }) {
  if (!show) return null;

  return (
    <div className="loading-spinner-overlay active">
      <div className="spinner"></div>
    </div>
  );
}
