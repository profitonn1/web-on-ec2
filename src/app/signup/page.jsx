import Auth from "../components/Auth"
import React from 'react';
import Quote from "../components/Quote"

export default function Signup (){
    return <div>
        <div className="grid grid-col-1 lg:grid-cols-2">
            <div>
                <Auth />
            </div>
            <div className="hidden lg:block">
                <Quote slogan={`"Maximize Your Gains with Our Fun and Engaging Stock Trading Game!"`}/>
            </div>
            
        </div>
    </div>
}