let apiURL = "http://127.0.0.1:8000/api"; // URL por defecto para local
const domain = "aspy.ecuador";

{
  /*
if (import.meta.env.VITE_APP_ENV === "production") {
  apiURL = `https://api.${domain}`;
}
*/
}
export default apiURL;
