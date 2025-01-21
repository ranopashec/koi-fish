import React from 'react';
import Canvas from './Canvas';
import backgroundImage from './assets/image.png';

const App: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center w-screen h-screen"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <Canvas />
    </div>
  );
};

export default App;
