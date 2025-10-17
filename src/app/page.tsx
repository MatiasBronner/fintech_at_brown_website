'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

/* ============================= */
/*     CONTROLLED TYPEWRITER     */
/* ============================= */
interface AnimatedTextProps {
  text: string;
  speed?: number;       // typing speed
  deleteSpeed?: number; // deletion speed
  pause?: number;       // pause before deletion
}

const AnimatedText = ({
  text,
  speed = 50,
  deleteSpeed = 50,
  pause = 5000,
}: AnimatedTextProps) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [canDelete, setCanDelete] = useState(true);

  const minDeletePercent = 0.15; // 15%
  const maxDeletePercent = 0.75; // 75%
  const deleteStartIndex = Math.floor(text.length * (minDeletePercent + Math.random() * (maxDeletePercent - minDeletePercent)));
  useEffect(() => {
    let interval: NodeJS.Timeout;
if (isDeleting) {
  interval = setInterval(() => {
    let currentText = displayText;
    if (currentText.length > deleteStartIndex) {
      const removeCount = Math.floor(Math.random() * 3) + 1;
      const newText = currentText.slice(0, Math.max(currentText.length - removeCount, deleteStartIndex));
      setDisplayText(newText);
    } else {
      setIsDeleting(false);
      setCanDelete(false);
    }
  }, deleteSpeed);

    } else {
      // Typing until full text
      interval = setInterval(() => {
        if (displayText.length < text.length) {
          setDisplayText(text.slice(0, displayText.length + 1));
        } else if (!canDelete) {
          // Fully typed, allow next deletion
          setCanDelete(true);
        }
      }, speed);
    }

    return () => clearInterval(interval);
  }, [displayText, isDeleting, canDelete, text, speed, deleteSpeed]);

  // Trigger deletion only if allowed
  useEffect(() => {
    const timeout = setInterval(() => {
      if (canDelete && !isDeleting) {
        setIsDeleting(true);
      }
    }, pause);
    return () => clearInterval(timeout);
  }, [canDelete, isDeleting, pause]);

  return <span>{displayText}</span>;
};

/* ============================= */
/*          MAIN PAGE            */
/* ============================= */
interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  htmlLink: string;
}

export default function FintechPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const fullBlurb =
    "Connecting students with fintech innovations through workshops, speaker series, and hackathons. Explore the future of finance and technology!";

  useEffect(() => {
    // Fetch upcoming events (replace API key and calendar ID)
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/YOUR_CALENDAR_ID/events?key=YOUR_API_KEY&timeMin=${new Date().toISOString()}&singleEvents=true&orderBy=startTime`
    )
      .then((res) => res.json())
      .then((data) => setEvents(data.items || []))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <main className="fintech-page">

      {/* HEADER */}
      <section id="home" className="header-section flex">
        <div className="header-image flex-1 flex justify-center items-center">
          <Image
            src="/fintech_logo.png"
            alt="Fintech@Brown Logo"
            width={300}
            height={300}
            className="club-image rounded-full shadow-[0_0_40px_5px_rgba(0,255,255,0.6)]"
          />
        </div>
        <div className="header-text flex-1 flex flex-col justify-center px-8">
          <h1 className="club-name text-6xl font-bold text-white mb-4">
            Fintech@Brown
          </h1>
          <p className="club-blurb text-gray-300 text-xl">
            <AnimatedText text={fullBlurb} speed={40} deleteSpeed={60} pause={5000} />
            <span className="cursor">|</span>
          </p>
        </div>
      </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* WHAT WE DO */}
      <section id="what-we-do" className="section section-1 px-10">
        <h2 className="text-3xl font-semibold mb-4">What We Do</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          Fintech@Brown connects students with finance and tech innovations, hosts workshops, speaker series, and hackathons to prepare students for careers in fintech. We aim to build a vibrant community at the intersection of finance and technology.
        </p>
      </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* EVENTS */}
      <section id="events" className="section section-2 px-10">
        <h2 className="text-3xl font-semibold mb-4">Upcoming Events</h2>
        {events.length > 0 ? (
          <ul className="event-list list-disc list-inside text-gray-300">
            {events.map((evt) => (
              <li key={evt.id} className="mb-2">
                <a href={evt.htmlLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  {evt.summary} - {evt.start.dateTime ? new Date(evt.start.dateTime).toLocaleString() : evt.start.date}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Loading upcoming events...</p>
        )}
      </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* EBOARD MEMBERS */}
      <section id="eboard" className="section section-3 px-10">
        <h2 className="text-3xl font-semibold mb-8">E-Board Members</h2>
        <div className="eboard-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { name: "Matias Bronner", role: "Treasurer", image: "/eboard1.jpg" },
            { name: "Jane Doe", role: "President", image: "/eboard2.jpg" },
            { name: "John Smith", role: "VP Events", image: "/eboard3.jpg" },
            { name: "Alice Lee", role: "VP Tech", image: "/eboard4.jpg" },
          ].map((member, idx) => (
            <div key={idx} className="eboard-card flex flex-col items-center text-center">
              <Image src={member.image} alt={member.name} width={150} height={150} className="eboard-image rounded-full mb-4" />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* CONTACT */}
      <section id="contact" className="section section-4 px-10">
        <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-300 mb-2">Interested in joining or collaborating? Reach out via email:</p>
        <a href="mailto:fintech@brown.edu" className="contact-link text-blue-400 hover:text-blue-300">
          fintech@brown.edu
        </a>
      </section>

    </main>
  );
}
