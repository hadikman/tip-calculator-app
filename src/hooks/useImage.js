import {useEffect, useState} from 'react';

export default function useImage(fileName) {
  const [image, setImage] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function getImg() {
      try {
        const img = await import(`../assets/${fileName}`);
        setImage(img.default);
      } catch (err) {
        setError(err);
      }
    }
    getImg();
  }, [fileName]);

  return {image, error};
}
