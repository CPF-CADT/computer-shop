import { Link } from 'react-router-dom'; // Optional: if using React Router

export default function HotProduct({ slogan, brand_model, type_product, box_width }) {
    const isWide = box_width > 600;
    const isSmall = box_width < 500;
    const textSize = box_width > 600 ? 'text-3xl' : box_width > 400 ? 'text-2xl' : 'text-lg ';
    const textSizeSlogan = box_width > 600 ? 'text-2xl' : box_width > 400 ? 'text-lg' : 'text-sm ';
    const gapY = box_width > 600 ? 'gap-y-5' : box_width > 400 ? 'gap-y-3' : ' ';
    const gapX = box_width > 600 ? 'gap-x-3' : box_width > 400 ? 'gap-x-1' : ' ';
    const containerDirection = isWide ? 'flex-row' : 'flex-col';

    return (
        <div className={`flex ${containerDirection} ${gapX} h-72 p-2`}>
            <div className={`flex flex-col justify-center ${gapY}`}>
                <p className={`text-gray-600 ${textSizeSlogan}`}>{slogan}</p>
                <h2 className={`font-bold ${textSize}`}>{brand_model}</h2>
                <h2 className={`font-bold text-[#E9A426] ${textSize}`}>{type_product}</h2>

                {isSmall ? (
                    <Link to="/shop" className="text-[#E9A426] underline hover:text-[#d9901b] transition">
                        Shop Now
                    </Link>
                ) : (
                    <button className="w-28 h-10 rounded-2xl bg-[#E9A426] text-black hover:cursor-pointer hover:brightness-110 transition">
                        Shop Now
                    </button>
                )}
            </div>

            <div className="w-56 h-full m-1 bg-amber-400 flex items-center justify-center text-white text-lg font-semibold rounded-lg shadow-md">
                Img
            </div>
        </div>
    );
}
