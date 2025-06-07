import { Link } from 'react-router-dom';

export default function HotProduct({ slogan, brand_model, type_product, box_width, image }) {
    const isWide = box_width > 600;
    const isSmall = box_width < 500;
    const textSize = box_width > 600 ? 'text-3xl' : box_width > 400 ? 'text-2xl' : 'text-lg';
    const textSizeSlogan = box_width > 600 ? 'text-xl' : box_width > 400 ? 'text-lg' : 'text-sm';
    const gapY = box_width > 600 ? 'gap-y-5' : box_width > 400 ? 'gap-y-3' : '';
    const gapX = box_width > 400 ? 'gap-x-3' : box_width > 400 ? 'gap-x-1' : '';
    const containerDirection = isWide ? 'flex-row' : 'flex-col';

    return (
        <div className={`flex ${containerDirection} ${gapX} h-80 p-6 bg-white rounded-lg shadow items-center`}>
            <div className={`flex flex-col justify-center ${gapY} flex-1`}>
                {slogan && <p  className={`text-gray-500 ${textSizeSlogan}`}>{slogan}</p>}
                <h2 className={`font-bold ${textSize}`}>{brand_model}</h2>
                <h2 className={`font-bold text-[#E9A426] ${textSize}`}>{type_product}</h2>
                {isSmall ? (
                    <Link to="/shop" className="text-xs text-[#E9A426] underline hover:text-[#d9901b] transition gap-5">
                        Learn more
                    </Link>
                ) : (
                    <button className="text-xs w-26 h-9 rounded-md bg-[#FFA726] text-black font-semibold text-lg hover:brightness-110 transition">
                        Shop Now
                    </button>
                )}
            </div>
            <div className="flex-1 flex items-center justify-center">
                <img src={image} alt={type_product} className="w-40 h-28 object-contain" />
            </div>
        </div>
    );
}