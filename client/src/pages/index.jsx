const Home = ({ currentUser }) => {
  return (
    <div>
      {currentUser ? "You are logged in" : "You are not logged in"}
    </div>
  );
};

Home.defaultProps = {};


export default Home;