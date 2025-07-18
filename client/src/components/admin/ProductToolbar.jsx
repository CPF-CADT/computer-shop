import React from 'react';

export default function ProductToolbar({
    filters = {},
    onFilterChange,
    onAddProductClick,
    categories = [],
    brands = [],
    typeProducts = [],
}) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        name="name"
                        placeholder="Search by name..."
                        value={filters.name || ""}
                        onChange={handleInputChange}
                        className="px-3 py-2 rounded-md border border-gray-300 w-full md:w-auto"
                    />
                    <select
                        name="sort"
                        value={filters.sort || "asc"}
                        onChange={handleInputChange}
                        className="px-3 py-2 rounded-md border border-gray-300"
                    >
                        <option value="asc">Sort: A-Z</option>
                        <option value="desc">Sort: Z-A</option>
                    </select>
                </div>
                <button
                    onClick={onAddProductClick}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    Add Product
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <select name="category" value={filters.category || ""} onChange={handleInputChange} className="px-3 py-2 rounded-md border border-gray-300 w-full">
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.title}>
                            {category.title}
                        </option>
                    ))}
                </select>

                <select name="brand" value={filters.brand || ""} onChange={handleInputChange} className="px-3 py-2 rounded-md border border-gray-300 w-full">
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.name}>
                            {brand.name}
                        </option>
                    ))}
                </select>

                <select name="type_product" value={filters.type_product || ""} onChange={handleInputChange} className="px-3 py-2 rounded-md border border-gray-300 w-full">
                    <option value="">All Types</option>
                    {typeProducts.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>

                <select name="price" value={filters.price || ""} onChange={handleInputChange} className="px-3 py-2 rounded-md border border-gray-300 w-full">
                    <option value="">All Prices</option>
                    <option value="0-500">$0 - $500</option>
                    <option value="501-1500">$501 - $1500</option>
                    <option value="1501-3000">$1501 - $3000</option>
                </select>
            </div>
        </div>
    );
}