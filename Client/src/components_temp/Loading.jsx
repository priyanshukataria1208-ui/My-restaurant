

const Loader = () => {
  return (
    <div className="dark-loader">
      <div className="spinner-ring"></div>
      <img src="logo.png" alt="Food Logo" className="food-logo" />
      <p className="loading-text">Preparing something tasty...</p>
    </div>
  );
};

export default Loader;
