export default function DesktopSortBar() {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <button className="bg-gray-100 px-3 py-1 rounded mr-2">
          Sort By: Position
        </button>
        <button className="bg-gray-100 px-3 py-1 rounded">
          Show: 35 per page
        </button>
      </div>
      <div>
      </div>
    </div>
  );
}
