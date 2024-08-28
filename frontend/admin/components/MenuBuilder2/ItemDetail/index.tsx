import React, { useState } from 'react';
import Variations from './Variations';
import { backendURL } from '@/public/config';
import { fullItemRoot } from '../menuProperties';


import NewVariationForm from '../NewVariationForm';
import EditVariationForm from '../EditVariationForm';
import DeleteVariationForm from '../DeleteVariationForm';
import EditItemRootForm from '../EditItemRootForm';
import DeleteItemRootForm from '../DeleteItemRootForm';


const Itemdetail = ({ closeItemDetail, itemRoot, jwt, menuId, sectionId, updateMenu }) => {

    const [showVariationForm, setShowVariationForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState<fullItemRoot['MenuItemVariations'][0] | null>(null);
    const [newVariation, setNewVariation] = useState({
        description: '',
        priceDifference: '',
    });

    const [showEditItemRootForm, setShowEditItemRootForm] = useState(false);
    const [showDeleteItemRootConfirm, setShowDeleteItemRootConfirm] = useState(false);
    const [editItemRoot, setEditItemRoot] = useState({
        name: itemRoot.menu_item_root_name,
        price: itemRoot.base_price,
        description: itemRoot.menu_item_root_description,
        prepTimeRequired: itemRoot.prep_time_required,
    });

    const handleAddVariation = () => {
        setShowVariationForm(true);
    };

    const handleCloseVariationForm = () => {
        setShowVariationForm(false);
    };

    const handleEditVariation = (variation: fullItemRoot['MenuItemVariations'][0]) => {
        setSelectedVariation(variation);
        setNewVariation({
            description: variation.menu_item_variation_description,
            priceDifference: variation.price_difference.toString(),
        });
        setShowEditForm(true);
    };

    const handleCloseEditForm = () => {
        setShowEditForm(false);
    };

    const handleDeleteVariation = (variation: fullItemRoot['MenuItemVariations'][0]) => {
        setSelectedVariation(variation);
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = () => {
        setShowDeleteConfirm(false);
    };

    const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewVariation((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRootChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as any;
        setEditItemRoot((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmitVariation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const submit = async () => {
            try {
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${sectionId}/item/${itemRoot.id}/variation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        menu_item_variation_description: newVariation.description,
                        price_difference: parseFloat(newVariation.priceDifference).toFixed(2)
                    })
                });
                if (res.ok) {
                    await updateMenu();
                    setShowVariationForm(false);
                } else {
                    console.log(await res.json());
                    throw new Error('Failed to add menu variation');
                }
            } catch (error) {
                console.error('Error saving variation:', error);
            }
        };

        submit();
    };

    const handleUpdateVariation = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const update = async () => {
            try {
                if (!selectedVariation) return;
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${sectionId}/item/${itemRoot.id}/variation/${selectedVariation.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        menu_item_variation_description: newVariation.description,
                        price_difference: parseFloat(newVariation.priceDifference)
                    })
                });
                if (res.ok) {
                    await updateMenu();
                    setShowEditForm(false);
                } else {
                    alert((await res.json()).error.message)
                    throw new Error('Failed to update menu variation');
                }
            } catch (error) {
                console.error('Error updating variation:', error);
            }
        };

        update();
    };

    const handleConfirmDelete = () => {
        const remove = async () => {
            try {
                if (!selectedVariation) return;
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${sectionId}/item/${itemRoot.id}/variation/${selectedVariation.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                });
                if (res.ok) {
                    await updateMenu();
                    setShowDeleteConfirm(false);
                } else {
                    alert((await res.json()).error.message)
                    throw new Error('Failed to delete menu variation');
                }
            } catch (error) {
                console.error('Error deleting variation:', error);
            }
        };

        remove();
    };

    const handleEditItemRoot = () => {
        setShowEditItemRootForm(true);
    };

    const handleCloseEditItemRootForm = () => {
        setShowEditItemRootForm(false);
    };

    const handleSubmitEditItemRoot = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const update = async () => {
            try {
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${sectionId}/item/${itemRoot.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        menu_item_root_name: editItemRoot.name,
                        base_price: parseFloat(`${editItemRoot.price}`),
                        menu_item_root_description: editItemRoot.description,
                        prep_time_required: editItemRoot.prepTimeRequired
                    })
                });
                if (res.ok) {
                    await updateMenu();
                    setShowEditItemRootForm(false);
                } else {
                    alert((await res.json()).error.message)
                    throw new Error('Failed to update menu item root');
                }
            } catch (error) {
                console.error('Error updating item root:', error);
            }
        };

        update();
    };

    const handleDeleteItemRoot = () => {
        setShowDeleteItemRootConfirm(true);
    };

    const handleCloseDeleteItemRootConfirm = () => {
        setShowDeleteItemRootConfirm(false);
    };

    const handleConfirmDeleteItemRoot = () => {
        const remove = async () => {
            try {
                const res = await fetch(`${backendURL}admin/menu/${menuId}/section/${sectionId}/item/${itemRoot.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                });
                if (res.ok) {
                    await updateMenu();
                    setShowDeleteItemRootConfirm(false);
                } else {
                    alert((await res.json()).error.message)
                    throw new Error('Failed to delete menu item root');
                }
            } catch (error) {
                console.error('Error deleting item root:', error);
            }
        };

        remove();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 pt-5">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl h-5/6 overflow-hidden pb-40">
                <div className='flex justify-end'>
                    <button className=""
                        onClick={() => closeItemDetail()}
                    >
                        <svg
                            className="w-7 h-7"
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


                <h2 className="text-2xl font-bold mb-4">{ }</h2>

                {/*  */}
                <div className="flex">
                    <div>
                        <div className='flex justify-between'>
                            <h2 className="text-3xl font-bold mb-4">{itemRoot.menu_item_root_name}</h2>
                            <div className="text-right">
                                <div className="flex space-x-0">
                                    <button
                                        onClick={handleEditItemRoot}
                                        className="p-1  text-black rounded "
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="19px" width="19px" viewBox="0 0 306.637 306.637">
                                            <g>
                                                <g>
                                                    <path d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896    l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z" />
                                                    <path d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095    L265.13,75.602L231.035,41.507z" />
                                                </g>
                                            </g>
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleDeleteItemRoot}
                                        className="p-1  text-black rounded "
                                    >
                                        <svg
                                            className="w-7 h-7"
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
                            </div>
                        </div>

                        <p className="text-lg font-bold">${itemRoot.base_price}</p>
                        <p className="text-sm">Prep time: {itemRoot.prep_time_required ? 'Required' : 'Not required'}</p>
                        <p>{itemRoot.menu_item_root_description}</p>
                    </div>

                </div>
                {/*  */}

                <p className='mt-4'><b>Variations</b></p>

                <div className="space-y-4 h-4/6 overflow-y-auto pb-10" >

                    <div className="mt-2">
                        {itemRoot.MenuItemVariations.map((variation) => <Variations key={variation.id} variation={variation} handleDeleteVariation={() => { handleDeleteVariation(variation) }} handleEditVariation={handleEditVariation} />)}
                    </div>


                </div>


                {/* <div

                    className='flex justify-end'
                >
                    <button
                        onClick={handleAddVariation}
                        className="w-12 h-12 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            ></path>
                        </svg>
                    </button>
                    <span className="absolute bottom-full -translate-x-1/4 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs py-1 px-2 rounded">Add Variation</span>
                </div> */}


                <div className="relative">
                    <div className="absolute bottom-[1] right-2 pt-3 text-white">
                        <button
                            onClick={handleAddVariation}
                            className="w-12 h-12 bg-blue-500 text-white rounded shadow-md flex items-center justify-center hover:bg-blue-700"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div
                // className="flex justify-start mt-4 relative group"
                >

                </div>
            </div>

            {showVariationForm && <NewVariationForm handleVariationChange={handleVariationChange} handleCloseVariationForm={handleCloseVariationForm} handleSubmitVariation={handleSubmitVariation} newVariation={newVariation} />}

            {showEditForm && <EditVariationForm handleVariationChange={handleVariationChange} handleCloseEditForm={handleCloseEditForm} handleUpdateVariation={handleUpdateVariation} newVariation={newVariation} />}

            {showDeleteConfirm && <DeleteVariationForm selectedVariation={selectedVariation} handleCloseDeleteConfirm={handleCloseDeleteConfirm} handleConfirmDelete={handleConfirmDelete} />}

            {showEditItemRootForm && <EditItemRootForm handleRootChange={handleRootChange} handleCloseEditForm={handleCloseEditItemRootForm} handleSubmitEditForm={handleSubmitEditItemRoot} editItemRoot={editItemRoot} />}

            {showDeleteItemRootConfirm && <DeleteItemRootForm selectedItemRoot={itemRoot} handleCloseDeleteConfirm={handleCloseDeleteItemRootConfirm} handleConfirmDelete={handleConfirmDeleteItemRoot} />}

        </div>
    );
};

export default Itemdetail