import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-var-background">
      <div className="flex flex-col items-center space-y-4 animate-fadeIn">
        <img
          src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTZ6aTBha21zNWVrbGd6Mmw0cmRkdG9iOWZrdHA4NHg1Yjg4bHlxbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gJ3mEToTDJn3LT6kCT/giphy.gif"
          alt="Loading..."
          className="w-40 h-40 rounded-lg shadow-md transition-transform hover:scale-110"
        />
        <p className="text-var-muted text-lg font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
