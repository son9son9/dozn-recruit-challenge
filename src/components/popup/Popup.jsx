import { useState } from "react";
import styles from "./Popup.module.scss";

// JSON string formatter
function formatJson(jsonString) {
  return jsonString.replace(/{/g, "{\n").replace(/}/g, "\n}").replace(/,/g, ",\n").replace(/:/g, ": ");
}

const Popup = () => {
  const [scrapingData] = useState(localStorage.getItem("dozn-scraping-data"));

  if (!scrapingData) {
    return (
      <div className={`${styles.container} render-animation`}>
        <div className="loader" />
      </div>
    );
  } else {
    return (
      <div className={`${styles.container} render-animation`}>
        <pre className={styles.content}>{formatJson(scrapingData)}</pre>
      </div>
    );
  }
};

export default Popup;
