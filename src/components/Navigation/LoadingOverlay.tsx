type LoadingOverlayProps = {
  className?: string;
};

export const LoadingOverlay = ({ className }: LoadingOverlayProps) => {
  return (
    <div className={`loading-overlay ${className}`}>
      <div className="ring">
        <span></span>
      </div>
    </div>
  );
};
