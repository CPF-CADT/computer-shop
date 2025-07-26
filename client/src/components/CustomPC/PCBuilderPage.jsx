import { useState, useEffect, useCallback } from "react";
import PCBuilderSelector from "./PCBuilderSelector";
import PCBuilderSummary from "./PCBuilderSummary";
import { apiService } from '../../service/api';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCategory } from '../context/CategoryContext';
import toast from 'react-hot-toast';

const COMPONENT_API_MAPPING = [
  { key: "cpu", label: "CPU", categoryTitle: "Processors", typeProductTitle: "CPU" },
  { key: "gpu", label: "GPU", categoryTitle: "Graphics Cards", typeProductTitle: "Graphic Card" },
  { key: "motherboard", label: "Motherboard", categoryTitle: "Motherboards", typeProductTitle: "Motherboard" },
  { key: "ram", label: "RAM", categoryTitle: "Memory", typeProductTitle: "RAM" },
  { key: "psu", label: "Power Supply", categoryTitle: "Power Supplies", typeProductTitle: "Power Supply" },
  { key: "cooler", label: "Cooler", categoryTitle: "Cooling", typeProductTitle: "CPU Cooler" },
  { key: "case", label: "Case", categoryTitle: "Cases", typeProductTitle: "PC Case" },
  { key: "fan", label: "Fan", categoryTitle: "Cooling", typeProductTitle: "Case Fan" },
];

export default function PCBuilderPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const customerId = user?.id;
  const { loadingCategories, categoryError: categoryContextError } = useCategory();

  const [productsData, setProductsData] = useState({});
  const [selectedComponents, setSelectedComponents] = useState({});
  const [promotions, setPromotions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [apiError, setApiError] = useState(null);

  const overallError = apiError || categoryContextError;

  useEffect(() => {
    const fetchBuilderProducts = async () => {
      setApiError(null);
      const fetchedProducts = {};
      const loadingMap = {};

      await Promise.all(
        COMPONENT_API_MAPPING.map(async (compType) => {
          loadingMap[compType.key] = true;
          setLoadingStates((prev) => ({ ...prev, ...loadingMap }));

          try {
            const response = await apiService.getProducts({
              type_product: compType.typeProductTitle,
              limit: 50,
              sort: 'asc',
              order_column: 'name',
            });

            fetchedProducts[compType.key] = response.data.map(p => ({
              id: p.product_code,
              name: p.name,
              price: p.price.amount,
              image: p.image_path,
              originalProduct: p,
            }));
          } catch (err) {
            console.error(`Failed to fetch ${compType.label} products:`, err);
          } finally {
            setLoadingStates((prev) => ({ ...prev, [compType.key]: false }));
          }
        })
      );

      setProductsData(fetchedProducts);
    };

    const fetchPromotions = async () => {
      setLoadingPromotions(true);
      try {
        const fetchedPromotions = await apiService.getAllPromotions();
        setPromotions(fetchedPromotions.data || []);
      } catch (err) {
        console.error("PC Builder Promotions Fetch Error:", err);
      } finally {
        setLoadingPromotions(false);
      }
    };

    fetchBuilderProducts();
    fetchPromotions();
  }, []);

  const handleSelect = useCallback((key, id) => {
    const componentItems = productsData[key];
    const item = componentItems ? componentItems.find((i) => i.id === id) : null;
    setSelectedComponents((prev) => ({ ...prev, [key]: item }));
  }, [productsData]);

  const handleRemove = useCallback((key) => {
    setSelectedComponents((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }, []);

  const handleAddToCart = useCallback(async () => {
    if (!customerId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    const selectedComponentsArray = Object.values(selectedComponents).filter(Boolean);
    if (selectedComponentsArray.length === 0) {
      toast.error("Please select at least one component to add to cart.");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, addToCart: true }));

    try {
      const addPromises = selectedComponentsArray.map(async (item) => {
        if (item && item.originalProduct) {
          await addToCart({
            ...item.originalProduct,
            qty: 1,
          });
        } else {
          throw new Error(`Invalid component selected for cart: ${item?.name || 'unknown'}`);
        }
      });

      await Promise.all(addPromises);
      toast.success("Selected components added to cart successfully!");
    } catch (err) {
      console.error("Failed to add components to cart:", err);
      toast.error(err.message || "Failed to add components to cart. Please try again.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, addToCart: false }));
    }
  }, [addToCart, customerId, selectedComponents]);

  const totalPrice = Object.values(selectedComponents).reduce(
    (sum, item) => sum + (item ? Number(item.price) : 0),
    0
  );

  const applicablePromotions = promotions.filter(promo => true);

  if (overallError) {
    return <div className="text-center py-20 text-xl font-semibold text-red-500">{overallError}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        {COMPONENT_API_MAPPING.map((compType) => (
          <div key={compType.key} className="mb-8">
            <h2 className="text-lg font-semibold mb-2">{compType.label}</h2>

            {loadingStates[compType.key] ? (
              <div className="text-gray-500 text-sm">Loading {compType.label}...</div>
            ) : (
              <PCBuilderSelector
                items={productsData[compType.key] || []}
                title={compType.label}
                onSelect={(id) => handleSelect(compType.key, id)}
                selectedId={selectedComponents[compType.key]?.id}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-full md:w-80">
        <PCBuilderSummary
          selectedList={Object.entries(selectedComponents)}
          totalPrice={totalPrice}
          onRemove={handleRemove}
          onAddToCart={handleAddToCart}
          isAddToCartLoading={loadingStates.addToCart}
          promotions={applicablePromotions}
        />
      </div>
    </div>
  );
}
