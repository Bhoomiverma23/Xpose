import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="text-center px-12 py-20">
      <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1 text-xs text-indigo-300 mb-7">
        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
        AI-powered career gap analyzer
      </div>

      <h1 className="text-5xl font-extrabold text-white leading-tight max-w-2xl mx-auto mb-5 tracking-tight">
        Know why you're getting{" "}
        <em className="text-indigo-400 not-italic">rejected</em>{" "}
        before they do
      </h1>

      <p className="text-white/40 text-base max-w-md mx-auto mb-9 leading-relaxed">
        Stop sending resumes into the void. Find out exactly what's costing you
        the role.
      </p>

      <div className="flex gap-3 justify-center mb-14">
  <button
    onClick={() => navigate("/signup")}
    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm transition">
    Analyze my profile
  </button>

  <button
    onClick={() =>
      document.getElementById("how-it-works")?.scrollIntoView({
        behavior: "smooth",
      })
    }
    className="border border-white/20 text-white px-7 py-3 rounded-lg text-sm hover:bg-white/5 transition"
  >
    See how it works
  </button>
</div>
    </section>
  );
}

export default Hero;