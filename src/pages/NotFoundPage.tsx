import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <h1 className="page-title">Not found</h1>
      <p className="muted">The page you were looking for does not exist.</p>
      <Link to="/" className="subtle">
        Return home
      </Link>
    </div>
  );
};

export default NotFoundPage;
