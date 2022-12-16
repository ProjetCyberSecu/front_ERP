import React from "react";
import {FC, Fragment, useContext} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import {
    HomeIcon,
    XMarkIcon,
    PuzzlePieceIcon,
    CubeIcon,
    ForwardIcon
} from '@heroicons/react/24/outline'
import {Link, useLocation, useNavigate} from "react-router-dom";
import {AuthContext} from "../../App";
import {logout} from "../../services/auth.service";

type NavigationLink = {
    name: string,
    href: string,
    icon: (props: React.ComponentProps<'svg'> & { title?: string, titleId?: string }) => JSX.Element,
}

const navigation: NavigationLink[] = [
    {
        name: 'Dashboard',
        href: '/',
        icon: HomeIcon,
    },
    {
        name: 'Frisbees',
        href: '/frisbees',
        icon: CubeIcon,
    },
    {
        name: 'Ingredients',
        href: '/ingredients',
        icon: PuzzlePieceIcon
    },
    {
        name: 'Processes',
        href: '/processes',
        icon: ForwardIcon
    }
]

const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ')
}

type Props = {
    sidebarOpen: boolean
    setSidebar: (state: boolean) => void
}

const Example: FC<Props> = ({sidebarOpen, setSidebar}) => {
    const location = useLocation()
    const authContext = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout(navigate, authContext)
    }

    return (
        <aside>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebar}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75"/>
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                                            <button
                                                type="button"
                                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                                onClick={() => setSidebar(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true"/>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                                        <div className="flex flex-shrink-0 items-center px-4">
                                            <img
                                                className="h-8 w-auto"
                                                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                                alt="Your Company"
                                            />
                                        </div>
                                        <nav className="mt-5 space-y-1 px-2">
                                            {navigation.map((item) =>
                                                <Link
                                                    key={item.name}
                                                    to={item.href}
                                                    className={classNames(
                                                        item.href === location.pathname
                                                            ? 'bg-gray-900 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            item.href === location.pathname ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                                            'mr-4 flex-shrink-0 h-6 w-6'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            )
                                            }
                                        </nav>
                                    </div>
                                    <div className="flex flex-shrink-0 bg-gray-700 p-4">
                                        <a href="#" className="group block w-full flex-shrink-0">
                                            <div className="flex items-center">
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-white">{authContext.user?.firstname} {authContext.user?.lastname}</p>
                                                    <button onClick={handleLogout} className="text-s font-medium text-gray-300 group-hover:text-gray-200">Se deconnecter</button>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                            <div className="w-14 flex-shrink-0">{/* Force sidebar to shrink to fit close icon */}</div>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex min-h-0 flex-1 flex-col bg-gray-800">
                        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                            <div className="flex flex-shrink-0 items-center px-4">
                                <img
                                    className="h-8 w-auto"
                                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                    alt="Your Company"
                                />
                            </div>
                            <nav className="mt-5 flex-1 space-y-1 px-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.href === location.pathname ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                        )}
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.href === location.pathname ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                                'mr-3 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex flex-shrink-0 bg-gray-700 p-4">
                            <a href="#" className="group block w-full flex-shrink-0">
                                <div className="flex items-center">
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">{authContext.user?.firstname} {authContext.user?.lastname}</p>
                                        <button onClick={handleLogout} className="text-s font-medium text-gray-300 group-hover:text-gray-200">Se deconnecter</button>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Example
