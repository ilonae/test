import React from "react";
import { CTX } from '../Reducer'
import SocketIOFileUpload from "socketio-file-upload"

type UploadButtonProps = {
  order?: string,
  parentCallback?: (...args: any[]) => any
};

const UploadButton: React.FC<UploadButtonProps> = ({ parentCallback }) => {
  const [textValue, changeTextValue] = React.useState("");
  const { state, dispatch } = React.useContext(CTX);
  const fileRef = React.useRef(null);
  console.log(state.user)
  React.useEffect(() => {
    console.log(state.user)
    state.socket.on('message', function (msg: string) {
      console.log("chat message recieved")
      dispatch('RECEIVE_MESSAGE', msg);
    })
  }, [])

  const onKeyPressHandler = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log("PRESSED")
      state.socket.emit('sent message', { from: state.user, msg: textValue, channel: state.selectedChannel });
      dispatch('RECEIVE_MESSAGE', { from: state.user, msg: textValue, channel: state.selectedChannel });
      changeTextValue('')
    }
  }

  const onChangeHandler = (e: any) => {
    changeTextValue(e.target.value);
  }

  React.useEffect(() => {
    const siofu = new SocketIOFileUpload(state.socket);
    siofu.listenOnInput(fileRef.current);
  }, [state.socket])

  const InputAddon = () => {
    fileRef.current.click();
  }

  return (
    <div>
      <input ref={fileRef} type="file" style={{ display: 'none' }} />
      <input onChange={onChangeHandler} value={textValue} onKeyPress={onKeyPressHandler} />
    </div>
  );
};
export default UploadButton;
