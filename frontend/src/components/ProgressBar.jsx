const ProgressBar = ({ progress }) => {
  return (
    <div className="h-1 bg-gray-300 w-full">
      <div
        className="h-full bg-blue-500 transition-all duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
