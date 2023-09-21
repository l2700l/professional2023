import React, { useEffect, useState } from 'react';
import { AuthProvider } from './components/AuthProvider/AuthProvider';
import { Owner } from './pages/Owner/Owner';
import { Private } from './pages/Private/Private';
import { Public } from './pages/Public/Public';
import { User } from './pages/User/User';

function App() {
  const [page, setPage] = useState<JSX.Element>(<div></div>);
  const updatePage = () => {
    const hash = window.location.hash.slice(1);
    switch (hash) {
      case 'owner':
        setPage(<Owner/>)
        return;
      case 'public':
        setPage(<Public/>)
        return;
      case 'private':
        setPage(<Private/>)
        return;
      case 'user':
        setPage(<User/>)
        return;
      default:
        setPage(<div/>)
    }
  }
  useEffect(() => {
    window.addEventListener('hashchange', updatePage)
    return () => window.removeEventListener('hashchange', updatePage)
  }, [])
  return (
   <AuthProvider>{page}</AuthProvider>
  );
}

export default App;
