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
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const minDeletePercent = 0.75;
  const maxDeletePercent = 0.99;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isDeleting) {
      interval = setInterval(() => {
        if (deleteTarget === null) {
          // Pick a new target index for this deletion cycle
          const newTarget = Math.floor(
            text.length * (minDeletePercent + Math.random() * (maxDeletePercent - minDeletePercent))
          );
          setDeleteTarget(newTarget);
          return; // wait for next tick
        }

        if (displayText.length > deleteTarget) {
          const removeCount = Math.floor(Math.random() * 3) + 1; // delete 1–3 chars per tick
          const newText = displayText.slice(
            0,
            Math.max(displayText.length - removeCount, deleteTarget)
          );
          setDisplayText(newText);
        } else {
          // Deletion finished
          setIsDeleting(false);
          setCanDelete(false);
          setDeleteTarget(null);
        }
      }, deleteSpeed);
    } else {
      interval = setInterval(() => {
        if (displayText.length < text.length) {
          setDisplayText(text.slice(0, displayText.length + 1));
        } else if (!canDelete) {
          setCanDelete(true);
        }
      }, speed);
    }

    return () => clearInterval(interval);
  }, [displayText, isDeleting, canDelete, text, speed, deleteSpeed, deleteTarget]);

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
    "Connecting students with fintech innovations through workshops, speakers, and partnerships with FinTech firms. Explore the future of finance and technology!";

  useEffect(() => {
    // Fetch upcoming events (replace API key and calendar ID)
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/YOUR_CALENDAR_ID/events?key=YOUR_API_KEY&timeMin=${new Date().toISOString()}&singleEvents=true&orderBy=startTime`
    )
      .then((res) => res.json())
      .then((data) => setEvents(data.items || []))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const partners = [
    { name: "Moov", logo: "/partners/moov.png", url: "https://moov.io/", scale: 1.3},
    { name: "Barings", logo: "/partners/barings.png", url: "https://www.barings.com", scale: 1.4},
    { name: "Wellington Management", logo: "/partners/wm.png", url: "https://www.wellington.com/en", scale: 2.6},
    { name: "QMA", logo: "/partners/qma.jpg", url: "https://www.pgim.com/it/en/borrower", scale : .9},
  ];
  const [menuOpen, setMenuOpen] = useState(false);


  return (
      <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-left">
            <h1 className="navbar-logo">FinTech@Brown</h1>
          </div>

          {/* Hamburger button */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`bar ${menuOpen ? "open" : ""}`}></span>
            <span className={`bar ${menuOpen ? "open" : ""}`}></span>
            <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          </button>

          {/* Navbar links */}
          <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#what-we-do" onClick={() => setMenuOpen(false)}>What We Do</a></li>
            <li><a href="#partners" onClick={() => setMenuOpen(false)}>Partners</a></li>
            <li><a href="#events" onClick={() => setMenuOpen(false)}>Events</a></li>
            <li><a href="#eboard" onClick={() => setMenuOpen(false)}>E-Board</a></li>
            <li><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
          </ul>
        </div>
      </nav>

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
        <h2 className="text-3xl font-semibold mb-4 font-orbitron text-cyan-400">What We Do</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          FinTech@Brown is a student organization dedicated to exploring the intersection of finance and technology. 
          We meet biweekly to learn from industry leaders, connect with peers, and gain hands-on experience in the fintech space. 
          From firm visits to speaker events, we aim to empower students to break into and shape the future of financial technology. 
          Interested? Just show up — everyone’s welcome!
        </p>
      </section>

      <hr className="section-separator my-12 border-gray-700" />
      {/* PARTNERS */}
      <section id="partners" className="section section-1 px-10 text-center">
        <h2 className="text-3xl font-semibold mb-6 font-orbitron text-cyan-400">Inudstry Partners</h2>
        <p className="text-gray-300 text-lg mb-10">
          We’re proud to collaborate with leaders in fintech and financial innovation.
        </p>
       <div className="partners-grid">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="partner-link"
            >
              <div
                className="partner-logo-wrapper"
                style={{ transform: `scale(${partner.scale ?? 1})` }}
              >
                <Image
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  width={400}
                  height={200}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxHeight: '6rem',
                    objectFit: 'contain',
                  }}
                  className="partner-logo"
                />
              </div>
            </a>
          ))}
        </div>


      </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* EVENTS */}
      <section id="events" className="section section-2">
          <h2 className="text-3xl font-semibold mb-6 font-orbitron text-cyan-400">Upcoming Events</h2>
          <div className="calendar-container">
            <iframe
              src="https://calendar.google.com/calendar/embed?src=c_6bb47d014cb7ae7388267f91b0d4c497579dfdc19264dc801371924ef0a80639%40group.calendar.google.com&ctz=America%2FNew_York"
              style={{
                border: 0,
                width: "80%",
                height: "600px",
                borderRadius: "20px",
              }}
              frameBorder="0"
              scrolling="no"
            ></iframe>
          </div>
        </section>

      <hr className="section-separator my-12 border-gray-700" />

      {/* EBOARD MEMBERS */}
      <section id="eboard" className="section section-3 px-10">
        <h2 className="text-3xl font-semibold mb-8 font-orbitron text-cyan-400">E-Board Members</h2>

         <div className="eboard-grid">
          {[
            { name: "Matias Bronner", role: "Treasurer", image: "/eboard/eboard1.jpg" },
            { name: "Farah Akbari", role: "Co-President", image: "/eboard/eboard2.jpg" },
            { name: "Daniel Shirazi", role: "Co-President", image: "/eboard/eboard3.jpg" },
            { name: "William Rosenberg", role: "Head of Curriculum", image: "/eboard/eboard4.jpg" },
            { name: "Elena Zhang", role: "Head of Communication", image: "/eboard/eboard5.jpg" },
            { name: "Sophia Chon", role: "Head of Social Events", image: "/eboard/eboard6.jpg" },
            { name: "Nikolas Nemergutg", role: "Head of Tech", image: "/eboard/eboard7.jpg" },
            { name: "Ahmad Milad Taib", role: "Co-Head of Outreach", image: "/eboard/eboard8.jpg" },
            { name: "Ryder Swenson", role: "Co-Head of Outreach  ", image: "/eboard/eboard9.jpg" },
            { name: "Vidula Mannem", role: "Co-Head of Education", image: "/eboard/eboard10.jpg" },
            { name: "Armaan Bhasin", role: "Co-Head of Education", image: "/eboard/eboard11.jpg" }

          ].map((member, idx) => (
            <div key={idx} className="eboard-card flex flex-col items-center text-center">
              <Image src={member.image} alt={member.name} width={200} height={200} className="eboard-image rounded-full mb-4" />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-300">{member.role}</p>
            </div>
          ))}
        </div>

      </section>

      <hr className="section-separator my-12 border-gray-700" />
    {/* CONTACT */}
    <section id="contact" className="section section-4 px-10 text-center">
      <h2 className="text-3xl font-semibold mb-4 font-orbitron text-cyan-400">
        Contact Us
      </h2>
      <p className="text-gray-300 mb-8 text-lg">
        Interested in joining or collaborating? Reach out through our form, and follow us on social media:
      </p>

      <div className="contact-bubbles flex flex-wrap justify-center gap-6">
        {/* Google Form */}
        <a
          href="https://docs.google.com/forms/d/1mFutP-T7ITfZpBku9AylUcfa91S2zhRA1iKA32hKK90"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-bubble"
        >
           <Image
            src="/form.png"  // <-- put an Instagram icon in public/icons/
            alt="Form"
            width={24}
            height={24}
          />
          <span className="text-xl font-semibold">Contact Form</span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/fintech.at.brown/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-bubble flex items-center gap-3"
        >
          <Image
            src="/instagram.png"  // <-- put an Instagram icon in public/icons/
            alt="Instagram"
            width={24}
            height={24}
          />
          <span className="text-xl font-semibold">@fintech.at.brown</span>
        </a>
      </div>
    </section>
    
    </main>
    </>
    
  );
}
