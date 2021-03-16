import React, { useEffect, useState, Suspense } from 'react';
import './App.css';
import {getRandomDoggo} from "../API/DoggoApi"
import {motion} from 'framer-motion'


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
  const [index, setIndex] = useState<number>(0);
  const [doggoResource, setDoggoResource] = useState<any>(null);

  const handleClick = async () => {

    const doggo = await getRandomDoggo();
    setActiveDoggos([...activeDoggos, doggo])
    setIndex(activeDoggos.length + 1);

  }

  useEffect(()=>{
    console.log(activeDoggos, resourceCache)
    if (activeDoggos.length === 0) {

      setDoggoResource(null);

    } else {

      console.log(activeDoggos, index);
      
      setDoggoResource(getDoggoResource(activeDoggos[index]));
      
    }
  }, [activeDoggos, index])

  return (
    <div className="App">
      <button onClick={handleClick}>I DEMAND A GOOD BOY</button>
      <button onClick={()=>setIndex(index - 1)}>prev doggo</button>
      {doggoResource && 
        <Suspense fallback={<p>Loading...</p>}>
            <DoggoPic resource={doggoResource}></DoggoPic>
      </Suspense>
      }
    </div>
  );
}


function DoggoPic({resource}) {

  const image = resource.read();

  return (
    <motion.img     
      animate={{ rotate: 360 }}
      className={"doggoPics"}
      src={image}
      alt={'waiting'}
    />
  )

}

export default App;
