import { ticketingService } from "../services/ticketing";

const Home = ({ currentUser }) => {
  return (
    <div>
      {currentUser ? "You are logged in" : "You are not logged in"}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { data } = await ticketingService(context).get("/api/users/current-user");

  return { props: data };
}

Home.defaultProps = {};


export default Home;