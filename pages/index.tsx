import type { NextPage } from "next";
import Head from "next/head";
import React, { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { Toaster } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import AudioPlayer from '../components/AudioPlayer';
import { useSession, signIn, signOut } from 'next-auth/react';

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [duration, setDuration] = useState(1);
  const [vibe, setVibe] = useState<VibeType>("Full Podcast");
  const [audioURL, setAudioURL] = useState<string>("");
  const [transistorURL, setTransistorURL] = useState<string>("");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    if (audioURL) {
      setAudioURL(audioURL);
    }
  }, [audioURL]);

  useEffect(() => {
    if (transistorURL) {
      setTransistorURL(transistorURL);
    }
  }, [transistorURL]);

  const generatePodcast = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    
    const postData = {
      "topic": bio,
      "duration": duration,
      "tone": vibe
    };

    try {
      const localhost = "http://localhost:5001/generate"
      const remote = "https://yourpodcast-production.up.railway.app/generate"
      const generationUrl = remote;

      const response = await axios.post(generationUrl, postData);
      if (response.data.url) {
        setAudioURL(response.data.url);
      }
      if (response.data.share_url) {
        setTransistorURL(response.data.share_url);
      }
      
    } catch (error) {
      console.error("Error fetching audio URL:", error);
    }

    scrollToBios();
    setLoading(false);
  };

  const { data, status } = useSession();
  if (status === 'authenticated' || true) {
    console.log(transistorURL);
    console.log('transistorURL');
    // let str = '<iframe width="100%" height="180" frameborder="no" scrolling="no" seamless src="https://share.transistor.fm/e/254962c7"></iframe>';
    let str = transistorURL;
    let url = "";
    let start = str.indexOf('src="');
    if(start !== -1) {
      start += 5; // skip 'src="'
      let end = str.indexOf('"', start);
      if(end !== -1) {
        url = str.substring(start, end);
        console.log(url); // https://share.transistor.fm/e/254962c7
      }
      else {
        console.log("No end quote found for src");
      }
    }
    else {
      console.log("No src attribute found");
    }
    return (
      <div className="bg-gradient-to-r from-white-700 via-white-800 to-white-900 min-h-screen flex flex-col items-center justify-center py-2">
        <Head>
          <title>AI Podcast Generator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center text-center mt-12 sm:mt-20">
          {/* <img src={data?.user?.image || ''} alt="User Image" className="w-20 h-20 rounded-full mb-4" /> */}
          {/* <button onClick={() => signOut()} className="text-black text-sm underline">Sign Out</button> */}
          <h1 className="text-5xl font-bold text-black mt-6">
            Generate Podcasts with AI
          </h1>
          <p className="text-black mt-2">51 podcasts generated so far.</p>
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full mt-10 p-8">
            <div className="flex items-center space-x-3">
              <p className="text-left font-medium">1. Enter a podcast topic</p>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black mt-2 p-3"
              placeholder="e.g. Best hikes in the bay area"
            />
            <div className="flex items-center space-x-3 mt-4">
              <p className="text-left font-medium">2. Select your vibe</p>
            </div>
            <div className="block mt-2">
              <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <p className="text-left font-medium">3. Duration (min 10 mins, max 30 mins)</p>
            </div>
            <input
              value={duration}
              type='number'
              max={30}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-black mt-2 p-3"
              placeholder="10"
            />
            {!loading ? (
              <button
                className="bg-black rounded-lg text-white font-medium px-4 py-2 mt-8 w-full hover:bg-black/80"
                onClick={(e) => generatePodcast(e)}
              >
                Generate your podcast &rarr;
              </button>
            ) : (
              <button
                className="bg-black rounded-lg text-white font-medium px-4 py-2 mt-8 w-full cursor-not-allowed opacity-50"
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
          <hr className="w-16 h-px bg-white border-1 mt-10" />
          <div className="space-y-10 mt-10">
            {transistorURL && (
              <>
                <div>
                  <h2
                    className="text-4xl font-bold text-black mx-auto"
                    ref={bioRef}
                  >
                    Your Generated Podcast
                  </h2>
                </div>
                {/* <iframe src={transistorURL} width="100%" height="180" frameBorder="0" scrolling="no"></iframe> */}
                <iframe width="100%" height="180" frameBorder="no" scrolling="no" seamless src={url}></iframe>
                
                {/* <iframe width="100%" height="180" frameBorder="no" scrolling="no" seamless src={}></iframe> */}
                {/* <iframe width="100%" height="180" frameBorder="no" scrolling="no" seamless src="https://share.transistor.fm/e/7477f7a6"></iframe> */}
                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto mt-4">
                  {generatedBios}
                </div>
              </>
            )
            }
            {audioURL && (
              <>
                <div>
                  <h2
                    className="text-4xl font-bold text-black mx-auto"
                    ref={bioRef}
                  >
                    Your Generated Podcast
                  </h2>
                </div>
                <audio controls src={audioURL} className="mt-4"></audio>

                <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto mt-4">
                  {generatedBios}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center justify-center max-w-xl mx-auto mt-4">
              Check out the most recently generated podcast below!
              <iframe 
                  style={{borderRadius: '12px'}} 
                  src="https://open.spotify.com/embed/show/6LiNaGTDMiUJqxh9e8p5Z5?utm_source=generator&theme=0" 
                  width="100%" 
                  height="152" 
                  frameBorder="0" 
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy">
              </iframe>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
console.log(transistorURL);
  return (
    <div className="bg-gradient-to-r from-white-700 via-white-800 to-white-900 min-h-screen flex flex-col items-center justify-center py-2">
      <Head>
        <title>AI Podcast Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 flex-col items-center justify-center text-center mt-12 sm:mt-20">
        <h1 className="text-5xl font-bold text-black mt-6">
          Welcome to AI Podcast Generator
        </h1>
        {/* <button onClick={() => signIn('google')} className="bg-black rounded-lg text-white font-medium px-4 py-2 mt-8 w-full hover:bg-black/80">
          Sign in with Google
        </button> */}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
