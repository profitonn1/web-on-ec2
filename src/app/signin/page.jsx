import React, { Suspense } from "react";
import Quote from "../components/Quote";
import SigninAuth from "../components/SigninAuth";

export default function Signup() {
  return (
    <div>
      <div className="grid grid-col-1 lg:grid-cols-2">
        <div>
          <Suspense fallback={<div>Loading...</div>}>
            <SigninAuth />
          </Suspense>
        </div>
        <div className="hidden lg:block">
          <Quote slogan={`"Say Goodbye to Losses—Boost Your Profits with Our Gamified Stock Trading"`} />
        </div>
      </div>
    </div>
  );
}
