const SkeletonCard = () => {
  return (
    <div className="menu-card skeleton-card">
      <div className="skeleton-img shimmer">
        <div className="skeleton-offer shimmer"></div>
      </div>

      <div className="skeleton-info">
        <div className="skeleton-line shimmer"></div>
        <div className="skeleton-line small shimmer"></div>
        <div className="skeleton-btn shimmer"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
