"use client"

export default function Quote({slogan}){
    return <div className="bg-slate-200 text-slate-900 h-screen flex justify-center flex-col">
        <div className=" flex justify-center ">
            <div className="text-center text-2xl font-bold ">
                {slogan}
            </div>
        </div>
        <div className="max-w-md text-left text-base font-semibold ml-12  mt-4">
            
        </div>
        <div className="max-w-md text-base font-light text-slate-900 ml-12">
            
        </div>
    </div>
}