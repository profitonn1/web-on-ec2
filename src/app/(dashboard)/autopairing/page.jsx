"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getCombinedData } from "../../fetchData/fetchuserdata";
import { useRouter } from "next/navigation";
import DashAppbar from "../../components/DashAppbar";


export default function Autopairing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [heading, setHeading] = useState("Finding Player");
  const [oppData, setOppData] = useState({
    oppname: "",
    winrate: "",
    ranking: "",
    oppDemoBalance:0,
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramAmount = params.get('amount');
    setAmount(paramAmount);  // Sets the amount from the URL query
  }, [window.location.search]);
  

  // const [name, setName] = useState<any>(null);
  const [data, setData] = useState(null);
  // const [error, setError] = useState<string | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showHeading , setShowHeading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(""); // State to store the current quote


  const cryptoTradingQuotes = [
    "Bitcoin is a technological tour de force. – Bill Gates",
    "The future of money is digital currency. – Bill Gates",
    "The Bitcoin price is going to $100,000, but the real value is in the technology. – Anthony Pompliano",
    "The cryptocurrency market is volatile, but volatility equals opportunity.",
    "You don’t have to be an expert to start trading crypto, just stay disciplined and trust the process.",
    "In crypto, patience is key. The market rewards those who stay the course.",
    "Don’t follow the crowd in crypto; make your own decisions.",
    "In crypto, your biggest asset is your ability to remain calm in the storm.",
    "The future belongs to those who can adapt to the evolving digital economy.",
    "Crypto doesn’t sleep. Neither should your strategy.",
    "Opportunities in crypto come in waves. Don’t miss the next one.",
    "When it comes to crypto trading, it's not about timing the market, it’s about time in the market.",
    "Hold on through the volatility, success favors the patient.",
    "In crypto, risk management is the foundation of success.",
    "Success in crypto trading comes from sticking to your plan and managing your emotions.",
    "A successful trader knows when to hold, when to sell, and when to wait.",
    "Crypto is the future, but it’s not for the faint of heart.",
    "To win in crypto, learn to be comfortable with uncertainty.",
    "Buy when others are fearful, and sell when others are greedy.",
    "The true power of crypto is in its decentralization.",
    "In crypto, education is the key to making informed decisions.",
    "The best way to predict the future of crypto is to create it.",
    "Crypto trading is more mental than physical. Your mindset can determine your success.",
    "Focus on learning, not just profits. Crypto trading is a long game.",
    "In crypto, every setback is a lesson. Embrace it and keep going.",
    "Don’t put all your eggs in one basket. Diversify your crypto portfolio.",
    "The best traders in crypto are always learning and evolving.",
    "Crypto is like the Wild West – but that’s where the biggest opportunities lie.",
    "The blockchain is going to revolutionize the way we think about data and finance.",
    "The future of money is digital, and crypto is leading the way.",
    "Don’t fear volatility. Use it to your advantage.",
    "Never stop learning. Crypto markets are ever-changing.",
    "In crypto trading, risk is inevitable. Losses are optional.",
    "Keep your emotions in check, and let your strategy do the talking.",
    "Crypto trading isn’t about being lucky; it’s about being prepared.",
    "The early bird gets the block.",
    "When you invest in crypto, you’re not just buying coins; you’re buying into a revolution.",
    "If you’re not making mistakes in crypto, you’re not learning.",
    "Crypto can be daunting, but with patience, it’s incredibly rewarding.",
    "Crypto is a marathon, not a sprint. Stay focused on the long-term.",
    "The most successful traders are those who adapt to the market, not the ones who chase it.",
    "The crypto market is a jungle; the key to survival is knowledge and strategy.",
    "In crypto, your first rule should be: Protect your capital.",
    "When in doubt, research. Crypto is all about making informed decisions.",
    "You only lose when you sell at a loss.",
    "Crypto is not just a trend. It’s a movement towards financial freedom.",
    "Trading crypto is about understanding risk, not chasing rewards.",
    "Crypto traders are not afraid to take risks; they just manage them well.",
    "Don’t follow the hype; follow the fundamentals.",
    "Hodling is not about being passive; it’s about being patient and making smart moves.",
    "Crypto is about owning the future of money. Don’t let fear hold you back.",
    "Diversification is your friend in crypto, and discipline is your guide.",
    "Your biggest asset in crypto trading is your ability to learn and adapt quickly.",
    "The crypto space is filled with volatility, but that’s where the opportunities lie.",
    "Crypto is about revolutionizing the financial system. Get in, learn, and be a part of it.",
    "In crypto, your success is determined by how well you handle the unpredictable.",
    "Remember, in crypto: It's not about timing the market, but time in the market.",
    "Investing in crypto is a marathon; patience is your greatest ally.",
    "Your success in crypto depends on your ability to learn from your mistakes and keep moving forward.",
    "Risk and reward go hand in hand in the crypto world. Know your limits."
  ];
  

  // Function to get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * cryptoTradingQuotes.length);
    return cryptoTradingQuotes[randomIndex];
  };

  // useEffect to update the quote every 5 seconds
  useEffect(() => {
    // Set the initial quote
    setCurrentQuote(getRandomQuote());

    // Set up interval to change quote every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 5000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(quoteInterval);
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts


  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }
  useEffect(() => {
    const storedDetails = getOpponentDetailsFromCookies();
  
    if (storedDetails) {
      console.log("Setting state with details:", storedDetails); // Debugging line
      setOppData(storedDetails);
      setHeading("Match Confirmed");
      setShowHeading(true);
    } else {
      console.log("No details found in cookies");
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts
  

  const getOpponentDetailsFromCookies = () => {
    const storedDetails = Cookies.get("oppData");
    return storedDetails ? JSON.parse(storedDetails) : null;
  };



  const handleSubmit = async () => {
    console.log(oppData);
    setShowHeading(true);
    console.log(amount);
  
    try {
      const userDetailsCookie = getCookieValue("userDetails");
  
      if (!userDetailsCookie) {
        console.log("No user details found in cookies.");
        return;
      }
  
      const decodedUserDetails = decodeURIComponent(userDetailsCookie);
      const parsedUserDetails = JSON.parse(decodedUserDetails);
  
      let retry = true;
      while (retry && amount !== null && oppData.oppname === "") {
        try {
          // Make the API request
          const postresponse = await axios.post("/api/game/automaticpairing", {
            id: parsedUserDetails.id,
            username: parsedUserDetails.username,
            amount,
          });
  
          // Handle successful responses
          if (postresponse.status === 201 || postresponse.status === 200) {
            const { oppname, winrate, ranking } = postresponse.data;
  
            // Update state with the response
            setOppData({ oppname, winrate, ranking });
            setHeading("Match Confirmed");
            router.push('/terminal')
  
            // Store oppData in cookies with a 15-minute expiration
            Cookies.set(
              "oppData",
              JSON.stringify(postresponse.data),
              { expires: 15 / (24 * 60) } // 15 minutes
            );
  
            retry = false; // Stop retrying after success
          }
          // Handle 404 responses
          else if (postresponse.status === 404) {
            console.log("No opponent found, retrying...");
            setHeading("Finding Player");
            // Retry after 5 seconds
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
          // Handle unexpected responses
          else {
            console.log(`Unexpected response status: ${postresponse.status}`);
            retry = false;
          }
        } catch (error) {
          console.error("Error in API request:", error);
          // Ensure retries continue on network or unexpected errors
          if (error.response?.status === 404) {
            console.log("Retrying due to 404 error...");
            await new Promise((resolve) => setTimeout(resolve, 5000));
          } else {
            retry = false; // Stop retrying on other errors
          }
        }
      }
    } catch (e) {
      console.error("Error in finding opponent:", e);
    }
  };
  
  useEffect(() => {
    const handleRetry = async () => {
      if (!isRetrying) {
        setIsRetrying(true); // Set retry flag to true
        await handleSubmit(); // Call handleSubmit to start or retry
        setIsRetrying(false); // Reset retry flag after the function finishes
      }
    };
  
    // Trigger the retry logic when `amount` changes
    if (amount !== null) {
      handleRetry();
    }
    // Adding a cleanup to cancel retries if `amount` changes mid-retry
    return () => {
      setIsRetrying(false);
    };
  }, [amount]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedData = await getCombinedData();
        setData(combinedData);
        console.log(combinedData , "userdata")
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const { userDetails } = data;

  return (
    <div className="bg-black text-white md:p-14 lg:p-16 lg:h-screen h-full w-full ">
      <div className="fixed">
        {/* Alert */}
        {showAlert && (
          <div className="relative top-5  left-1/2  right-1/2 transform -translate-x-1/2 w-full max-w-lg">
            <div
              className="p-4 mb-4 text-xl bg-black text-green-200 rounded-lg border-2 border-slate-200 shadow-3xl "
              role="alert"
            >
              {alertMessage}
            </div>
          </div>
        )}
      </div>
        <DashAppbar/>
      <div>
        <div className="lg:text-9xl md:text-7xl font-sans text-5xl text-center font-semibold p-6 mt-12 lg:-mb-4">
        {showHeading && (
          <div className="flex justify-center items-center space-x-2">
            <div>{heading}</div>
            {heading ==="Finding Player"?<div className="loader mt-20 "></div>:""}
          </div>
        )}

        </div>
        <div className="flex gap-x-16 mt-12 items-center justify-center">
          <div className="flex items-center border-2 p-8 rounded-lg w-96">
            <span className="w-28 h-28 rounded-full bg-white mr-6"></span>
            <div>
              <span className="text-3xl text-[#FFEB00] font-medium">
                Player One
              </span>
              <br />
              <span className="text-lg text-white">
                Username : {userDetails?.username} 
              </span>
              <br />
              <span className="text-lg text-white">
                Winrate : {userDetails?.winrate}
              </span>
              <br />
              <span className="text-lg text-white">
                Ranking : {userDetails?.Ranking}
              </span>
              <br />
            </div>
          </div>
          <div className="text-4xl col-span-1 text-center"> VS </div>
          <div className="flex items-center border-2 p-8 rounded-lg w-96">
            <span className="w-28 h-28 rounded-full bg-white mr-6">
              
            </span>
            <div>
              <span className="text-3xl text-[#FF6600] font-medium">
                Player Two
              </span>
              <br />
              <span className="text-lg text-white">
                Username :{oppData?.oppname}
              </span>
              <br />
              <span className="text-lg text-white">
                Winrate :{oppData.winrate}
              </span>
              <br />
              <span className="text-lg text-white">
                Ranking:{oppData.ranking}
              </span>
              <br />
            </div>
          </div>
        </div>

      
        <div className="flex justify-center">
        <div className="text-center mt-12 text-4xl text-white font-bold opacity-60 w-[60vw]">
            <p>{getRandomQuote()}</p>
        </div>
        </div>
      </div>
    </div>
  );
}
