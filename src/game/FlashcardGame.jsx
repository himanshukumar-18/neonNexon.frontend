import React, { useEffect, useState } from "react";
import axios from "axios";
import { GlobalLoader } from "../index.js";

export default function FlashcardGame({ useOffline = false }) {
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // Offline fallback: 50+ STEM flashcards
  const LOCAL_CARDS = [
    { front: "Atom", back: "Smallest unit of matter." },
    { front: "Photosynthesis", back: "Plants convert light to energy." },
    { front: "Velocity", back: "Speed with direction." },
    { front: "Gravity", back: "Force that attracts objects toward each other." },
    { front: "Mitosis", back: "Cell division that produces two identical cells." },
    { front: "Electron", back: "Negatively charged subatomic particle." },
    { front: "Osmosis", back: "Movement of water across a semipermeable membrane." },
    { front: "Energy", back: "The capacity to do work." },
    { front: "Force", back: "A push or pull acting on an object." },
    { front: "Magnetism", back: "Force of attraction or repulsion due to magnetic fields." },
    { front: "Proton", back: "Positively charged particle in the nucleus." },
    { front: "Neutron", back: "Neutral particle in the nucleus of an atom." },
    { front: "Condensation", back: "Gas changing into liquid." },
    { front: "Evaporation", back: "Liquid turning into gas." },
    { front: "Respiration", back: "Process of breathing and producing energy." },
    { front: "Diffusion", back: "Movement of particles from high to low concentration." },
    { front: "DNA", back: "Molecule carrying genetic information." },
    { front: "RNA", back: "Molecule that helps in protein synthesis." },
    { front: "Molecule", back: "Two or more atoms bonded together." },
    { front: "Compound", back: "Substance formed from two or more elements." },
    { front: "Solar System", back: "The Sun and all objects orbiting it." },
    { front: "Planet", back: "Celestial body orbiting a star." },
    { front: "Star", back: "Mass of hot gas emitting light and heat." },
    { front: "Galaxy", back: "Large system of stars, dust, and gas." },
    { front: "Atom Number", back: "Number of protons in an atom." },
    { front: "Chemical Reaction", back: "Process where substances change into new substances." },
    { front: "Acid", back: "Substance with pH less than 7." },
    { front: "Base", back: "Substance with pH greater than 7." },
    { front: "Neutralization", back: "Reaction between an acid and a base." },
    { front: "Kinetic Energy", back: "Energy of motion." },
    { front: "Potential Energy", back: "Stored energy." },
    { front: "Force of Friction", back: "Force opposing motion between surfaces." },
    { front: "Newton's First Law", back: "Object in motion stays in motion unless acted on." },
    { front: "Newton's Second Law", back: "Force equals mass times acceleration (F=ma)." },
    { front: "Newton's Third Law", back: "Every action has an equal and opposite reaction." },
    { front: "Circuit", back: "Closed path for electric current." },
    { front: "Voltage", back: "Electrical potential difference." },
    { front: "Current", back: "Flow of electric charge." },
    { front: "Resistance", back: "Opposition to the flow of current." },
    { front: "Magnet", back: "Object producing magnetic field." },
    { front: "Insulator", back: "Material that does not conduct electricity well." },
    { front: "Conductor", back: "Material that allows electricity to flow easily." },
    { front: "Reflection", back: "Bouncing back of light from a surface." },
    { front: "Refraction", back: "Bending of light passing from one medium to another." },
    { front: "Diffraction", back: "Spreading of waves around obstacles." },
    { front: "Wave", back: "Disturbance that transfers energy." },
    { front: "Amplitude", back: "Maximum displacement of a wave." },
    { front: "Frequency", back: "Number of waves per second." },
    { front: "Period", back: "Time taken for one complete wave cycle." },
    { front: "Electron Orbitals", back: "Regions around nucleus where electrons likely exist." },
    { front: "Periodic Table", back: "Chart of chemical elements." },
    { front: "Element", back: "Substance made of only one type of atom." },
    { front: "Ion", back: "Atom with positive or negative charge." },
  ];

  useEffect(() => {
    const fetchCards = async () => {
      if (useOffline) {
        setCards(LOCAL_CARDS);
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(
          "https://opentdb.com/api.php?amount=10&category=17&type=multiple"
        );
        const apiCards = res.data.results.map((item) => ({
          front: decodeHTML(item.question),
          back: decodeHTML(item.correct_answer),
        }));
        setCards(apiCards);
      } catch (err) {
        console.error("API fetch failed, using offline cards.", err);
        setCards(LOCAL_CARDS);
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, [useOffline]);

  const next = () => {
    setFlipped(false);
    setCurrent((i) => (i + 1) % cards.length);
  };
  const prev = () => {
    setFlipped(false);
    setCurrent((i) => (i - 1 + cards.length) % cards.length);
  };

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  if (loading) {
    return (
      <GlobalLoader />
    );
  }

  const card = cards[current];

  return (
    <div className="w-full pt-50 flex flex-col items-center p-4 pb-20 bg-gradient-to-br from-[#0f1530] to-[#1a1330] min-h-screen">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#e7d0ff] mb-2 text-center">
        Flashcards 🎮
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-[#bfc0e8] mb-6 text-center">
        Tap the card to flip • Use buttons to navigate
      </p>

      <div
        className="relative w-full max-w-3xl aspect-[16/9] cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className={`absolute inset-0 transition-transform duration-500`}
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-pink-500 bg-gradient-to-br from-purple-800 to-pink-700 p-6 shadow-2xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-center text-white text-lg sm:text-xl md:text-2xl leading-snug">
              {card.front}
            </p>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-2xl border border-pink-500 bg-gradient-to-br from-pink-700 to-purple-800 p-6 shadow-2xl"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <p className="text-center text-white text-lg sm:text-xl md:text-2xl leading-snug">
              {card.back}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          onClick={prev}
          className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
        >
          Previous
        </button>
        <button
          onClick={next}
          className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}