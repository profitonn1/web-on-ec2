"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { getCombinedData } from "../../fetchData/fetchuserdata";
import { useRouter } from "next/navigation";
import DashAppbar from "../../components/DashAppbar";
import { useLocation } from 'react-router-dom';

export default function Autopairing() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState('0');

  const [heading, setHeading] = useState("Finding Player");
  const [oppData, setOppData] = useState({
    oppname: "",
    winrate: "",
    ranking: "",
  });
  useEffect(() => {
    const params = window.location.search;
    const urlParams = new URLSearchParams(params);
    const paramAmount = urlParams.get('amount');
    setAmount(paramAmount);
  }, []); // This will set the amount once on mount
  

  // const [name, setName] = useState<any>(null);
  const [data, setData] = useState(null);
  // const [error, setError] = useState<string | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showHeading , setShowHeading] = useState("")
  const [currentQuote, setCurrentQuote] = useState(""); // State to store the current quote


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
    } else {
      console.log("No details found in cookies");
    }
  }, []); // Empty dependency array means this effect runs only once when the component mounts
  

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



  const getOpponentDetailsFromCookies = () => {
    const storedDetails = Cookies.get("opponentDetails");
    return storedDetails ? JSON.parse(storedDetails) : null;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let success = false;
      while (!success && amount !="0") {
        try {
          const userDetailsCookie = getCookieValue("userDetails");
          // Start the game by posting the amount
          if (userDetailsCookie) {
            const decodedUserDetails = decodeURIComponent(userDetailsCookie);
            const parsedUserDetails = JSON.parse(decodedUserDetails);
           
            const postresponse = await axios.post("/api/game/automaticpairing", {
              userId: parsedUserDetails.id,
              username: parsedUserDetails.username,
              amount: amount, // The amount selected
            });

            if (postresponse.status === 201) {
              success = true;

              // Get the response data (opponent details)
              // const opponentDetails = postresponse.data;

              // // Store opponent details in both cookies and state
              // const expiresIn30Minutes = new Date(
              //   new Date().getTime() + 30 * 60 * 1000
              // );

              // // Set the cookie with a 30-minute expiration time
              // Cookies.set("opponentDetails", JSON.stringify(opponentDetails), {
              //   expires: expiresIn30Minutes,
              // });
              // setOppData(opponentDetails); // Update the state with the details

              // // Optionally, start checking for an opponent if needed
              checkForOpponent();
            }
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            setShowHeading("Finding Player");
            // setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
            console.log("Opponent not found, retrying...");
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for 1 second before retrying
          } else {
            console.error("Unexpected error:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

 
  const checkForOpponent = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails");
      // Start the game by posting the amount
      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie);
        const parsedUserDetails = JSON.parse(decodedUserDetails);
        const oppResponse = await axios.get("/api/game/automaticpairing", {
          params: {
            userId: parsedUserDetails.id,
            username: parsedUserDetails.username,
            amount: amount,
          },
          withCredentials: true
        });     

        if(oppResponse.status===201){
          const expiresIn30Minutes = new Date(
            new Date().getTime() + 30 * 60 * 1000
          );
  
          const storeOpponentDetailsInCookies = (details) => {
            Cookies.set("opponentDetails", JSON.stringify(details), {
              expires: expiresIn30Minutes,
            }); // Store for 7 days
          };
          if (oppResponse.data) {
            storeOpponentDetailsInCookies(oppResponse.data);
            setShowHeading("Opponent Found");
            setIsSuccess(true);
            setShowAlert(true);
            setTimeout(() => {
              setShowAlert(false);
              // router.push('/payment');
            }, 1500);
  
            if (oppResponse.status === 404) {
              setAlertMessage("Finding Player");
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
                // router.push('/payment');
              }, 1500);
            }
  
            setHeading("Match Confirmed")
        }
        } else {
          // If no opponent found, keep checking after a delay
          setTimeout(checkForOpponent, 3000); // Retry after 3 seconds
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (amount === "0") {
          setAlertMessage("Please Select the Amount");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 1500);
        } else {
          setAlertMessage("Finding Player");
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 1500);
          // Keep checking for an opponent after a delay
          setTimeout(checkForOpponent, 3000); // Retry after 3 seconds
        }
      }
    }
  };

useEffect(()=>{

  // if(oppData.oppname ==="" && oppData.ranking==="" && oppData.winrate===""){
  //   handleSubmit();
  // }
  checkForOpponent();
},[amount])

  
  // const paymentButton = () => {
  //   const opponentData = Cookies.get("opponentDetails");
  //   console.log("opponentData:", opponentData); // To check the value in the console
  //   if (opponentData === undefined) {
  //     setAlertMessage("Please Select the Amount");
  //     setShowAlert(true);
  //     setTimeout(() => {
  //       setShowAlert(false);
  //     }, 1500);
  //   } else {
  //     setAlertMessage("Redirecting to payment page");
  //     setShowAlert(true);

  //     setTimeout(() => {
  //       setShowAlert(false);
  //       router.push("/payments");
  //     }, 1500);
  //   }
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedData = await getCombinedData();
        setData(combinedData);
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
        {loading && (
          <div className="flex justify-center items-center space-x-2">
            <div>{showHeading}</div>
            <div className="loader mt-20 "></div>
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
                Username :{oppData?.username}
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

        <div className="lg:flex lg:flex-col items-start p-4 ">
          {/* <div className="text-4xl p-2 w-full text-white font-medium mb-4">
            <div className="mb-4">
              <span className="">Game Options</span>
            </div>
          </div> */}

          {/* <div className="lg:flex lg:items-center  lg:space-x-72 text-center  ">
            <div className="flex items-center space-x-4 ">
              <form className="inline-block ">
                <select
                  name="Amount"
                  className="hover:bg-slate-700 cursor-pointer text-lg p-2 bg-zinc-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={setAmountFunction}
                >
                  <option value="" disabled selected>
                    Select amount
                  </option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
              </form>
              <button
                onClick={handleSubmit}
                className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center font-semibold justify-center rounded-lg h-8 lg:h-10 px-5 bg-indigo-700 text-[#FFFFFF] hover:bg-indigo-500 text-lg w-[240px] lg:w-full"
              >
                Submit
              </button>
            </div>
          </div> */}
        </div>
        {/* <div className="flex justify-center">
          <button className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center font-semibold justify-center rounded-lg h-8 lg:h-10 px-8 bg-indigo-700 text-[#FFFFFF] hover:bg-indigo-500 text-lg w-[240px] lg:w-[260px]">
            Cancel
          </button>
        </div> */}
        <div className="flex justify-center">
        <div className="text-center mt-12 text-4xl text-white font-bold opacity-60 w-[60vw]">
          <p>{getRandomQuote()}</p>
      </div>
        </div>
      </div>
    </div>
  );
}
