export function TabList({ tabs, toggleShowNewTabForm, setSelectedTab, selectedTab }) {
    return (
        <div className="pt-12">
            <h1 className="text-center text-2xl font-bold my-8">Takeout Tabs</h1>
            <div className="container mx-auto">
                <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-lg">
                    {tabs.map((tab) => (
                        <div key={tab.id} className="relative w-full" onClick={() => { setSelectedTab(tab) }}>
                            <div className="flex flex-col items-start justify-start w-full h-55 p-4 bg-gray-200 border border-gray-400 rounded shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer">
                                <h2 className="text-center text-2xl font-bold mb-2">{tab.customer_name}</h2>
                                <p className="text-center text-lg text-gray-700">Status: {tab.tab_status}</p>
                            </div>
                        </div>
                    ))}
                    <div
                        className="flex items-center justify-center w-full h-20 p-4 bg-white border border-gray-300 rounded shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
                        onClick={() => toggleShowNewTabForm()}
                    >
                        <svg
                            className="w-12 h-12 text-gray-500"
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
                    </div>
                </div>
            </div>

        </div>
    )
}