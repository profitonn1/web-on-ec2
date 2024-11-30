import { useEffect, useState } from "react";

export default function Dashbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    if (window.scrollY > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`fixed flex top-0 left-0 right-0 py-1 lg:py-2 pl-3 w-screen shadow z-50 ${
        isScrolled
          ? "bg-gradient-to-b from-zinc-950 to-transparent"
          : "bg-black"
      }`}
    >
      <div className="flex items-center justify-between lg:justify-start w-screen relative bg-#D6C0B3">
        <a
          href=""
          className="text-xl lg:text-3xl ml-8 font-ubuntu font-medium lg:font-semibold lg:px-5 opacity-80 text-white"
        >
          ProfitONN
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 mr-8 items-center">
        <div className="box">
          <div className="w-[30px] h-[16px] -mt-4">
            <div className="relative">
              <svg
                className="w-10 h-10 text-teal-600 animate-wiggle"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 21 21"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                />
              </svg>
              <div className="px-1 bg-teal-500 rounded-full text-center text-white text-sm absolute -top-2 -end-2">
                3
                <div class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-xl text-white opacity-85 font-medium w-40">
          Balance: <span>12000</span>
        </h1>

        <div className="mx-12">
          <div class="group flex h-12 w-14 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-slate-200">
            <div class="space-y-2">
              <span class="block h-1 w-10 origin-center rounded-full bg-slate-500 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
              <span class="block h-1 w-8 origin-center rounded-full bg-orange-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
