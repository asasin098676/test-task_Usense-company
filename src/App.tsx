import { useEffect } from "react";
import "./App.css";
import { giphyApi } from "./api/giphy";

function App() {
  useEffect(() => {
    giphyApi
      .searchGifs({ q: "cat", limit: 3 })
      .then((res) => {
        console.log(res);
      })
      .catch(console.error);
  }, []);
  return <></>;
}

export default App;
