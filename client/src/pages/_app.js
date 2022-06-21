import 'bootstrap/dist/css/bootstrap.min.css';
import { ticketingService } from "../services/ticketing";
import Header from "../components/header";

function MyApp({ Component, pageProps, currentUser }) {

  return (
    <div>
      <Header currentUser={currentUser}/>
      <Component {...pageProps} currentUser={currentUser}/>
    </div>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { data } = await ticketingService(ctx).get("/api/users/current-user");

  return { ...data };
}


export default MyApp;