import { useNavigate } from "react-router-dom";

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="text-center px-12 py-20 border-t border-white/10">
      <h2 className="text-4xl font-medium text-white mb-3 tracking-tight">
        Stop guessing. Start fixing.
      </h2>

      <p className="text-white/40 text-sm mb-8">
        Free to try. No account needed for your first analysis.
      </p>

      <button
        onClick={() => navigate("/signup")}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-9 py-3.5 rounded-lg text-base transition"
      >
        Analyze my profile now
      </button>
    </section>
  );
}

export default CTA;