import { useState } from "react";
import styles from "./Popup.module.scss";

const Popup = () => {
  const [scrapingData] = useState(localStorage.getItem("dozn-scraping-data"));

  if (!scrapingData) {
    return <div className={`${styles.container} render-animation`}></div>;
  } else {
    return (
      <div className={`${styles.container} render-animation`}>
        <div className={styles.content}>{scrapingData}</div>
      </div>
    );
  }
};

export default Popup;
