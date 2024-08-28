import React from "react";
import EditVariationForm from "./EditVariationForm";
import DeleteVariationForm from "./DeleteVariationForm";
import NewVariationForm from "./NewVariationForm";
import { MenuItemVariationProperties } from "./menuProperties";



interface MenuItemVariationComponentProps {
    variation: MenuItemVariationProperties;
    handleEditVariation: (variation: MenuItemVariationProperties) => void;
    handleDeleteVariation: (variation: MenuItemVariationProperties) => void;
}

const MenuItemVariationComponent: React.FC<MenuItemVariationComponentProps> = ({
    variation,
    handleEditVariation,
    handleDeleteVariation,
}) => {
    return (
        <>
            <br />
            <div key={variation.id} className="flex justify-between items-center">
                <div>
                    <p className="text-sm">{variation.menu_item_variation_description}</p>
                    <p className="text-sm">+${variation.price_difference}</p>
                </div>
                {variation.menu_item_variation_description !== "Base" && (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEditVariation(variation)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#000000"
                                height="15px"
                                width="15px"
                                viewBox="0 0 306.637 306.637"
                            >
                                <g>
                                    <g>
                                        <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896    l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                                        <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095    L265.13,75.602L231.035,41.507z" />
                                    </g>
                                </g>
                            </svg>
                        </button>

                        <button
                            onClick={() => handleDeleteVariation(variation)}
                            className="p-1 bg-red-500 text-black rounded hover:bg-red-700"
                        >
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            <br />
            <hr className="dashed" />
        </>
    );
};

export default MenuItemVariationComponent;