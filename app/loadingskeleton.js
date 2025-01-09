import { Loader2 } from "lucide-react";

export default function LoadingSkeleton() {
  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {/* Header loading animation */}
      <div className="flex flex-col items-center mb-12">

        <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-48 animate-pulse mb-4" />
        <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded w-3/4 max-w-2xl animate-pulse" />
      </div>

      {/* Genre sections loading */}
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="mb-12">
          {/* Genre header with gradient */}
          <div className="mb-6">
            <div className="h-12 rounded-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Novel cards loading */}
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400">
            {[1, 2, 3, 4].map((card) => (
              <div
                key={card}
                className="flex-shrink-0 w-48 bg-white rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg"
                style={{ minWidth: "200px" }}
              >
                {/* Image placeholder */}
                <div className="relative w-full h-48 bg-gradient-to-b from-gray-200 to-gray-300 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>

                {/* Title placeholder */}
                <div className="p-4">
                  <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse mb-3" />
                  <div className="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded animate-pulse w-2/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Add this CSS to your globals.css or relevant style file
const styles = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
`;