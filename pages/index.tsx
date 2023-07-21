import type { NextPage } from "next";
import Head from "next/head";
import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { Toaster } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";


const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [duration, setDuration] = useState(10);
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [audioURL, setAudioURL] = useState<string>("");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 2 ${vibe} twitter biographies with no hashtags and clearly labeled "1." and "2.". ${
    vibe === "Pretentious"
      ? "Make sure there is a joke in there and it's a little ridiculous."
      : null
  }
      Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;
  
    // If audioUrl changes, this will re-run
    useEffect(() => {
      if (audioURL) {
        setAudioURL(audioURL);
      }
    }, [audioURL]); // This effect runs when audioUrl changes


  const generatePodcast = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    
    
    // Assume postData contains the information you want to send to the server
    const postData = {
      "topic": bio,
      "duration": duration,
      "tone": vibe
  };

  try {
    const response = await axios.post('https://podcast-be-production.up.railway.app/generate', postData);
    setAudioURL(response.data.url);
  } catch (error) {
    console.error("Error fetching audio URL:", error);
  }

  scrollToBios();
  setLoading(false);
  };

  

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AI Podcast Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate podcasts with AI
        </h1>
        <p className="text-slate-500 mt-5">51,204 podcasts generated so far.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium"> 1. Enter a podcast topic</p>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Best hikes in the bay area"
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <p className="text-left font-medium">2. Select your vibe</p>
          </div>
          <div className="block mb-10">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          <div className="flex items-center space-x-3">
            <p className="text-left font-medium">3. Duration (min)</p>
          </div>
          <input
            value={duration}
            type='number'
            max={15}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "10"
            }
          />


          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generatePodcast(e)}
            >
              Generate your podcast &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {audioURL && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={bioRef}
                >
                  Your generated podcast
                </h2>
              </div>
              <audio controls src={audioURL}>Your browser does not support the audio element.</audio>;
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {generatedBios}
                {/* {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split("2.")
                  .map((generatedBio) => {
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={generatedBio}
                      >
                        <p>{generatedBio}</p>
                      </div>
                    );
                  })} */}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
