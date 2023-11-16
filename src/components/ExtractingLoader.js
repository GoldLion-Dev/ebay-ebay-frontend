const ExtractingLoader = ({ count, totalCount }) => {
  return (
    <div className="flex flex-col items-center justify-center h-72">
      <div className="flex space-x-2">
        <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
        <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce2"></div>
        <div className="h-4 w-4 rounded-full bg-blue-500 animate-bounce"></div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-lg text-gray-500">
          {count}/{totalCount}つの製品が抽出されました。。
        </p>
      </div>
    </div>
  );
};

export default ExtractingLoader;
