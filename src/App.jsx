import Carousel from './components/Carousel';

export default function App() {
  return (
    <div style={{ height: '600px', position: 'relative' }}>
      <Carousel
        baseWidth={300}
        autoplay={false}
        autoplayDelay={3000}
        pauseOnHover={false}
        loop={false}
        round={false}
      />
    </div>
  );
}
