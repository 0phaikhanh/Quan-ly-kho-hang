// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import Routes
import routes from './routes/routes';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container d-flex flex-column min-vh-100">
          <Header />
          
          <main className="flex-grow-1">
            <React.Suspense fallback={<Loading />}>
              <Routes>
                {routes.map((route, index) => {
                  if (route.children) {
                    return (
                      <Route key={index} path={route.path} element={route.element}>
                        {route.children.map((childRoute, childIndex) => (
                          <Route
                            key={childIndex}
                            path={childRoute.path}
                            element={childRoute.element}
                          >
                            {childRoute.children && childRoute.children.map((grandChild, grandChildIndex) => (
                              <Route
                                key={grandChildIndex}
                                path={grandChild.path}
                                element={grandChild.element}
                              />
                            ))}
                          </Route>
                        ))}
                      </Route>
                    );
                  } else {
                    return (
                      <Route
                        key={index}
                        path={route.path}
                        element={route.element}
                      />
                    );
                  }
                })}
              </Routes>
            </React.Suspense>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;