

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-white">
            <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
                <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
                    <div className="sm:max-w-lg">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Supporting Lives with Dignity
                        </h1>
                        <p className="mt-4 text-xl text-gray-500">
                            Offering interest-free loans to support education, businesses, and families with care and dignity
                        </p>
                    </div>
                    <div>
                        <div className="mt-10">
                            {/* Decorative image grid */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
                            >
                                <div className="absolute transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                        <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/3861959/pexels-photo-3861959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/25437427/pexels-photo-25437427/free-photo-of-computer-monitor-displaying-lines-of-code.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/6424589/pexels-photo-6424589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/6424587/pexels-photo-6424587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/7988090/pexels-photo-7988090.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/12899188/pexels-photo-12899188.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                            <div className="h-64 w-44 overflow-hidden rounded-lg">
                                                <img
                                                    alt=""
                                                    src="https://images.pexels.com/photos/12899162/pexels-photo-12899162.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                                                    className="size-full object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="#"
                                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
                            >
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero

