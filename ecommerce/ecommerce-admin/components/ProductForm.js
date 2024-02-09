
import { useEffect, useState } from "react";
import axios from "axios";
import { ReactSortable } from "react-sortablejs";
import { useRouter } from "next/router";
import Spinner from "./spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images:existingImages,
  category:existingCategory,
  properties:existingProperty
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category, setCategory] = useState(existingCategory || '')
  const [productProperties, setProductProperties] = useState(existingProperty ||   {})
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || [])
  const [goBack, setGoBack] = useState(false);
  const [isUploading, setIsUploading] = useState(false)
  const [categories, setCategories] = useState([])
  const router = useRouter();
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, [])
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { title, description, price,images,category,properties:productProperties };
    if (_id) {
      await axios.put('/api/products', { ...data, _id });

    } else {
      await axios.post('/api/products', data)

    }
    setGoBack(true);
  }
  if (goBack) {
    router.push('/products');
  }

  async function uploadImage(ev){
    const files = ev.target?.files;
    if(files?.length > 0){
      setIsUploading(true);
      const data = new FormData();
      for(const file of files){
        data.append('file', file)
      }
      const res = await axios.post('/api/upload', data)
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      })
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images){
    setImages(images)
  }

  function setProductProp(propName,value){
    setProductProperties(prev => {
      const newProductProps = {...prev}
      newProductProps[propName] = value
      return newProductProps
    })

  }

  const propertiestoFill = [];
  if(categories.length > 0 && category){
    let selectedCatInfo = categories.find(({_id})=> _id === category)
    propertiestoFill.push(...selectedCatInfo.properties)
    while(selectedCatInfo?.parent?.id){
      const parentCAT = categories.find(({_id})=> _id === selectedCatInfo?.parent?._id)
      propertiestoFill.push(...parentCAT.properties)
      selectedCatInfo = parentCAT;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Nome do Produto:</label>
      <input type="text" placeholder="nome do produto" value={title} onChange={ev => setTitle(ev.target.value)} />
      <label>Categoria:</label>
      <select value={category} onChange={ev => setCategory(ev.target.value)}>
        <option>Sem Categoria</option>
        {categories.length > 0 && categories.map(c => (
          <option value={c._id}>{c.name}</option>
        ))}
      </select>
      {propertiestoFill.length > 0  && propertiestoFill.map(p => (
        <div className="flex gap-1">
          <div>{p.name}</div>
          <select value={productProperties[p.name]} onChange={ev => setProductProp(p.name,ev.target.value)}>
            {p.value.map(v => (
              <option value={v}>{v}</option>
            ))}
          </select>
        </div>
      ))
      }
      <label>Foto:</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable list={images} 
        className="flex flex-wrap gap-2"
        setList={updateImagesOrder}>
      {!!images?.length && images.map(link => (
        <div key={link} className="h-24">
         <img src={link} className="rounded-lg"/>
        </div>
      ))}
      </ReactSortable>
      {isUploading && (
        <div className="h-24 p-1 flex items-center">
          <Spinner/>
        </div>
      )}
        <label className="flex w-24 h-24 text-center  flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload
          <input type="file" className="hidden" onChange={uploadImage}/>
        </label>
      </div>
      <label>Descrição:</label>
      <textarea placeholder="descrição" value={description} onChange={ev => setDescription(ev.target.value)}></textarea>
      <label>Preço:</label>
      <input type="text" placeholder="preço" value={price} onChange={ev => setPrice(ev.target.value)} />
      <button type="submit" className="btn-primary">Salvar</button>
    </form>
  );
}

