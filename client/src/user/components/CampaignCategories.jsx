import categories from "../../data/campaign-categories.data";
import { Link } from "react-router-dom";

const CampaignCategories = () => {
    return (
        <div className="bg-white shadow-2xl border-t border-gray-200 rounded-lg">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-2 md:grid-cols-4 gap-8">

                {categories.map((category) => (
                    <div key={category.title} className="text-center">
                        <h4 className="font-semibold text-gray-800 mb-3 text-lg">
                            <Link
                                to={`/explore-campaigns?category=${encodeURIComponent(category.title)}`}
                                className="text-gray-600 hover:text-indigo-600 transition"
                            >
                                {category.title}
                            </Link>
                        </h4>


                        <ul className="space-y-2 flex flex-col items-center">
                            {category.items.map((item) => (
                                <li key={item}>
                                    <Link
                                        to={`/explore-campaigns?category=${encodeURIComponent(category.title)}&subCategory=${encodeURIComponent(item)}`}
                                        className="text-gray-600 hover:text-indigo-600 transition"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignCategories;