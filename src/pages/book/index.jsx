import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react';
import ViewDetail from '../../components/Admin/Book/ViewDetail';
import { callFetchBookById } from '../../services/api';



const BookPage = () => {
  let location = useLocation();

  let params = new URLSearchParams(location.search);
  const id = params?.get("id"); //book id
  const [dataBook, setDataBook] = useState([]);

  useEffect(() => {
    fetchBook(id);
  }, [id]);
  console.log(id);  

  const fetchBook = async (id) => {
    const res = await callFetchBookById(id);
    console.log('check res', res);
    if(res && res.data){
      let raw = res.data;
      //process data
      raw.items = getImages(raw);
      setTimeout(() => {
        setDataBook(raw);
      }, 500)
    }
 }

 const getImages = (raw) => {
  const images = [];
  if(raw.thumbnail){
    images.push(
      {
        original : `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
        thumbnail : `${import.meta.env.VITE_BACKEND_URL}/images/book/${raw.thumbnail}`,
        originalClass: "original-image",
        thumbnailClass: "thumnail-image"
      }
    )
  }
  if(raw.slider) {
    raw.slider?.map((item) => {
      images.push(
        {
          original : `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          thumbnail : `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          originalClass: "original-image",
          thumbnailClass: "thumnail-image"
        }
      )
    })
  }
  return images;
 }

  console.log(">>check id", id)
  return (
    
    <>
      <ViewDetail dataBook={dataBook}/>
    </>
  )
}  

export default BookPage