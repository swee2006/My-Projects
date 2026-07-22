function PopUp({ type, message }) {
  return <div className={`popup-message ${type}`}>{message}</div>;
}

export default PopUp;
