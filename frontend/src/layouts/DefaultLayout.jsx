import React from "react";

const DefaultLayout = ({ children }) => {
    return (
        <div className="w-full px-0 pb-20 bg-gray-100 lg:rounded-lg h-screen overflow-hidden">
            <Header />
            <div className="w-screen mt-24 flex justify-center gap-2 lg:gap-4 pt-3 h-full">
                <div className="hidden w-1/6 h-full md:flex flex-col gap-6 overflow-y-auto bg-white">
                    <Sidebar />
                    <FiltersCard />
                </div>
                {children}
            </div>
        </div>
    );
};

export default DefaultLayout;
