import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {

  const navigate = useNavigate();

  const error = useRouteError();
  console.error(error);

  

  const clickLink= (path) => {
    navigate(`/${path}`);
  }

  return (
    <div id="error-page" style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100vw"}}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred. Try heading back home!</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <button onClick={() => {clickLink("")}}>Go Home</button>
    </div>
  );
}