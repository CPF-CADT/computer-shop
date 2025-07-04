export default function ProductFilterBar() {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select className="px-3 py-2 rounded-md border border-gray-300">
        <option>Category: Jackets (132)</option>
      </select>
      <select className="px-3 py-2 rounded-md border border-gray-300">
        <option>All Status</option>
      </select>
      <select className="px-3 py-2 rounded-md border border-gray-300">
        <option>Price: $50 - $100</option>
      </select>
      <select className="px-3 py-2 rounded-md border border-gray-300">
        <option>All Store</option>
      </select>
    </div>
  );
}