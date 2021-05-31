import { useState, useEffect } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import DrawImgae from './components/DrawImage';
import useInput from "./hooks/useInput";

function App() {
  const [client, setClient] = useState(null);
  const selectInput = useInput("");
  const [serverUrl, setServerUrl] = useState("http://localhost:4000");

  const preLoad = async () => {
    try{
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        request: async operation => {
          const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrNnJibWNzaDAwMmIwNzgwdmd5NzZlc28iLCJpYXQiOjE2MDY5ODU5MzZ9.PwmRbVoxPymQCo_0X_VDN10aycreq2bWEt0om4PCHb0"
          return operation.setContext({
            headers: { Authorization: `Bearer ${token}` }
          });
        },
        uri: serverUrl,
        // uri: "http://192.168.0.150:4000",
        // uri: "http://61.83.147.71:4000"
      });
      setClient(client);
    } catch(e) {
      console.error(e);
    }
  }
  useEffect(() => {
    preLoad();
  }, [serverUrl])
  const submitHandler= (evt) => {
    evt.preventDefault();
    setServerUrl(selectInput.value);
    console.log(selectInput.value);
  }
  return (
    client !== null ? (
      <div className="App">
      <ApolloProvider client={client}>
      <form onSubmit={submitHandler}>
        <label for="server-ip">Choose a Server:</label>
        <select {...selectInput} name="server-ip">
          <option value="http://localhost:4000">Localhost</option>
          <option value="http://192.168.0.150:4000">MacPro</option>
          <option value="http://61.83.147.71:4000">HP Server</option>
        </select>
        <input type="submit" value="Submit"></input>
      </form>
      <h1>현재접속 서버 </h1>
      <h1>{serverUrl}</h1>
        <DrawImgae/>  
      </ApolloProvider>
    </div>  
    ): null
  );
}

export default App;
