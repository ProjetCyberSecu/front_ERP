import React, {useRef, useState} from 'react'

const Sidebar = () => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const sidebarRef = useRef<HTMLElement>(null)

    const openSidebar = () => {
        if (sidebarRef.current) {
            sidebarRef.current.classList.toggle("hidden");
        }
    }

    return (
        <>
            <span
                className="absolute text-white text-4xl top-5 left-4 cursor-pointer bi bi-filter-left py-2 px-2 bg-gray-900 rounded-md"
                onClick={openSidebar}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                     className="bi bi-list" viewBox="0 0 16 16">
                    <path fillRule="evenodd"
                          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
            </span>

            <aside
                ref={sidebarRef}
                className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-gray-900"
            >
                <div className="text-gray-100 text-xl">
                    <div className="p-2.5 mt-1 flex items-center">
                        <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-blue-600"></i>
                        <h1 className="font-bold text-gray-200 text-[15px] ml-3">TailwindCSS</h1>
                        <button
                            className="bi bi-x cursor-pointer ml-28 lg:hidden"
                            onClick={openSidebar}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-x" viewBox="0 0 16 16">
                                <path
                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </button>
                    </div>
                    <div className="my-2 bg-gray-600 h-[1px]"></div>
                </div>
                <div
                    className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-gray-700 text-white"
                >
                    <i className="bi bi-search text-sm"></i>
                    <input
                        type="text"
                        placeholder="Search"
                        className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
                    />
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <i className="bi bi-house-door-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Home</span>
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <i className="bi bi-bookmark-fill"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Bookmark</span>
                </div>
                <div className="my-4 bg-gray-600 h-[1px]"></div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                    // onClick="dropdown()"
                >
                    <i className="bi bi-chat-left-text-fill"></i>
                    <div className="flex justify-between w-full items-center">
                        <span className="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
                        <span className="text-sm rotate-180" id="arrow">
            <i className="bi bi-chevron-down"></i>
          </span>
                    </div>
                </div>
                <div
                    className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold"
                    id="submenu"
                >
                    <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                        Social
                    </h1>
                    <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                        Personal
                    </h1>
                    <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                        Friends
                    </h1>
                </div>
                <div
                    className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                >
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                </div>
            </aside>
        </>
    )
}

export default Sidebar