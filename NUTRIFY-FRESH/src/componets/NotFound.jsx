import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="nf-container">
      <div className="nf-content">
        <h1>404</h1>
        <p>Oops! The page you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/registar")} className="nf-link">
          Go to Home
        </button>
      </div>
    </section>
  );
}
