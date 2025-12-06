import airasia from "../assets/flights/airasia.png";
import ana from "../assets/flights/ana.png";
import cebupacific from "../assets/flights/cebupacific.png";
import emirates from "../assets/flights/emirates.png";
import pal from "../assets/flights/pal.png";
import singapore from "../assets/flights/singapore.png";
import swiss from "../assets/flights/swiss.png";

export const getAirlineLogo = (name = "") => {
  if (!name) return "";
  const key = name.toLowerCase().replace(/\s/g, "");
  const logos = {
    airasia,
    allnipponairways: ana,
    cebupacific,
    emirates,
    philippineairlines: pal,
    singaporeairlines: singapore,
    swissinternationalairlines: swiss,
  };
  return logos[key] || "";
};
