import React from 'react';


const Timeline = ({ variation, handleCreateNewTicketItem, closeMenu }) => {


    return (
        <div className="relative flex flex-col items-center w-full">
            <div className="relative w-full">

                <br />
                <div key={variation.id} className="flex justify-between items-center">
                    <div>
                        <p className="text-sm">{variation.menu_item_variation_description}</p>
                        <p className="text-sm">+${variation.price_difference}</p>
                    </div>
                    <div>
                        <button
                            onClick={async () => { await handleCreateNewTicketItem(variation.id); closeMenu() }}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            Add Item
                        </button>
                    </div>
                </div>

                <br />
                <hr className="dashed" />

            </div>
        </div>
    );
}

export default Timeline;
