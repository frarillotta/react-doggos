import React, { useEffect, useState, Suspense } from 'react';
import './App.css';
import {getRandomDoggo} from "../API/DoggoApi"
import { useSpring, animated } from 'react-spring'

// import {motion} from 'framer-motion'


function preloadImage(src: string) {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.src = src
    img.onload = () => resolve(src)
  })
}

function createResource(promise) {
  let status = 'pending'
  let result = promise.then(
    resolved => {
      status = 'success'
      result = resolved
    },
    rejected => {
      status = 'error'
      result = rejected
    },
  )
  return {
    read() {
      if (status === 'pending') throw result
      if (status === 'error') throw result
      if (status === 'success') return result
      throw new Error('This should be impossible')
    },
  }
}

const resourceCache = {};

function getDoggoResource(imageUrl) {

  resourceCache[imageUrl] = resourceCache[imageUrl] || createResource(preloadImage(imageUrl));

  return resourceCache[imageUrl];

}

function App() {

  const [activeDoggos, setActiveDoggos] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [doggoResource, setDoggoResource] = useState<any>(null);

  
  const handleClick = async () => {

    const doggo = await getRandomDoggo();
    setActiveDoggos([...activeDoggos, doggo])
    setIndex(activeDoggos.length);

  }

  useEffect(()=>{
    
    if (activeDoggos.length === 0) {

      setDoggoResource(null);

    } else {
      
      setDoggoResource(getDoggoResource(activeDoggos[index]));
      
    }
  }, [activeDoggos, index])

  return (
    <div className="App">
      <div className="buttons-container">
        <button className={"button button--telesto"} onClick={handleClick}><span><span>I WANT GOOD BOY</span></span></button>
        <button className={"button button--mimas"} onClick={()=> index > 0 && setIndex(index - 1)}><span><span>WAIT SHOW ME THAT AGAIN</span></span></button>
      </div>
      <div className={"img-container"}>
      {doggoResource && 
        <Suspense fallback={<p>Loading...</p>}>
          <DoggoPic resource={doggoResource}/>
        </Suspense>
      }
      </div>
    </div>
  );
}


function DoggoPic({resource}) {
  const props = useSpring({
    from: { opacity: 0 },
    to: {opacity: 1},
    reset: true
  });

  const image = resource.read();

  return (
    <animated.div style={props}  
    >
      <img   
        className={"doggoPics"}
        src={image}
        alt={'waiting'}
      />
    </animated.div>
  )

}

export default App;
