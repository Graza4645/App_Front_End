// App.js
import { DoubleNavbar } from './components/Navbar/DoubleNavbar';
// Add more components as needed

function App() {
   return (
    <div >
      <DoubleNavbar /> {/* Always visible on the left */}
      {/* <div >
        <Routes>
          <Route path="/" element={<FrontOffice />} />
          <Route path="/front-office" element={<FrontOffice />} />
        </Routes>
      </div> */}
    </div>
  );
}

export default App;
