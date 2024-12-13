"use client";
import Appbar from "../components/Appbar";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function About() {
  const router = useRouter();
  
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Appbar />

      {/* Hero Section with Tagline */}
      <section className="text-center pt-40 pb-12 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Compete. Trade. Win. – Where Crypto Skills Meet Their Match.
        </h1>
        <p className="text-lg max-w-4xl mx-auto text-opacity-80">
          Welcome to <span className="font-semibold text-yellow-400">ProfitONN</span>, the premier destination for crypto traders looking to engage in exciting head-to-head trading competitions. Whether you’re a seasoned trader or a newcomer, we offer a unique platform where you can challenge others, test your strategies, and make the most of your crypto knowledge.
        </p>
      </section>

      {/* What We Offer Section */}
      <section className="pb-2 bg-gradient-to-t">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              { title: "Competitive Trading", description: "Battle against real-time players in a secure and fast-paced environment." },
              { title: "Advanced Matching Algorithm", description: "Our proprietary algorithm ensures you’re paired with an opponent of similar trading acumen, so every competition is fair and engaging." },
              { title: "Crypto Trading Tools", description: "Access to advanced charts, real-time market data, and a variety of trading pairs to help you make informed decisions." },
              { title: "Fixed Amount to Compete", description: "Both players start with the same fixed amount to compete, ensuring fairness and a level playing field." },
              { title: "Secure and Transparent", description: "Trade with confidence, knowing your funds and personal data are protected with cutting-edge security protocols." },
            ].map((item, index) => (
              <div key={index} className="bg-zinc-950 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out">
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-sm text-opacity-80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="pt-16 px-6 bg-gradient-to-t">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-white mb-8">How It Works</h2>
          <p className="text-lg max-w-4xl mx-auto mb-6 text-opacity-80">
            At <span className="font-semibold text-yellow-400">ProfitONN</span>, two players compete against each other in simulated or real-time crypto trading contests. Both players are given the same fixed amount to trade, ensuring that the competition is fair and based on skill, not the size of the portfolio. Our algorithm matches you with an opponent who has a similar level of trading expertise, making each contest balanced and engaging.
          </p>
          <p className="text-lg max-w-4xl mx-auto text-opacity-80">
            The goal is to outperform your opponent by making the best trades within a set period. The player with the highest profit at the end wins the match. The competition is all about strategy, skill, and real-time decision-making.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-center pt-20 pb-12">
        <h2 className="text-4xl font-extrabold text-white mb-6">Are you ready to face off against the best?</h2>
        <p className="text-xl text-white mb-8 text-opacity-80">
          Join us today and start trading!
        </p>
        <button
        onClick={() => {
          router.push("/signup");
        }}
        className="bg-yellow-400 text-black px-8 py-2 rounded-full text-lg font-semibold transition-all duration-300 ease-in-out transform hover:bg-yellow-600 hover:scale-105 hover:text-white shadow-xl">
          Get Started
        </button>
      </section>
      <Footer/>
    </div>
  );
}
