import React from "react";
import { Link } from "react-router-dom";

const FriendsCard = ({ friends }) => {
    return (
        <div>
            <div className=" bg-transparent shadow-sm mx-6 pt-5 border-b border-[#66666645]">
                <div className=" flex items-center justify-between pb-2 ">
                    <div className="flex flex-col justify-center">
                        <p className="text-lg font-medium text-ascent-1">
                            Sảnh UTC2
                        </p>
                    </div>
                </div>
                <div className=" flex flex-col gap-2 pt-4 pb-6">
                    <Link
                        to="/"
                        className=" flex gap-4 items-center pb-4 cursor-pointer"
                    >
                        Thông báo
                    </Link>

                    <Link
                        to="/tin-tuc-su-kien"
                        className=" flex gap-4 items-center cursor-pointer"
                    >
                        Tin tức - Sự kiện
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FriendsCard;
