import React, { useEffect, useState } from 'react';
import { AuthProvider } from './components/AuthProvider/AuthProvider';
import { CreateProduct } from './pages/CreateProduct/CreateProduct';
import { Order } from './pages/Order/Order';
import { Products } from './pages/Products/Products';
import { Refounds } from './pages/Refounds/Refounds';
// import { Owner } from './pages/Owner/Owner';
// import { Private } from './pages/Private/Private';
// import { Public } from './pages/Public/Public';
// import { User } from './pages/User/User';

function App() {
  const [page, setPage] = useState<JSX.Element>(<div></div>);
  const updatePage = () => {
    const hash = window.location.hash.slice(1);
    switch (hash) {
      case 'products':
        setPage(<Products/>)
        return;
      case 'create':
        setPage(<CreateProduct/>)
        return;
      case 'order':
        setPage(<Order/>)
        return;
      case 'refounds':
        setPage(<Refounds/>)
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
