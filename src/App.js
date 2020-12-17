import { useState, useEffect } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import DrawImgae from './components/DrawImage';
function App() {
  const [client, setClient] = useState(null);

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
        uri: "http://localhost:4000"
        // uri: "http://61.83.147.71:4000"
      });
      setClient(client);
    } catch(e) {
      console.error(e);
    }
  }
  useEffect(() => {
    preLoad();
  }, [])
  
  return (
    client !== null ? (
      <div className="App">
      <ApolloProvider client={client}>
          <DrawImgae/>
      </ApolloProvider>
    </div>  
    ): null
  );
}

export default App;
