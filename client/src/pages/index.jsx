import axios from "axios";


const Home = () => {
  return (
    <div>
      HELLO
    </div>
  );
};

export async function getServerSideProps(context) {
  console.log(context.req.cookies);

  const response = await axios.get("/api/users/current-user")
    .catch(err => {
      console.log(err);
    });

  console.log(response);

  return {
    props: {}, // will be passed to the page component as props
  }
}

Home.defaultProps = {};


export default Home;