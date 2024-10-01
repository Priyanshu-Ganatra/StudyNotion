function Error({ msg = "" }) {
  return (
    <div className="flex flex-1 justify-center items-center text-white text-3xl">
      {msg ? msg : 'Error 404 - Page Not Found'}
    </div>
  );
}

export default Error;