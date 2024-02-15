import { InfinitySpin } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <InfinitySpin
        visible={true}
        // height="80"
        width="200"
        ariaLabel="InfinitySpin -loading"
        wrapperStyle={{}}
        wrapperClass="InfinitySpin -wrapper"
        color="#F4442E"
        // colors={['#F4442E', '#F4442E', '#F4442E', '#F4442E', '#F4442E']}
        backgroundColor="#F4442E"
      />
    </div>
  );
};

export default Loader;
