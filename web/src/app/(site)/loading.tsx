export default function Loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange-200 border-t-orange-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-orange-500"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Loading delicious food...</p>
          <p className="text-sm text-gray-500">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  );
}